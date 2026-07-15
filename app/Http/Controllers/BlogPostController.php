<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogPostController extends Controller
{
    public function index()
    {
        $posts = BlogPost::query()->orderByDesc('published_at')->orderByDesc('id')->get();

        return Inertia::render('ManageBlog', [
            'posts' => $posts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug',
            'category' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048',
        ]);

        $validated['slug'] = $this->ensureSlug($validated['slug'] ?? null, $validated['title']);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeImage($request->file('image'));
        }

        BlogPost::create($validated);

        return redirect()->route('manage-blog')->with('success', 'Blog post created.');
    }

    public function update(Request $request, BlogPost $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blog_posts,slug,' . $post->id,
            'category' => 'nullable|string|max:255',
            'author' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048',
        ]);

        $validated['slug'] = $this->ensureSlug($validated['slug'] ?? null, $validated['title'], $post->slug);

        if ($request->hasFile('image')) {
            if ($post->image && !Str::startsWith($post->image, 'http')) {
                Storage::disk('public')->delete(str_replace(Storage::disk('public')->url(''), '', $post->image));
            }
            $validated['image'] = $this->storeImage($request->file('image'));
        }

        $post->update($validated);

        return redirect()->route('manage-blog')->with('success', 'Blog post updated.');
    }

    public function destroy(BlogPost $post)
    {
        if ($post->image && !Str::startsWith($post->image, 'http')) {
            Storage::disk('public')->delete(str_replace(Storage::disk('public')->url(''), '', $post->image));
        }

        $post->delete();

        return redirect()->route('manage-blog')->with('success', 'Blog post deleted.');
    }

    private function ensureSlug(?string $slug, string $title, ?string $existing = null): string
    {
        $base = !empty($slug) ? $slug : Str::slug($title);
        $base = trim($base);

        if (empty($base)) {
            $base = Str::slug($title);
        }

        return $base;
    }

    private function storeImage($file): string
    {
        $path = $file->store('blog', 'public');
        return Storage::disk('public')->url($path);
    }

    public function publicIndex()
    {
        $posts = BlogPost::query()
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Blog', [
            'posts' => $posts,
        ]);
    }

    public function publicShow(BlogPost $post)
    {
        $related = BlogPost::query()
            ->where('is_published', true)
            ->where('id', '!=', $post->id)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit(3)
            ->get();

        return Inertia::render('BlogPost', [
            'post' => $post,
            'related' => $related,
        ]);
    }
}
