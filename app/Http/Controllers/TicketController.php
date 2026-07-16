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

        if (! $user->isAdmin()) {
            Ticket::whereNull('viewed_at')->update(['viewed_at' => now()]);
        }

        $query = $user->isAdmin()
            ? Ticket::query()->with('project', 'user')
            : $user->tickets()->with('project', 'user');

        $tickets = $query
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->ticket_no,
                'ticket_id' => $t->id,
                'subject' => $t->subject,
                'description' => $t->description,
                'status' => $t->status,
                'priority' => $t->priority,
                'project' => $t->project?->title,
                'client' => $t->user?->company ?? $t->user?->name,
                'name' => $t->name ?? $t->user?->name,
                'email' => $t->email ?? $t->user?->email,
                'date' => $t->created_at->format('M d, Y'),
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

        return Ticket::create($validated);
    }
}
