<?php

namespace App\Http\Controllers;

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

        $query = $user->isAdmin()
            ? Ticket::whereNull('admin_viewed_at')
            : $user->tickets()->whereNull('viewed_at');

        $unread = $query
            ->with('project', 'user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->ticket_no,
                'subject' => $t->subject,
                'description' => $t->description,
                'name' => $t->name ?? $t->user?->name,
                'email' => $t->email ?? $t->user?->email,
                'date' => $t->created_at->format('M d, Y'),
                'url' => route('support') . '?ticket=' . $t->ticket_no,
            ]);

        return response()->json([
            'count' => $unread->count(),
            'items' => $unread,
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
