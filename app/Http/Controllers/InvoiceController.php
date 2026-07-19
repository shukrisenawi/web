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
                'projects' => Project::with('user')->get(['id', 'title', 'user_id'])->map(
                    fn ($p) => ['id' => $p->id, 'label' => $p->title, 'user_id' => $p->user_id]
                ),
                'preselect_user_id' => $request->query('user_id'),
                'preselect_project_id' => $request->query('project_id'),
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

        $invoice->load('project', 'user', 'items', 'paymentProofs');

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
            'company_address' => ['nullable', 'string', 'max:1000'],
            'company_no' => ['nullable', 'string', 'max:255'],
            'issue_date' => ['required', 'date'],
            'status' => ['required', Rule::in(['paid', 'pending', 'overdue'])],
            'payment_url' => ['nullable', 'url', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.amount' => ['required', 'numeric', 'min:0'],
        ]);

        $total = collect($validated['items'])->sum(fn ($i) => (float) $i['amount']);

        $client = User::find($validated['user_id']);

        $invoice = Invoice::create([
            'user_id' => $validated['user_id'],
            'project_id' => $validated['project_id'] ?: null,
            'invoice_no' => $this->nextInvoiceNo(),
            'issue_date' => $validated['issue_date'],
            'amount' => $total,
            'status' => $validated['status'],
            'company_name' => $client?->company ?? $client?->name,
            'company_address' => $validated['company_address'] ?? $client?->business_address,
            'company_no' => $validated['company_no'],
            'payment_url' => $validated['payment_url'],
        ]);

        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'description' => $item['description'],
                'amount' => $item['amount'],
            ]);
        }

        return redirect()->route('invoices')
            ->with('success', 'Invoice generated successfully.')
            ->with('invoice_no', $invoice->invoice_no);
    }

    private function nextInvoiceNo(): string
    {
        $latest = Invoice::where('invoice_no', 'like', 'INV-'.date('Y').'-%')
            ->orderByDesc('id')
            ->first();

        $next = $latest ? ((int) substr($latest->invoice_no, -3)) + 1 : 1;

        return 'INV-'.date('Y').'-'.str_pad((string) $next, 3, '0', STR_PAD_LEFT);
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
            $data['items'] = $i->items->map(fn ($item) => [
                'description' => $item->description,
                'amount' => '$'.number_format($item->amount, 2),
            ])->values();
            $data['proofs'] = $i->paymentProofs->map(fn ($p) => [
                'id' => $p->id,
                'payment_method' => $p->payment_method,
                'name' => $p->name,
                'status' => $p->status,
                'created_at' => $p->created_at->format('M d, Y'),
            ])->values();
        }

        return $data;
    }
}
