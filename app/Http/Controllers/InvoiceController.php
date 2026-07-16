<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $status = $request->query('status');

        $query = $user->isAdmin()
            ? Invoice::query()->with('project', 'user')
            : $user->invoices()->with('project');

        $invoices = $query
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByDesc('issue_date')
            ->get()
            ->map(fn ($i) => $this->formatInvoice($i));

        if ($user->isAdmin()) {
            $all = Invoice::all();
            $totalBilling = $all->sum('amount');
            $totalPending = $all->where('status', 'pending')->sum('amount');
            $totalComplete = $all->where('status', 'paid')->sum('amount');
            $totalOverdue = $all->where('status', 'overdue')->sum('amount');
            $totalRevenue = $all->where('status', 'paid')->sum('amount');

            $widgets = [
                'total_billing' => number_format($totalBilling, 2),
                'total_pending' => number_format($totalPending, 2),
                'total_pending_count' => $all->where('status', 'pending')->count(),
                'total_complete' => number_format($totalComplete, 2),
                'total_complete_count' => $all->where('status', 'paid')->count(),
                'total_overdue' => number_format($totalOverdue, 2),
                'total_revenue' => number_format($totalRevenue, 2),
            ];

            return Inertia::render('Invoices', [
                'invoices' => $invoices,
                'filters' => ['status' => $status],
                'widgets' => $widgets,
                'clients' => User::where('role', User::ROLE_CLIENT)->get(['id', 'company', 'name'])->map(
                    fn ($u) => ['id' => $u->id, 'label' => $u->company ?? $u->name]
                ),
            ]);
        }

        return Inertia::render('Invoices', [
            'invoices' => $invoices,
            'filters' => ['status' => $status],
        ]);
    }

    public function show(Invoice $invoice)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin() && $invoice->user_id !== $user->id) {
            abort(403);
        }

        $invoice->load('project', 'user');

        return Inertia::render('InvoiceDetail', [
            'invoice' => $this->formatInvoice($invoice, true),
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => ['required', Rule::exists('users', 'id')],
            'project_id' => ['nullable', Rule::exists('projects', 'id')],
            'company_name' => ['nullable', 'string', 'max:255'],
            'company_address' => ['nullable', 'string', 'max:1000'],
            'company_no' => ['nullable', 'string', 'max:255'],
            'invoice_no' => ['required', 'string', 'max:255', 'unique:invoices,invoice_no'],
            'issue_date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['paid', 'pending', 'overdue'])],
            'payment_url' => ['nullable', 'url', 'max:1000'],
        ]);

        $invoice = Invoice::create([
            'user_id' => $validated['user_id'],
            'project_id' => $validated['project_id'] ?: null,
            'invoice_no' => $validated['invoice_no'],
            'issue_date' => $validated['issue_date'],
            'amount' => $validated['amount'],
            'status' => $validated['status'],
            'company_name' => $validated['company_name'],
            'company_address' => $validated['company_address'],
            'company_no' => $validated['company_no'],
            'payment_url' => $validated['payment_url'],
        ]);

        return redirect()->route('invoices')->with('success', 'Invoice generated successfully.');
    }

    public function update(Request $request, Invoice $invoice)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['paid', 'pending', 'overdue'])],
            'payment_url' => ['nullable', 'url', 'max:1000'],
            'amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        $invoice->update($validated);

        return redirect()->route('invoices')->with('success', 'Invoice updated successfully.');
    }

    public function destroy(Invoice $invoice)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $invoice->delete();

        return redirect()->route('invoices')->with('success', 'Invoice deleted successfully.');
    }

    private function formatInvoice(Invoice $i, bool $full = false): array
    {
        $data = [
            'id' => $i->invoice_no,
            'invoice_id' => $i->id,
            'client' => $i->user?->company ?? $i->user?->name,
            'company_name' => $i->company_name ?? $i->user?->company,
            'company_address' => $i->company_address,
            'company_no' => $i->company_no,
            'project' => $i->project?->title,
            'date' => $i->issue_date->format('M d, Y'),
            'amount' => '$' . number_format($i->amount, 2),
            'amount_raw' => (float) $i->amount,
            'status' => $i->status,
            'payment_url' => $i->payment_url,
        ];

        if ($full) {
            $data['issue_date'] = $i->issue_date->format('M d, Y');
        }

        return $data;
    }
}
