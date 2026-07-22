<?php

namespace App\Http\Middleware;

use App\Models\FrontpageContent;
use App\Models\Invoice;
use App\Models\Notification;
use App\Models\PaymentProof;
use App\Models\Project;
use App\Models\ProjectRequest;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'app' => [
                'name' => config('app.name'),
            ],
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'isAdmin' => $request->user()->isAdmin(),
                    'company' => $request->user()->company ?? 'Acme Corporation',
                    'avatar' => $request->user()->avatar ? asset('storage/' . $request->user()->avatar) : null,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'invoice_no' => $request->session()->get('invoice_no'),
                'appointment' => $request->session()->get('appointment'),
            ],
            'frontpage' => FrontpageContent::getCurrent()->toArray(),
            'currentProjects' => Project::where('status', 'in_progress')
                ->select(['title', 'description', 'category', 'progress', 'status', 'icon_color'])
                ->get()
                ->map(function ($project) {
                    $category = $project->category ?: 'Web System';
                    $badgeColors = [
                        'Fintech' => 'bg-blue-500',
                        'Retail' => 'bg-purple-500',
                        'Healthcare' => 'bg-emerald-500',
                        'SaaS' => 'bg-orange-500',
                        'Web System' => 'bg-blue-500',
                        'Website' => 'bg-indigo-500',
                        'Mobile App' => 'bg-emerald-500',
                        'E-Commerce' => 'bg-purple-500',
                        'Digital Marketing' => 'bg-pink-500',
                        'IT Solutions' => 'bg-slate-500',
                        'Game Development' => 'bg-yellow-500',
                    ];
                    $images = [
                        'Fintech' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                        'Retail' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
                        'Healthcare' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
                        'SaaS' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                        'Web System' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                        'Website' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
                        'Mobile App' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
                        'E-Commerce' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
                        'Digital Marketing' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                        'Game Development' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
                    ];
                    return [
                        'title' => $project->title,
                        'description' => $project->description ?? '',
                        'category' => $category,
                        'badge' => $category,
                        'badgeColor' => $badgeColors[$category] ?? 'bg-blue-500',
                        'progress' => $project->progress ?? 0,
                        'image' => $images[$category] ?? 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
                    ];
                })
                ->values()
                ->toArray(),
            'unreadMessagesCount' => $request->user()
                ? ($request->user()->isAdmin()
                    ? Ticket::whereNull('admin_viewed_at')->count()
                        + Notification::where('user_id', $request->user()->id)
                            ->where('is_read', false)
                            ->count()
                    : $request->user()->tickets()->whereNull('viewed_at')->count())
                : 0,
            'pendingRequestsCount' => $request->user()?->isAdmin()
                ? ProjectRequest::where('status', 'pending')->count()
                : 0,
            'pendingPaymentsCount' => $request->user()?->isAdmin()
                ? PaymentProof::where('status', 'pending')->count()
                : 0,
            'pendingInvoicesCount' => $request->user()
                ? ($request->user()->isAdmin()
                    ? Invoice::where('status', 'pending')->count()
                    : $request->user()->invoices()->where('status', 'pending')->count())
                : 0,
            'appointmentStatus' => $request->user() && !$request->user()->isAdmin()
                ? ProjectRequest::where('user_id', $request->user()->id)
                    ->latest()
                    ->value('status')
                : null,
        ];
    }
}
