<?php

namespace App\Http\Controllers;

use App\Models\Project;
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
            // Business Information
            'company_name' => ['required', 'string', 'max:255'],
            'company_address' => ['nullable', 'string', 'max:2000'],
            'industry' => ['nullable', 'string', 'max:255'],
            'industry_other' => ['nullable', 'string', 'max:255'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_mobile' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(6)],

            // Project Requirements
            'system_type' => ['nullable', 'string', 'max:255'],
            'system_type_other' => ['nullable', 'string', 'max:255'],
            'features' => ['nullable', 'string', 'max:5000'],
            'user_roles' => ['nullable', 'string', 'max:5000'],
            'integrations' => ['nullable', 'string', 'max:5000'],

            // Budget & Timeline
            'budget' => ['nullable', 'string', 'max:255'],
            'deadline' => ['nullable', 'date'],
            'hosting_domain' => ['nullable', 'string', 'max:2000'],

            // Review & Submit
            'additional_notes' => ['nullable', 'string', 'max:5000'],
            'files' => ['nullable', 'array', 'max:10'],
            'files.*' => ['file', 'max:10240'],
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

        $systemType = $validated['system_type'] ?? null;
        if ($systemType === 'Other') {
            $systemType = 'Other: ' . ($validated['system_type_other'] ?? '');
        }

        $projectRequest = ProjectRequest::create([
            'user_id' => $user->id,
            'company_name' => $validated['company_name'],
            'company_address' => $validated['company_address'] ?? null,
            'industry' => $industry,
            'contact_name' => $validated['contact_name'],
            'contact_mobile' => $validated['contact_mobile'] ?? null,
            'contact_email' => $validated['contact_email'],
            'system_type' => $systemType,
            'features' => $validated['features'] ?? null,
            'user_roles' => $validated['user_roles'] ?? null,
            'integrations' => $validated['integrations'] ?? null,
            'budget' => $validated['budget'] ?? null,
            'deadline' => $validated['deadline'] ?? null,
            'hosting_domain' => $validated['hosting_domain'] ?? null,
            'additional_notes' => $validated['additional_notes'] ?? null,
            'status' => 'pending',
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('project-requests/'.$projectRequest->id, 'public');

                $projectRequest->files()->create([
                    'filename' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }

        $serviceTypeMap = [
            'Web System' => 'web_system',
            'Website' => 'website',
            'Mobile App' => 'mobile_app',
            'E-Commerce' => 'web_system',
            'Digital Marketing' => 'digital_marketing',
            'IT Solutions' => 'it_solutions',
            'Game Development' => 'game_development',
        ];
        $rawSystemType = $validated['system_type'] ?? 'Web System';
        $serviceType = $serviceTypeMap[$rawSystemType] ?? 'web_system';

        $descriptionParts = array_filter([
            $validated['features'] ?? null,
            $validated['user_roles'] ? 'User Roles: '.$validated['user_roles'] : null,
            $validated['integrations'] ? 'Integrations: '.$validated['integrations'] : null,
            $validated['additional_notes'] ? 'Notes: '.$validated['additional_notes'] : null,
        ]);
        $description = implode("\n\n", $descriptionParts);

        Project::create([
            'user_id' => $user->id,
            'title' => $validated['company_name'],
            'category' => $industry,
            'service_type' => $serviceType,
            'description' => $description,
            'key_person' => $validated['contact_name'],
            'status_remark' => 'New request - pending review',
            'progress' => 0,
            'status' => 'in_progress',
            'payment_status' => 'unpaid',
            'icon_color' => '#2563eb',
        ]);

        Auth::login($user);

        return redirect()->route('projects')->with('success', 'Your request has been submitted successfully. Our team will review it shortly.');
    }
}
