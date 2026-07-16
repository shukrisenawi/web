<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FrontpageController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
})->name('home');

Route::get('/services', function () {
    return inertia('Services');
})->name('services');

Route::get('/services/{slug}', function (string $slug) {
    return inertia('ServiceDetail', ['slug' => $slug]);
})->name('services.show');

Route::get('/work', function () {
    return inertia('Work');
})->name('work');

Route::get('/work/{slug}', function (string $slug) {
    return inertia('ProjectDetail', ['slug' => $slug]);
})->name('work.show');

Route::get('/about', function () {
    return inertia('About');
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
});

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
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');

    /** Client + Admin shared: Invoices */
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');

    /** Client + Admin shared: Support */
    Route::get('/support', [TicketController::class, 'index'])->name('support');
    Route::post('/support', [TicketController::class, 'store'])->name('tickets.store');

    /** Admin only */
    Route::middleware('role:admin')->group(function () {
        Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

        Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
        Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
        Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');

        Route::put('/support/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
        Route::delete('/support/{ticket}', [TicketController::class, 'destroy'])->name('tickets.destroy');

        Route::get('/manage-frontpage', [FrontpageController::class, 'index'])->name('frontpage.manage');
        Route::post('/manage-frontpage', [FrontpageController::class, 'update'])->name('frontpage.update');
        Route::get('/api/logo-search', [FrontpageController::class, 'searchLogos'])->name('logo.search');

        Route::get('/manage-blog', [BlogPostController::class, 'index'])->name('manage-blog');
        Route::post('/manage-blog', [BlogPostController::class, 'store'])->name('manage-blog.store');
        Route::put('/manage-blog/{post}', [BlogPostController::class, 'update'])->name('manage-blog.update');
        Route::delete('/manage-blog/{post}', [BlogPostController::class, 'destroy'])->name('manage-blog.destroy');
    });
});
