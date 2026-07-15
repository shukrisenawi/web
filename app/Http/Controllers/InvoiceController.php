<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $status = $request->query('status');

        $invoices = $user->invoices()
            ->with('project')
            ->when($status, fn ($query) => $query->where('status', $status))
            ->orderByDesc('issue_date')
            ->get()
            ->map(fn ($i) => [
                'id' => $i->invoice_no,
                'project' => $i->project?->title,
                'date' => $i->issue_date->format('M d, Y'),
                'amount' => '$'.number_format($i->amount, 2),
                'status' => $i->status,
            ]);

        return Inertia::render('Invoices', [
            'invoices' => $invoices,
            'filters' => ['status' => $status],
        ]);
    }
}
