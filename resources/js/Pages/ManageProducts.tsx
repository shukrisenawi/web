import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Package, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card } from '@/Layouts/Dashboard';

const inputClass = 'w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-slate-700';

interface Product {
    id: number;
    name: string;
    spec: string | null;
    price: string | null;
    badge: string | null;
    image: string | null;
    is_active: boolean;
    sort_order: number;
}

export default function ManageProducts({ products }: { products: Product[] }) {
    const { flash } = usePage().props as any;
    const [modal, setModal] = useState<{ open: boolean; edit: Product | null }>({ open: false, edit: null });
    const [form, setForm] = useState({ name: '', spec: '', price: '', badge: '', image_file: null as File | null, sort_order: 0 });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const openCreate = () => {
        setForm({ name: '', spec: '', price: '', badge: '', image_file: null, sort_order: 0 });
        setImagePreview(null);
        setModal({ open: true, edit: null });
    };

    const openEdit = (p: Product) => {
        setForm({ name: p.name, spec: p.spec || '', price: p.price || '', badge: p.badge || '', image_file: null, sort_order: p.sort_order });
        setImagePreview(p.image ? '/storage/' + p.image : null);
        setModal({ open: true, edit: p });
    };

    const submit = () => {
        const data = new FormData();
        data.append('name', form.name);
        if (form.spec) data.append('spec', form.spec);
        if (form.price) data.append('price', form.price);
        if (form.badge) data.append('badge', form.badge);
        data.append('sort_order', String(form.sort_order));
        if (form.image_file) data.append('image_file', form.image_file);

        if (modal.edit) {
            data.append('_method', 'PUT');
            router.post(`/products/${modal.edit.id}`, data, {
                preserveScroll: true,
                onSuccess: () => { setModal({ open: false, edit: null }); setImagePreview(null); },
            });
        } else {
            router.post('/products', data, {
                preserveScroll: true,
                onSuccess: () => { setModal({ open: false, edit: null }); setImagePreview(null); },
            });
        }
    };

    const confirmDelete = (p: Product) => {
        if (!confirm(`Delete "${p.name}"?`)) return;
        router.delete(`/products/${p.id}`, { preserveScroll: true });
    };

    return (
        <DashboardLayout>
            <Head title="Products" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage IT equipment products displayed on the website.</p>
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" /> Add Product
                </button>
            </div>

            {flash?.success && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{flash.success}</span>
                </div>
            )}

            {products.length === 0 ? (
                <Card>
                    <div className="flex flex-col items-center py-12">
                        <Package className="h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-700">No products yet</h3>
                        <p className="mt-1 text-sm text-slate-500">Add your first IT equipment product.</p>
                    </div>
                </Card>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-slate-700">Image</th>
                                <th className="px-4 py-3 font-semibold text-slate-700">Name</th>
                                <th className="px-4 py-3 font-semibold text-slate-700">Price</th>
                                <th className="px-4 py-3 font-semibold text-slate-700">Badge</th>
                                <th className="px-4 py-3 font-semibold text-slate-700">Order</th>
                                <th className="px-4 py-3 font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        {p.image ? (
                                            <img src={'/storage/' + p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                                <Package className="h-5 w-5" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{p.price || '-'}</td>
                                    <td className="px-4 py-3">
                                        {p.badge ? (
                                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{p.badge}</span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{p.sort_order}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button type="button" onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => confirmDelete(p)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">{modal.edit ? 'Edit Product' : 'Add Product'}</h2>
                            <button type="button" onClick={() => setModal({ open: false, edit: null })} className="rounded-lg p-1 hover:bg-slate-100">
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-4 px-6 py-5">
                            <div>
                                <label htmlFor="p-name" className={labelClass}>Name</label>
                                <input id="p-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="p-spec" className={labelClass}>Specification</label>
                                <input id="p-spec" type="text" value={form.spec} onChange={(e) => setForm({ ...form, spec: e.target.value })} className={inputClass} placeholder='e.g. 14" FHD, Intel i5, 16GB RAM' />
                            </div>
                            <div>
                                <label htmlFor="p-price" className={labelClass}>Price</label>
                                <input id="p-price" type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} placeholder="e.g. RM4,199.00" />
                            </div>
                            <div>
                                <label htmlFor="p-badge" className={labelClass}>Badge</label>
                                <input id="p-badge" type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={inputClass} placeholder="e.g. Best Seller, New" />
                            </div>
                            <div>
                                <label htmlFor="p-order" className={labelClass}>Sort Order</label>
                                <input id="p-order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="p-image" className={labelClass}>Image</label>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="mb-2 h-20 w-20 rounded-lg object-cover" />
                                )}
                                <input id="p-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setForm({ ...form, image_file: file });
                                    if (file) setImagePreview(URL.createObjectURL(file));
                                }} className={inputClass} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                            <button type="button" onClick={() => setModal({ open: false, edit: null })} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                            <button type="button" onClick={submit} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
