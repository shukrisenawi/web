<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function loginForm()
    {
        return Inertia::render('Login');
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'remember' => ['boolean'],
        ]);

        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            $user = Auth::user();
            ActivityLog::create([
                'user_id' => $user->id,
                'type' => 'auth',
                'description' => "{$user->name} signed in at " . now()->format('g:i A'),
            ]);

            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function registerForm()
    {
        return Inertia::render('Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'company' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = User::ROLE_CLIENT;

        $user = User::create($validated);
        Auth::login($user);

        ActivityLog::create([
            'user_id' => $user->id,
            'type' => 'auth',
            'description' => "{$user->name} registered a new account",
        ]);

        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        /** @var User|null $user */
        $user = Auth::user();
        $userId = $user?->id;
        $userName = $user?->name;

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($userId) {
            ActivityLog::create([
                'user_id' => $userId,
                'type' => 'auth',
                'description' => "{$userName} signed out",
            ]);
        }

        return redirect()->route('home');
    }
}
