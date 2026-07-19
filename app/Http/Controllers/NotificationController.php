<?php

namespace App\Http\Controllers;

use App\Models\PaymentProof;
use App\Models\ProjectRequest;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $ticketQuery = $user->isAdmin()
            ? Ticket::whereNull('admin_viewed_at')
            : $user->tickets()->whereNull('viewed_at');

        $ticketNotifications = $ticketQuery
            ->with('project', 'user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($t) => [
                'type' => 'ticket',
                'id' => $t->ticket_no,
                'subject' => $t->subject,
                'description' => $t->description,
                'name' => $t->name ?? $t->user?->name,
                'email' => $t->email ?? $t->user?->email,
                'date' => $t->created_at->format('M d, Y'),
                'url' => route('support') . '?ticket=' . $t->ticket_no,
            ]);

        $items = collect($ticketNotifications);

        if ($user->isAdmin()) {
            $pendingRequests = ProjectRequest::where('status', 'pending')
                ->with('user')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn ($r) => [
                    'type' => 'project_request',
                    'id' => (string) $r->id,
                    'subject' => 'New project request: ' . $r->company_name,
                    'description' => $r->features ? substr($r->features, 0, 200) : null,
                    'name' => $r->contact_name,
                    'email' => $r->contact_email,
                    'date' => $r->created_at->format('M d, Y'),
                    'url' => $r->user?->projects()->latest()->first()
                        ? route('projects.show', $r->user->projects()->latest()->first())
                        : route('requests'),
                ]);

            $pendingProofs = PaymentProof::where('status', 'pending')
                ->with('invoice.user')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn ($p) => [
                    'type' => 'payment_proof',
                    'id' => (string) $p->id,
                    'subject' => 'Payment proof: ' . $p->invoice->invoice_no,
                    'description' => $p->invoice?->items->first()?->description ?? 'Payment proof submitted',
                    'name' => $p->name,
                    'email' => $p->email,
                    'date' => $p->created_at->format('M d, Y'),
                    'url' => route('invoices') . '?status=pending',
                ]);

            $items = $items->concat($pendingRequests)->concat($pendingProofs)->sortByDesc('date')->values();
        }

        return response()->json([
            'count' => $items->count(),
            'items' => $items,
        ]);
    }

    public function markAsRead(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->isAdmin()) {
            Ticket::whereNull('admin_viewed_at')->update(['admin_viewed_at' => now()]);
        } else {
            $user->tickets()->whereNull('viewed_at')->update(['viewed_at' => now()]);
        }

        return response()->json(['success' => true]);
    }
}
