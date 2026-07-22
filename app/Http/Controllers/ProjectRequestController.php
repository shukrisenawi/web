<?php

namespace App\Http\Controllers;

use App\Models\ProjectRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProjectRequestController extends Controller
{
    public function create()
    {
        return Inertia::render('RequestForm');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'company_address' => ['nullable', 'string', 'max:2000'],
            'industry' => ['required', 'string', 'max:255'],
            'industry_other' => ['nullable', 'string', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_mobile' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(6)],
        ]);

        $user = User::create([
            'name' => $validated['contact_name'],
            'email' => $validated['contact_email'],
            'password' => Hash::make($validated['password']),
            'role' => User::ROLE_CLIENT,
            'company' => $validated['company_name'],
            'industry' => $validated['industry'] ?? null,
            'industry_other' => $validated['industry_other'] ?? null,
            'business_address' => $validated['company_address'] ?? null,
            'whatsapp' => $validated['contact_mobile'] ?? null,
        ]);

        $industry = $validated['industry'] ?? null;
        if ($industry === 'Others') {
            $industry = 'Others: ' . ($validated['industry_other'] ?? '');
        }

        ProjectRequest::create([
            'user_id' => $user->id,
            'company_name' => $validated['company_name'],
            'company_address' => $validated['company_address'] ?? null,
            'industry' => $industry,
            'contact_name' => $validated['contact_name'],
            'contact_mobile' => $validated['contact_mobile'] ?? null,
            'contact_email' => $validated['contact_email'],
            'status' => 'pending',
        ]);

        Auth::login($user);

        return redirect()->route('projects')->with('success', 'Your request has been submitted successfully. Our team will review it shortly.');
    }
}
