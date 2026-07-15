<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $unread = Ticket::with('project', 'user')
            ->whereNull('viewed_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->ticket_no,
                'subject' => $t->subject,
                'description' => $t->description,
                'name' => $t->name ?? $t->user?->name,
                'email' => $t->email ?? $t->user?->email,
                'date' => $t->created_at->format('M d, Y'),
                'url' => route('support'),
            ]);

        return response()->json([
            'count' => $unread->count(),
            'items' => $unread,
        ]);
    }

    public function markAsRead(Request $request): JsonResponse
    {
        Ticket::whereNull('viewed_at')->update(['viewed_at' => now()]);

        return response()->json(['success' => true]);
    }
}
