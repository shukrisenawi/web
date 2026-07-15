<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $status = $request->query('status');
        $search = $request->query('search');

        $projects = $user->projects()
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($search, fn ($query) => $query->where('title', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'category' => $p->category,
                'description' => $p->description,
                'progress' => $p->progress,
                'status' => $p->status,
                'icon_color' => $p->icon_color,
                'created_at' => $p->created_at->format('M d, Y'),
            ]);

        return Inertia::render('Projects', [
            'projects' => $projects,
            'filters' => ['status' => $status, 'search' => $search],
        ]);
    }
}
