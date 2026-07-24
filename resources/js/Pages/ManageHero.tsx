import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { DashboardLayout, Card } from '@/Layouts/Dashboard';
import {
    Save,
    Plus,
    Trash2,
    Image as ImageIcon,
    GripVertical,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';

interface ManageHeroProps {
    content: Record<string, any>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
            {children}
        </Card>
    );
}

function Field({ label, id, children }: { label: string; id?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
            {children}
        </div>
    );
}

function ImageUpload({
    preview,
    onChange,
    label = 'Image',
}: {
    preview?: string | null;
    onChange: (file: File | null) => void;
    label?: string;
}) {
    return (
        <Field label={label}>
            <div className="flex items-center gap-3">
                {preview && (
                    <img
                        src={preview}
                        alt={label}
                        className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                    />
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <ImageIcon className="h-4 w-4" />
                    Change Image
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onChange(e.target.files?.[0] || null)}
                    />
                </label>
            </div>
        </Field>
    );
}

export default function ManageHero({ content }: ManageHeroProps) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors, reset } = useForm({
        ...content,
        hero_image_file: null as File | null,
        hero_avatar_files: {} as Record<number, File | null>,
    } as any);

    const updateArray = (key: string, index: number, field: string, value: any) => {
        const list = [...(data[key] || [])];
        list[index] = { ...list[index], [field]: value };
        setData(key as any, list);
    };

    const addItem = (key: string, template: Record<string, any>) => {
        const list = [...(data[key] || []), template];
        setData(key as any, list);
    };

    const removeItem = (key: string, index: number) => {
        const list = [...(data[key] || [])];
        list.splice(index, 1);
        setData(key as any, list);

        if (key === 'hero_avatars') {
            const files = { ...data.hero_avatar_files };
            delete files[index];
            setData('hero_avatar_files', files);
        }
    };

    const moveItem = (key: string, index: number, direction: number) => {
        const list = [...(data[key] || [])];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= list.length) return;
        [list[index], list[newIndex]] = [list[newIndex], list[index]];
        setData(key as any, list);
    };

    const setHeroAvatar = (idx: number, file: File | null) => {
        setData('hero_avatar_files', { ...data.hero_avatar_files, [idx]: file });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/manage-hero', {
            preserveScroll: true,
            onSuccess: (page: any) => {
                reset('hero_image_file');
                setData('hero_avatar_files', {});
                const c = page.props.content as Record<string, any> | undefined;
                if (c) {
                    if (c.hero_avatars) setData('hero_avatars', c.hero_avatars);
                }
            },
        });
    };

    return (
        <>
            <Head title="Manage Hero" />

            <DashboardLayout title="Manage Hero">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {flash?.success && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-medium">{flash.success}</span>
                        </div>
                    )}

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-600">
                            Manage the hero section content and trusted-by avatars shown on the frontpage.
                        </p>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <Section title="Hero Content">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Badge">
                                <input
                                    type="text"
                                    value={data.hero_badge || ''}
                                    onChange={(e) => setData('hero_badge', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </Field>
                            <Field label="Trusted Text">
                                <input
                                    type="text"
                                    value={data.hero_trusted_text || ''}
                                    onChange={(e) => setData('hero_trusted_text', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Title">
                                    <textarea
                                        value={data.hero_title || ''}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                        rows={2}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                            </div>
                            <div className="sm:col-span-2">
                                <Field label="Subtitle">
                                    <textarea
                                        value={data.hero_subtitle || ''}
                                        onChange={(e) => setData('hero_subtitle', e.target.value)}
                                        rows={3}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                            </div>
                            <Field label="Primary CTA">
                                <input
                                    type="text"
                                    value={data.hero_primary_cta || ''}
                                    onChange={(e) => setData('hero_primary_cta', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </Field>
                            <Field label="Primary Link">
                                <input
                                    type="text"
                                    value={data.hero_primary_link || ''}
                                    onChange={(e) => setData('hero_primary_link', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </Field>
                            <Field label="Secondary CTA">
                                <input
                                    type="text"
                                    value={data.hero_secondary_cta || ''}
                                    onChange={(e) => setData('hero_secondary_cta', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </Field>
                            <Field label="Secondary Link">
                                <input
                                    type="text"
                                    value={data.hero_secondary_link || ''}
                                    onChange={(e) => setData('hero_secondary_link', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </Field>
                            <Field label="Trusted Subtext">
                                <input
                                    type="text"
                                    value={data.hero_trusted_subtext || ''}
                                    onChange={(e) => setData('hero_trusted_subtext', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </Field>
                            <ImageUpload
                                label="Hero Image"
                                preview={data.hero_image}
                                onChange={(file) => setData('hero_image_file', file)}
                            />
                        </div>
                    </Section>

                    <Section title="Trusted-by Avatars">
                        <p className="mb-4 text-sm text-slate-600">
                            These avatars appear in the hero section next to the trusted text.
                        </p>

                        <div className="space-y-4">
                            {(data.hero_avatars || []).map((avatar: any, idx: number) => (
                                <div key={`hero-avatar-${avatar.image ? avatar.image.slice(-12) : idx}`} className="rounded-lg border border-slate-200 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-700">Avatar #{idx + 1}</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveItem('hero_avatars', idx, -1)}
                                                className="rounded p-1 text-slate-400 hover:bg-slate-100"
                                            >
                                                <GripVertical className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeItem('hero_avatars', idx)}
                                                className="rounded p-1 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <ImageUpload
                                        label="Avatar Image"
                                        preview={
                                            data.hero_avatar_files[idx]
                                                ? URL.createObjectURL(data.hero_avatar_files[idx]!)
                                                : avatar.image
                                        }
                                        onChange={(file) => setHeroAvatar(idx, file)}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => addItem('hero_avatars', { image: '' })}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <Plus className="h-4 w-4" />
                            Add Avatar
                        </button>
                    </Section>

                    {Object.keys(errors).length > 0 && (
                        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <span className="text-sm">Please fix the highlighted errors before saving.</span>
                        </div>
                    )}
                </form>
            </DashboardLayout>
        </>
    );
}
