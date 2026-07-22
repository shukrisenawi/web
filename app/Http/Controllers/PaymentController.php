<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Invoice;
use App\Models\PaymentProof;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $proofs = PaymentProof::with('invoice.user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'invoice_no' => $p->invoice->invoice_no,
                'client' => $p->invoice->user?->company ?? $p->invoice->user?->name ?? 'N/A',
                'payment_method' => $p->payment_method,
                'name' => $p->name,
                'email' => $p->email,
                'amount' => '$' . number_format($p->invoice->amount, 2),
                'proof_url' => $p->proof_path ? Storage::url($p->proof_path) : null,
                'status' => $p->status,
                'created_at' => $p->created_at->format('M d, Y'),
            ]);

        return Inertia::render('AdminPayments', [
            'proofs' => $proofs,
        ]);
    }

    public function show(string $invoiceNo)
    {
        $invoice = Invoice::where('invoice_no', $invoiceNo)->firstOrFail();
        $invoice->load('items', 'paymentProofs');

        return Inertia::render('Payment', [
            'invoice' => [
                'id' => $invoice->invoice_no,
                'invoice_id' => $invoice->id,
                'amount' => number_format($invoice->amount, 2),
                'amount_raw' => (float) $invoice->amount,
                'status' => $invoice->status,
                'issue_date' => $invoice->issue_date->format('M d, Y'),
                'items' => $invoice->items->map(fn ($item) => [
                    'description' => $item->description,
                    'amount' => number_format($item->amount, 2),
                ])->values(),
                'proofs' => $invoice->paymentProofs->map(fn ($p) => [
                    'id' => $p->id,
                    'payment_method' => $p->payment_method,
                    'name' => $p->name,
                    'status' => $p->status,
                    'created_at' => $p->created_at->format('M d, Y'),
                ])->values(),
            ],
        ]);
    }

    public function storeProof(Request $request)
    {
        $validated = $request->validate([
            'invoice_no' => ['required', 'string', 'exists:invoices,invoice_no'],
            'payment_method' => ['required', 'string', 'in:bank_transfer,qr_code'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'proof' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:6144'],
        ]);

        $invoice = Invoice::where('invoice_no', $validated['invoice_no'])->first();

        if ($invoice->status === 'paid') {
            return back()->withErrors(['invoice_no' => 'This invoice has already been paid.']);
        }

        $path = $request->file('proof')->store('payment-proofs', 'public');

        $proof = PaymentProof::create([
            'invoice_id' => $invoice->id,
            'payment_method' => $validated['payment_method'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'proof_path' => $path,
            'status' => 'pending',
        ]);

        ActivityLog::create([
            'user_id' => $invoice->user_id,
            'project_id' => $invoice->project_id,
            'related_type' => PaymentProof::class,
            'related_id' => $proof->id,
            'type' => 'payment',
            'description' => "Payment proof submitted for invoice {$invoice->invoice_no} via {$validated['payment_method']}",
        ]);

        return back()->with('success', 'Proof of payment submitted successfully. We will verify it shortly.');
    }

    public function verify(Request $request, int $proofId)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:verified,rejected'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $proof = PaymentProof::findOrFail($proofId);
        $proof->update($validated);

        if ($validated['status'] === 'verified') {
            $invoice = $proof->invoice;
            $invoice->update(['status' => 'paid', 'paid_at' => now()]);

            ActivityLog::create([
                'user_id' => $invoice->user_id,
                'project_id' => $invoice->project_id,
                'related_type' => PaymentProof::class,
                'related_id' => $proof->id,
                'type' => 'payment',
                'description' => "Payment for invoice {$invoice->invoice_no} verified and marked as paid",
            ]);

            if (! $invoice->project_id) {
                $this->autoCreateProject($invoice);
            }
        } else {
            ActivityLog::create([
                'user_id' => $invoice->user_id,
                'project_id' => $invoice->project_id,
                'related_type' => PaymentProof::class,
                'related_id' => $proof->id,
                'type' => 'payment',
                'description' => "Payment proof for invoice {$invoice->invoice_no} was rejected" . (!empty($validated['notes']) ? ': ' . $validated['notes'] : ''),
            ]);
        }

        return back()->with('success', 'Payment proof ' . $validated['status'] . ' successfully.');
    }

    private function autoCreateProject(Invoice $invoice): void
    {
        $items = $invoice->items;
        $firstDesc = $items->first()?->description ?? 'Project';
        $allDescs = $items->pluck('description')->implode("\n");

        $serviceType = 'web_system';
        $lower = strtolower($firstDesc);
        if (str_contains($lower, 'website')) {
            $serviceType = 'website';
        } elseif (str_contains($lower, 'mobile') || str_contains($lower, 'app')) {
            $serviceType = 'mobile_app';
        } elseif (str_contains($lower, 'marketing') || str_contains($lower, 'seo')) {
            $serviceType = 'digital_marketing';
        } elseif (str_contains($lower, 'game')) {
            $serviceType = 'game_development';
        } elseif (str_contains($lower, 'it') || str_contains($lower, 'equipment') || str_contains($lower, 'setup')) {
            $serviceType = 'it_solutions';
        }

        $serviceLabels = [
            'web_system' => 'Web System',
            'website' => 'Website Development',
            'mobile_app' => 'Mobile App Development',
            'digital_marketing' => 'Digital Marketing',
            'it_solutions' => 'IT Solutions',
            'game_development' => 'Game Development',
        ];

        $project = \App\Models\Project::create([
            'user_id' => $invoice->user_id,
            'title' => $firstDesc,
            'category' => $serviceLabels[$serviceType],
            'service_type' => $serviceType,
            'description' => $allDescs,
            'progress' => 0,
            'status' => 'in_progress',
            'payment_status' => 'paid',
            'icon_color' => '#2563eb',
        ]);

        $invoice->update(['project_id' => $project->id]);

        ActivityLog::create([
            'user_id' => $invoice->user_id,
            'project_id' => $project->id,
            'related_type' => \App\Models\Project::class,
            'related_id' => $project->id,
            'type' => 'project',
            'description' => "Auto-created project \"{$project->title}\" from paid invoice {$invoice->invoice_no}",
        ]);
    }
}
