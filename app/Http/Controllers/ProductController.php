<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user->isAdmin()) {
            abort(403);
        }

        $products = Product::orderBy('sort_order')->orderByDesc('created_at')->get();

        return Inertia::render('ManageProducts', [
            'products' => $products,
        ]);
    }

    public function publicIndex(): Response
    {
        $products = Product::where('is_active', true)->orderBy('sort_order')->paginate(12);

        return Inertia::render('ProductsPage', [
            'products' => $products,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'spec' => ['nullable', 'string', 'max:1000'],
            'price' => ['nullable', 'string', 'max:100'],
            'badge' => ['nullable', 'string', 'max:100'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data = [
            'name' => $validated['name'],
            'spec' => $validated['spec'] ?? null,
            'price' => $validated['price'] ?? null,
            'badge' => $validated['badge'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => true,
        ];

        if ($request->hasFile('image_file')) {
            $data['image'] = $request->file('image_file')->store('products', 'public');
        }

        Product::create($data);

        return redirect()->route('products.index')->with('success', 'Product added.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $this->ensureAdmin();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'spec' => ['nullable', 'string', 'max:1000'],
            'price' => ['nullable', 'string', 'max:100'],
            'badge' => ['nullable', 'string', 'max:100'],
            'image_file' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $data = [
            'name' => $validated['name'],
            'spec' => $validated['spec'] ?? null,
            'price' => $validated['price'] ?? null,
            'badge' => $validated['badge'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
        ];

        if ($request->hasFile('image_file')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image_file')->store('products', 'public');
        }

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->ensureAdmin();

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted.');
    }

    private function ensureAdmin(): void
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user->isAdmin()) {
            abort(403);
        }
    }
}
