<?php

namespace App\Http\Controllers;

use App\Models\FrontpageContent;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
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
        ]);

        // Handle hero image upload
        if ($request->hasFile('hero_image_file')) {
            $path = $request->file('hero_image_file')->store('frontpage', 'public');
            $validated['hero_image'] = Storage::disk('public')->url($path);
        }

        // Handle service image uploads
        $services = $request->input('services', []);
        if ($request->has('service_image_files')) {
            foreach ($request->input('service_image_files') as $idx => $val) {
                $fileKey = "service_image_files.{$idx}";
                if ($request->hasFile($fileKey)) {
                    $path = $request->file($fileKey)->store('frontpage/services', 'public');
                    $services[$idx]['image'] = Storage::disk('public')->url($path);
                }
            }
        }
        $validated['services'] = $services;

        // Handle project image uploads
        $projects = $request->input('projects', []);
        if ($request->has('project_image_files')) {
            foreach ($request->input('project_image_files') as $idx => $val) {
                $fileKey = "project_image_files.{$idx}";
                if ($request->hasFile($fileKey)) {
                    $path = $request->file($fileKey)->store('frontpage/projects', 'public');
                    $projects[$idx]['image'] = Storage::disk('public')->url($path);
                }
            }
        }
        $validated['projects'] = $projects;

        // Handle client logo uploads
        $clients = $request->input('clients', []);
        if ($request->has('client_logo_files')) {
            foreach ($request->input('client_logo_files') as $idx => $val) {
                $fileKey = "client_logo_files.{$idx}";
                if ($request->hasFile($fileKey)) {
                    $path = $request->file($fileKey)->store('frontpage/clients', 'public');
                    $clients[$idx]['logo'] = Storage::disk('public')->url($path);
                }
            }
        }
        $validated['clients'] = $clients;

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
