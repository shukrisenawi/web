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

        Ticket::whereNull('viewed_at')->update(['viewed_at' => now()]);

        $tickets = Ticket::with('project', 'user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->ticket_no,
                'subject' => $t->subject,
                'description' => $t->description,
                'status' => $t->status,
                'priority' => $t->priority,
                'project' => $t->project?->title,
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

        return redirect()->route('support')->with('success', 'Message sent successfully.');
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
