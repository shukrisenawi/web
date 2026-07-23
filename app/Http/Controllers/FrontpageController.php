<?php

namespace App\Http\Controllers;

use App\Models\FrontpageContent;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class FrontpageController extends Controller
{
    public function index()
    {
        $content = FrontpageContent::getCurrent();

        return Inertia::render('ManageFrontpage', [
            'content' => $content->toArray(),
        ]);
    }

    public function update(Request $request)
    {
        $content = FrontpageContent::getCurrent();

        $validated = $request->validate([
            'hero_badge' => 'nullable|string|max:255',
            'hero_title' => 'nullable|string',
            'hero_subtitle' => 'nullable|string',
            'hero_primary_cta' => 'nullable|string|max:255',
            'hero_primary_link' => 'nullable|string|max:255',
            'hero_secondary_cta' => 'nullable|string|max:255',
            'hero_secondary_link' => 'nullable|string|max:255',
            'hero_trusted_text' => 'nullable|string|max:255',
            'hero_trusted_subtext' => 'nullable|string|max:255',
            'hero_image' => 'nullable|string',
            'services_title' => 'nullable|string|max:255',
            'services_subtitle' => 'nullable|string',
            'services' => 'nullable|array',
            'projects_title' => 'nullable|string|max:255',
            'projects_subtitle' => 'nullable|string',
            'projects' => 'nullable|array',
            'clients_title' => 'nullable|string|max:255',
            'clients' => 'nullable|array',
            'stats' => 'nullable|array',
            'cta_title' => 'nullable|string|max:255',
            'cta_subtitle' => 'nullable|string',
            'cta_button' => 'nullable|string|max:255',
            'cta_link' => 'nullable|string|max:255',
            'footer_tagline' => 'nullable|string',
            'social_links' => 'nullable|array',
            'about_team_title' => 'nullable|string|max:255',
            'about_team_subtitle' => 'nullable|string',
            'about_team' => 'nullable|array',
            'about_events_title' => 'nullable|string|max:255',
            'about_events_subtitle' => 'nullable|string',
            'about_events' => 'nullable|array',
            'payment_logo' => 'nullable|string',
            'bank_name' => 'nullable|string|max:255',
            'bank_account_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:255',
        ]);

        // Handle hero image upload
        if ($request->hasFile('hero_image_file')) {
            $path = $request->file('hero_image_file')->store('frontpage', 'public');
            $validated['hero_image'] = asset('uploads/' . $path);
        }

        // Handle service image uploads
        $services = $request->input('services', []);
        $serviceImageFiles = $request->file('service_image_files') ?? [];
        foreach ($serviceImageFiles as $idx => $file) {
            if ($file) {
                $path = $file->store('frontpage/services', 'public');
                $services[$idx]['image'] = asset('uploads/' . $path);
            }
        }
        $validated['services'] = $services;

        // Handle project image uploads
        $projects = $request->input('projects', []);
        $projectImageFiles = $request->file('project_image_files') ?? [];
        foreach ($projectImageFiles as $idx => $file) {
            if ($file) {
                $path = $file->store('frontpage/projects', 'public');
                $projects[$idx]['image'] = asset('uploads/' . $path);
            }
        }
        $validated['projects'] = $projects;

        // Handle client logo uploads
        $clients = $request->input('clients', []);
        $clientLogoFiles = $request->file('client_logo_files') ?? [];
        foreach ($clientLogoFiles as $idx => $file) {
            if ($file) {
                $path = $file->store('frontpage/clients', 'public');
                $clients[$idx]['logo'] = asset('uploads/' . $path);
            }
        }
        $validated['clients'] = $clients;

        // Handle about team image uploads
        $aboutTeam = $request->input('about_team', []);
        $aboutTeamImageFiles = $request->file('about_team_image_files') ?? [];
        foreach ($aboutTeamImageFiles as $idx => $file) {
            if ($file) {
                $path = $file->store('frontpage/about/team', 'public');
                $aboutTeam[$idx]['image'] = asset('uploads/' . $path);
            }
        }
        $validated['about_team'] = $aboutTeam;

        // Handle about event image uploads
        $aboutEvents = $request->input('about_events', []);
        $aboutEventImageFiles = $request->file('about_event_image_files') ?? [];
        foreach ($aboutEventImageFiles as $idx => $file) {
            if ($file) {
                $path = $file->store('frontpage/about/events', 'public');
                $aboutEvents[$idx]['image'] = asset('uploads/' . $path);
            }
        }
        $validated['about_events'] = $aboutEvents;

        // Handle payment logo upload
        if ($request->hasFile('payment_logo_file')) {
            $path = $request->file('payment_logo_file')->store('frontpage', 'public');
            $validated['payment_logo'] = asset('uploads/' . $path);
        }

        $content->update($validated);

        return redirect()->route('frontpage.manage')->with('success', 'Frontpage content updated.');
    }

    public function searchLogos(Request $request)
    {
        $query = $request->query('query');

        if (! $query) {
            return response()->json([]);
        }

        try {
            $response = Http::timeout(5)->get('https://autocomplete.clearbit.com/v1/suggest', [
                'query' => $query,
            ]);

            if (! $response->successful()) {
                return response()->json([]);
            }

            $results = $response->json();

            return response()->json(collect($results)->map(function ($item) {
                return [
                    'name' => $item['name'] ?? null,
                    'domain' => $item['domain'] ?? null,
                    'logo' => $item['logo'] ?? null,
                ];
            })->filter(function ($item) {
                return $item['logo'];
            })->values());
        } catch (ConnectionException $e) {
            return response()->json([]);
        }
    }
}
