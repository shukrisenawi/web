<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('Profile', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'company' => $user->company,
                'industry' => $user->industry,
                'industry_other' => $user->industry_other,
                'business_address' => $user->business_address,
                'business_no' => $user->business_no,
                'whatsapp' => $user->whatsapp,
                'business_reg_no' => $user->business_reg_no,
                'persons_in_charge' => $user->persons_in_charge ?? [],
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
            ],
        ]);
    }

    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'company' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'industry_other' => ['nullable', 'string', 'max:255'],
            'business_address' => ['nullable', 'string', 'max:1000'],
            'business_no' => ['nullable', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:255'],
            'business_reg_no' => ['nullable', 'string', 'max:255'],
            'persons_in_charge' => ['nullable', 'array'],
            'persons_in_charge.*.name' => ['required', 'string', 'max:255'],
            'persons_in_charge.*.role' => ['required', Rule::in(['Primary', 'Billing', 'Staff'])],
            'persons_in_charge.*.email' => ['nullable', 'email', 'max:255'],
        ]);

        $industry = $validated['industry'] ?? null;
        if ($industry === 'Others') {
            $industry = 'Others: ' . ($validated['industry_other'] ?? '');
        }

        $user->update(array_merge($validated, ['industry' => $industry]));

        return redirect()->route('profile')->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('profile')->with('success', 'Password updated successfully.');
    }

    public function updateAvatar(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => $path]);
        }

        return redirect()->route('profile')->with('success', 'Avatar updated successfully.');
    }

    public function removeAvatar(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return redirect()->route('profile')->with('success', 'Avatar removed successfully.');
    }
}
