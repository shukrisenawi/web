import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, ChevronLeft, ChevronRight, Package, Search, X, ZoomIn } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { LandingHeader } from '@/Layouts/LandingHeader';

interface Product {
    id: number;
    name: string;
    spec: string | null;
    price: string | null;
    badge: string | null;
    image: string | null;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function ProductsPage({ products }: { products: PaginatedData<Product> }) {
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const filtered = searchQuery
        ? products.data.filter((p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.spec?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : products.data;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(search);
    };

    const goToPage = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true, preserveState: true });
    };

    const openLightbox = (image: string | null) => {
        if (!image) return;
        setLightboxImage(image);
    };

    const closeLightbox = useCallback(() => setLightboxImage(null), []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
        };
        if (lightboxImage) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [lightboxImage, closeLightbox]);

    const hasPagination = !searchQuery && products.last_page > 1;

    return (
        <>
            <LandingHeader />
            <Head title="Products" />

            <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold text-slate-900">IT Equipment &amp; Supplies</h1>
                        <p className="mt-4 text-lg text-slate-600">
                            Browse our range of high-quality IT equipment from trusted brands.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="relative mx-auto mt-8 max-w-md">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4">
                    {!searchQuery && (
                        <p className="mb-6 text-sm text-slate-500">
                            Showing {products.from}–{products.to} of {products.total} products
                        </p>
                    )}

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center py-16">
                            <Package className="h-12 w-12 text-slate-300" />
                            <h3 className="mt-4 text-lg font-semibold text-slate-700">No products found</h3>
                            <p className="mt-1 text-sm text-slate-500">Try a different search term.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((product) => (
                                <div
                                    key={product.id}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    {product.badge && (
                                        <span className="absolute left-4 top-4 z-10 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase text-white">
                                            {product.badge}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden text-left"
                                        onClick={() => openLightbox(product.image?.startsWith('http') || product.image?.startsWith('/') ? product.image : '/storage/' + product.image)}
                                    >
                                        <img
                                            src={product.image?.startsWith('http') || product.image?.startsWith('/') ? product.image : '/storage/' + product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                                            <ZoomIn className="h-8 w-8 text-white opacity-0 transition group-hover:opacity-100" />
                                        </div>
                                    </button>
                                    <div className="flex flex-1 flex-col p-4">
                                        <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
                                        {product.spec && (
                                            <p className="mt-1 text-xs text-slate-500">{product.spec}</p>
                                        )}
                                        {product.price && (
                                            <p className="mt-3 text-lg font-bold text-blue-600">{product.price}</p>
                                        )}
                                        <Link
                                            href="/request"
                                            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                                        >
                                            Request Quotation
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {hasPagination && (
                        <div className="mt-10 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => goToPage(products.links[0]?.url)}
                                disabled={!products.links[0]?.url}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous
                            </button>

                            {products.links.slice(1, -1).map((link) => {
                                const page = link.label;
                                return (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => goToPage(link.url)}
                                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => goToPage(products.links[products.links.length - 1]?.url)}
                                disabled={!products.links[products.links.length - 1]?.url}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <LandingFooter />

            {lightboxImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <button
                        type="button"
                        onClick={closeLightbox}
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Product preview"
                        className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                    />
                </div>
            )}
        </>
    );
}
