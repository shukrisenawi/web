<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FrontpageController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProjectRequestAdminController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProjectRequestController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
})->name('home');

Route::get('/services', function () {
    return inertia('Services');
})->name('services');

Route::get('/services/{slug}', function (string $slug) {
    $products = $slug === 'it-equipment-supply-setup'
        ? \App\Models\Product::where('is_active', true)->orderBy('sort_order')->get()
        : [];
    return inertia('ServiceDetail', ['slug' => $slug, 'products' => $products]);
})->name('services.show');

Route::get('/work', function () {
    return inertia('Work');
})->name('work');

Route::get('/work/{slug}', function (string $slug) {
    return inertia('ProjectDetail', ['slug' => $slug]);
})->name('work.show');

Route::get('/about', function () {
    $content = \App\Models\FrontpageContent::getCurrent();

    return inertia('About', [
        'about_team' => $content->about_team ?? [],
        'about_events' => $content->about_events ?? [],
        'about_team_title' => $content->about_team_title,
        'about_team_subtitle' => $content->about_team_subtitle,
        'about_events_title' => $content->about_events_title,
        'about_events_subtitle' => $content->about_events_subtitle,
    ]);
})->name('about');

Route::get('/blog', [\App\Http\Controllers\BlogPostController::class, 'publicIndex'])->name('blog');

Route::get('/blog/{post:slug}', [\App\Http\Controllers\BlogPostController::class, 'publicShow'])->name('blog.show');

Route::get('/contact', function () {
    return inertia('Contact');
})->name('contact');

Route::post('/contact', [TicketController::class, 'storeFromContact'])->name('contact.submit');

Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'loginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'authenticate'])->name('login.submit');

    Route::get('/register', [AuthController::class, 'registerForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.submit');

    Route::get('/request', [ProjectRequestController::class, 'create'])->name('request.create');
    Route::post('/request', [ProjectRequestController::class, 'store'])->name('request.store');

});

Route::get('/products', [ProductController::class, 'publicIndex'])->name('products.public');

Route::get('/payment/{invoiceNo}', [PaymentController::class, 'show'])->name('payment.show');
Route::post('/payment/proof', [PaymentController::class, 'storeProof'])->name('payment.proof.store');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::post('/profile/avatar/remove', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    /** Client + Admin shared: Projects */
Route::get('/projects', [ProjectController::class, 'index'])->name('projects');
Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::post('/projects/{project}/files', [ProjectController::class, 'uploadFile'])->name('projects.files.upload');
    Route::delete('/projects/{project}/files/{file}', [ProjectController::class, 'deleteFile'])->name('projects.files.delete');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');

    /** Client + Admin shared: Invoices */
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');

    /** Client + Admin shared: Support */
    Route::get('/support', [TicketController::class, 'index'])->name('support');
    Route::post('/support', [TicketController::class, 'store'])->name('tickets.store');
    Route::post('/support/{ticket}/reply', [TicketController::class, 'reply'])->name('tickets.reply');

    /** Client: Appointments */
    Route::get('/appointments', [ProjectRequestController::class, 'index'])->name('appointments');
    Route::post('/appointments', [ProjectRequestController::class, 'storeClient'])->name('appointments.store');

    /** Admin only */
    Route::middleware('role:admin')->group(function () {
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
        Route::post('/projects/{project}/milestones', [ProjectController::class, 'storeMilestone'])->name('projects.milestones.store');
        Route::put('/projects/{project}/milestones/{milestone}', [ProjectController::class, 'updateMilestone'])->name('projects.milestones.update');
        Route::delete('/projects/{project}/milestones/{milestone}', [ProjectController::class, 'destroyMilestone'])->name('projects.milestones.destroy');

        Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
        Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
        Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');

        Route::get('/payments', [PaymentController::class, 'index'])->name('payments');
        Route::put('/payment-proofs/{proof}/verify', [PaymentController::class, 'verify'])->name('payment.proof.verify');

        Route::put('/support/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
        Route::delete('/support/{ticket}', [TicketController::class, 'destroy'])->name('tickets.destroy');

        Route::get('/clients', [\App\Http\Controllers\ClientDatabaseController::class, 'index'])->name('clients');
        Route::put('/clients/{client}', [\App\Http\Controllers\ClientDatabaseController::class, 'update'])->name('clients.update');
        Route::delete('/clients/{client}', [\App\Http\Controllers\ClientDatabaseController::class, 'destroy'])->name('clients.destroy');
        Route::get('/requests', [ProjectRequestAdminController::class, 'index'])->name('requests');
        Route::put('/requests/{request}', [ProjectRequestAdminController::class, 'update'])->name('requests.update');
        Route::post('/requests/{request}/approve', [ProjectRequestAdminController::class, 'approve'])->name('requests.approve');
        Route::post('/requests/{request}/reject', [ProjectRequestAdminController::class, 'reject'])->name('requests.reject');
        Route::delete('/requests/{request}', [ProjectRequestAdminController::class, 'destroy'])->name('requests.destroy');

        Route::get('/manage-frontpage', [FrontpageController::class, 'index'])->name('frontpage.manage');
        Route::post('/manage-frontpage', [FrontpageController::class, 'update'])->name('frontpage.update');
        Route::get('/api/logo-search', [FrontpageController::class, 'searchLogos'])->name('logo.search');

        Route::get('/manage-blog', [BlogPostController::class, 'index'])->name('manage-blog');
        Route::post('/manage-blog', [BlogPostController::class, 'store'])->name('manage-blog.store');
        Route::put('/manage-blog/{post}', [BlogPostController::class, 'update'])->name('manage-blog.update');
        Route::delete('/manage-blog/{post}', [BlogPostController::class, 'destroy'])->name('manage-blog.destroy');

        Route::get('/manage-products', [ProductController::class, 'index'])->name('products.index');
        Route::post('/manage-products', [ProductController::class, 'store'])->name('products.store');
        Route::put('/manage-products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/manage-products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    });
});
