import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Package, Search } from 'lucide-react';
import { useState } from 'react';
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

export default function ProductsPage({ products }: { products: Product[] }) {
    const [search, setSearch] = useState('');
    const filtered = products.filter((p) =>
        !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.spec?.toLowerCase().includes(search.toLowerCase())
    );

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

                    <div className="relative mx-auto mt-8 max-w-md">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4">
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
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={product.image?.startsWith('http') || product.image?.startsWith('/') ? product.image : '/storage/' + product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    </div>
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
                </div>
            </section>

            <LandingFooter />
        </>
    );
}
