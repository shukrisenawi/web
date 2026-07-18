<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->isAdmin()) {
            Ticket::whereNull('admin_viewed_at')->update(['admin_viewed_at' => now()]);
        } else {
            $user->tickets()->whereNull('viewed_at')->update(['viewed_at' => now()]);
        }

        $query = $user->isAdmin()
            ? Ticket::query()->with('project', 'user')
            : $user->tickets()->with('project', 'user');

        $isAdmin = $user->isAdmin();

        $tickets = $query
            ->with('replies.user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->ticket_no,
                'ticket_id' => $t->id,
                'subject' => $t->subject,
                'description' => $t->description,
                'status' => $t->status,
                'last_reply_by' => $t->last_reply_by,
                'can_reply' => $t->status !== 'resolved'
                    && ($isAdmin || $t->last_reply_by !== 'client'),
                'priority' => $t->priority,
                'project' => $t->project?->title,
                'client' => $t->user?->company ?? $t->user?->name,
                'name' => $t->name ?? $t->user?->name,
                'email' => $t->email ?? $t->user?->email,
                'date' => $t->created_at->format('M d, Y'),
                'replies' => $t->replies->map(fn ($r) => [
                    'id' => $r->id,
                    'message' => $r->message,
                    'user' => $r->user?->name ?? 'Unknown',
                    'is_admin' => $r->user?->isAdmin() ?? false,
                    'date' => $r->created_at->format('M d, Y h:i A'),
                ]),
            ]);

        return Inertia::render('Support', [
            'tickets' => $tickets,
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'project_id' => ['nullable', Rule::exists('projects', 'id')->where('user_id', $user->id)],
        ]);

        $ticket = $this->createTicket($validated, $user->id);

        return redirect()->route('support')->with('success', 'Ticket created successfully. Our team will respond soon.');
    }

    public function update(Request $request, Ticket $ticket)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['open', 'in_progress', 'resolved'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
        ]);

        $ticket->update($validated);

        return redirect()->route('support')->with('success', 'Ticket updated successfully.');
    }

    public function reply(Request $request, Ticket $ticket)
    {
        /** @var User $user */
        $user = Auth::user();

        $isAdmin = $user->isAdmin();

        if (! $isAdmin && $ticket->user_id !== $user->id) {
            abort(403);
        }

        // #6 - Case closed once resolved: nobody can reply.
        if ($ticket->status === 'resolved') {
            return back()->with('error', 'This ticket is closed and can no longer receive replies.');
        }

        // #6 - Client can only reply if it is their turn (they never replied,
        // or the admin replied last). Admins can always reply.
        if (! $isAdmin && $ticket->last_reply_by === 'client') {
            return back()->with('error', 'Please wait for our team to respond before replying again.');
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $ticket->replies()->create([
            'user_id' => $user->id,
            'message' => $validated['message'],
        ]);

        $ticket->update([
            'last_reply_by' => $isAdmin ? 'admin' : 'client',
            'status' => $ticket->status === 'open' ? 'in_progress' : $ticket->status,
            'viewed_at' => $isAdmin ? null : $ticket->viewed_at,
            'admin_viewed_at' => $isAdmin ? $ticket->admin_viewed_at : null,
        ]);

        return redirect()->route('support')->with('success', 'Reply sent successfully.');
    }

    public function destroy(Ticket $ticket)
    {
        /** @var User $user */
        $user = Auth::user();

        if (! $user->isAdmin()) {
            abort(403);
        }

        $ticket->delete();

        return redirect()->route('support')->with('success', 'Ticket deleted successfully.');
    }

    public function storeFromContact(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:5000'],
        ]);

        $validated['description'] = $validated['message'] ?? null;
        unset($validated['message']);

        $ticket = $this->createTicket($validated, null);

        return redirect()->route('home')->with('success', 'Thank you for your message. We will get back to you soon.');
    }

    private function createTicket(array $validated, ?int $userId): Ticket
    {
        $latest = Ticket::latest('id')->first();
        $nextNumber = $latest ? ((int) substr($latest->ticket_no, -3)) + 1 : 1;

        $validated['ticket_no'] = 'TKT-'.date('Y').'-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
        $validated['user_id'] = $userId;
        $validated['status'] = 'open';
        $validated['priority'] = $validated['priority'] ?? 'medium';
        $validated['admin_viewed_at'] = null;

        if ($userId) {
            $validated['viewed_at'] = now();
        }

        return Ticket::create($validated);
    }
}
