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
            'frontpage' => $frontpage = FrontpageContent::getCurrent()->toArray(),
            'currentProjects' => collect(array_slice($frontpage['projects'] ?? [], 0, 4))->map(function ($project) {
                $category = $project['category'] ?? 'Web System';
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
                return [
                    'title' => $project['title'] ?? '',
                    'description' => $project['description'] ?? '',
                    'category' => $category,
                    'badge' => $category,
                    'badgeColor' => $badgeColors[$category] ?? 'bg-blue-500',
                    'progress' => $project['progress'] ?? 0,
                    'image' => $project['image'] ?? 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
                ];
            })->values()->toArray(),
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
