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
    Search,
} from 'lucide-react';

interface ManageFrontpageProps {
    content: Record<string, any>;
}

const availableIcons = [
    'Globe',
    'Smartphone',
    'Palette',
    'TrendingUp',
    'Gamepad2',
    'Shield',
    'Code',
    'Megaphone',
    'BarChart',
    'Layers',
    'Monitor',
    'Printer',
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
            {children}
        </Card>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">{label}</label>
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

function LogoSearch({
    query,
    onSelect,
}: {
    query: string;
    onSelect: (logo: string) => void;
}) {
    const [value, setValue] = useState(query);
    const [results, setResults] = useState<Array<{ name: string; domain: string; logo: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState('');

    const search = async (q: string) => {
        if (!q.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/logo-search?query=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data);
            setSearched(q);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-48">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search logo..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            search(value);
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={() => search(value)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                    title="Search logo"
                >
                    <Search className="h-4 w-4" />
                </button>
            </div>
            {loading && <p className="mt-2 text-xs text-slate-500">Searching...</p>}
            {!loading && results.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {results.map((item) => (
                        <button
                            key={item.domain}
                            type="button"
                            onClick={() => onSelect(item.logo)}
                            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                            title={item.name}
                        >
                            <img src={item.logo} alt={item.name} className="h-8 w-auto object-contain" />
                        </button>
                    ))}
                </div>
            )}
            {!loading && searched && results.length === 0 && (
                <p className="mt-2 text-xs text-slate-500">No logos found.</p>
            )}
        </div>
    );
}

export default function ManageFrontpage({ content }: ManageFrontpageProps) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors, reset } = useForm({
        ...content,
        hero_image_file: null as File | null,
        service_image_files: {} as Record<number, File | null>,
        project_image_files: {} as Record<number, File | null>,
        client_logo_files: {} as Record<number, File | null>,
    });

    const [activeTab, setActiveTab] = useState<'hero' | 'services' | 'projects' | 'clients' | 'stats' | 'cta' | 'footer'>('hero');

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

        if (key === 'services') {
            const files = { ...data.service_image_files };
            delete files[index];
            setData('service_image_files', files);
        }
        if (key === 'projects') {
            const files = { ...data.project_image_files };
            delete files[index];
            setData('project_image_files', files);
        }
        if (key === 'clients') {
            const files = { ...data.client_logo_files };
            delete files[index];
            setData('client_logo_files', files);
        }
    };

    const setClientLogo = (idx: number, file: File | null) => {
        setData('client_logo_files', { ...data.client_logo_files, [idx]: file });
    };

    const moveItem = (key: string, index: number, direction: number) => {
        const list = [...(data[key] || [])];
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= list.length) return;
        [list[index], list[newIndex]] = [list[newIndex], list[index]];
        setData(key as any, list);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('frontpage.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('hero_image_file');
                setData('service_image_files', {});
                setData('project_image_files', {});
                setData('client_logo_files', {});
            },
        });
    };

    const tabs = [
        { key: 'hero', label: 'Hero' },
        { key: 'services', label: 'Services' },
        { key: 'projects', label: 'Work' },
        { key: 'clients', label: 'Clients' },
        { key: 'stats', label: 'Stats' },
        { key: 'cta', label: 'CTA' },
        { key: 'footer', label: 'Footer' },
    ] as const;

    const setServiceImage = (idx: number, file: File | null) => {
        setData('service_image_files', { ...data.service_image_files, [idx]: file });
    };

    const setProjectImage = (idx: number, file: File | null) => {
        setData('project_image_files', { ...data.project_image_files, [idx]: file });
    };

    return (
        <>
            <Head title="Manage Frontpage" />

            <DashboardLayout title="Manage Frontpage">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {flash?.success && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-medium">{flash.success}</span>
                        </div>
                    )}

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                        activeTab === tab.key
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {activeTab === 'hero' && (
                        <Section title="Hero Section">
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
                    )}

                    {activeTab === 'services' && (
                        <Section title="Services Section">
                            <div className="mb-4 grid gap-5 sm:grid-cols-2">
                                <Field label="Section Title">
                                    <input
                                        type="text"
                                        value={data.services_title || ''}
                                        onChange={(e) => setData('services_title', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                                <Field label="Section Subtitle">
                                    <input
                                        type="text"
                                        value={data.services_subtitle || ''}
                                        onChange={(e) => setData('services_subtitle', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                            </div>

                            <div className="space-y-4">
                                {(data.services || []).map((service: any, idx: number) => (
                                    <div key={idx} className="rounded-lg border border-slate-200 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-700">Service #{idx + 1}</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveItem('services', idx, -1)}
                                                    className="rounded p-1 text-slate-400 hover:bg-slate-100"
                                                >
                                                    <GripVertical className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem('services', idx)}
                                                    className="rounded p-1 text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            <Field label="Icon">
                                                <select
                                                    value={service.icon || 'Globe'}
                                                    onChange={(e) => updateArray('services', idx, 'icon', e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                                >
                                                    {availableIcons.map((icon) => (
                                                        <option key={icon} value={icon}>
                                                            {icon}
                                                        </option>
                                                    ))}
                                                </select>
                                            </Field>
                                            <Field label="Title">
                                                <input
                                                    type="text"
                                                    value={service.title || ''}
                                                    onChange={(e) => updateArray('services', idx, 'title', e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                                />
                                            </Field>
                                            <Field label="Description">
                                                <input
                                                    type="text"
                                                    value={service.description || ''}
                                                    onChange={(e) => updateArray('services', idx, 'description', e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                                />
                                            </Field>
                                            <ImageUpload
                                                label="Service Image"
                                                preview={data.service_image_files[idx] ? URL.createObjectURL(data.service_image_files[idx]!) : service.image}
                                                onChange={(file) => setServiceImage(idx, file)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addItem('services', { icon: 'Globe', title: '', description: '', image: '' })}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <Plus className="h-4 w-4" />
                                Add Service
                            </button>
                        </Section>
                    )}

                    {activeTab === 'projects' && (
                        <Section title="Work">
                            <div className="mb-4 grid gap-5 sm:grid-cols-2">
                                <Field label="Section Title">
                                    <input
                                        type="text"
                                        value={data.projects_title || ''}
                                        onChange={(e) => setData('projects_title', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                                <Field label="Section Subtitle">
                                    <input
                                        type="text"
                                        value={data.projects_subtitle || ''}
                                        onChange={(e) => setData('projects_subtitle', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                            </div>

                            <div className="space-y-4">
                                {(data.projects || []).map((project: any, idx: number) => (
                                    <div key={idx} className="rounded-lg border border-slate-200 p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-700">Project #{idx + 1}</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveItem('projects', idx, -1)}
                                                    className="rounded p-1 text-slate-400 hover:bg-slate-100"
                                                >
                                                    <GripVertical className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem('projects', idx)}
                                                    className="rounded p-1 text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                            <Field label="Title">
                                                <input
                                                    type="text"
                                                    value={project.title || ''}
                                                    onChange={(e) => updateArray('projects', idx, 'title', e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                                />
                                            </Field>
                                            <Field label="Category">
                                                <input
                                                    type="text"
                                                    value={project.category || ''}
                                                    onChange={(e) => updateArray('projects', idx, 'category', e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                                />
                                            </Field>
                                            <Field label="Link">
                                                <input
                                                    type="text"
                                                    value={project.link || ''}
                                                    onChange={(e) => updateArray('projects', idx, 'link', e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                                />
                                            </Field>
                                            <ImageUpload
                                                label="Project Image"
                                                preview={data.project_image_files[idx] ? URL.createObjectURL(data.project_image_files[idx]!) : project.image}
                                                onChange={(file) => setProjectImage(idx, file)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addItem('projects', { title: '', category: '', image: '', link: '/work' })}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <Plus className="h-4 w-4" />
                                Add Project
                            </button>
                        </Section>
                    )}

                    {activeTab === 'clients' && (
                        <Section title="Clients">
                            <div className="mb-4">
                                <Field label="Section Title">
                                    <input
                                        type="text"
                                        value={data.clients_title || ''}
                                        onChange={(e) => setData('clients_title', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                            </div>

                            <div className="space-y-3">
                                {(data.clients || []).map((client: any, idx: number) => (
                                    <div key={idx} className="flex flex-wrap items-start gap-3">
                                        <input
                                            type="text"
                                            value={client.name || ''}
                                            onChange={(e) => updateArray('clients', idx, 'name', e.target.value)}
                                            placeholder="Client name"
                                            className="min-w-[180px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        <ImageUpload
                                            label="Logo"
                                            preview={data.client_logo_files[idx] ? URL.createObjectURL(data.client_logo_files[idx]!) : client.logo}
                                            onChange={(file) => setClientLogo(idx, file)}
                                        />
                                        <LogoSearch
                                            query={client.name || ''}
                                            onSelect={(logo) => updateArray('clients', idx, 'logo', logo)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeItem('clients', idx)}
                                            className="rounded p-2 text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addItem('clients', { name: '' })}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <Plus className="h-4 w-4" />
                                Add Client
                            </button>
                        </Section>
                    )}

                    {activeTab === 'stats' && (
                        <Section title="Stats">
                            <div className="space-y-3">
                                {(data.stats || []).map((stat: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={stat.value || ''}
                                            onChange={(e) => updateArray('stats', idx, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={stat.label || ''}
                                            onChange={(e) => updateArray('stats', idx, 'label', e.target.value)}
                                            placeholder="Label"
                                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeItem('stats', idx)}
                                            className="rounded p-2 text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addItem('stats', { value: '', label: '' })}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <Plus className="h-4 w-4" />
                                Add Stat
                            </button>
                        </Section>
                    )}

                    {activeTab === 'cta' && (
                        <Section title="Call to Action">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Field label="Title">
                                        <input
                                            type="text"
                                            value={data.cta_title || ''}
                                            onChange={(e) => setData('cta_title', e.target.value)}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                    </Field>
                                </div>
                                <div className="sm:col-span-2">
                                    <Field label="Subtitle">
                                        <textarea
                                            value={data.cta_subtitle || ''}
                                            onChange={(e) => setData('cta_subtitle', e.target.value)}
                                            rows={2}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                    </Field>
                                </div>
                                <Field label="Button Text">
                                    <input
                                        type="text"
                                        value={data.cta_button || ''}
                                        onChange={(e) => setData('cta_button', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                                <Field label="Button Link">
                                    <input
                                        type="text"
                                        value={data.cta_link || ''}
                                        onChange={(e) => setData('cta_link', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                            </div>
                        </Section>
                    )}

                    {activeTab === 'footer' && (
                        <Section title="Footer">
                            <div className="mb-4">
                                <Field label="Tagline">
                                    <textarea
                                        value={data.footer_tagline || ''}
                                        onChange={(e) => setData('footer_tagline', e.target.value)}
                                        rows={2}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                            </div>

                            <h4 className="mb-2 text-sm font-semibold text-slate-800">Social Links</h4>
                            <div className="space-y-3">
                                {(data.social_links || []).map((link: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={link.name || ''}
                                            onChange={(e) => updateArray('social_links', idx, 'name', e.target.value)}
                                            placeholder="Name"
                                            className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={link.url || ''}
                                            onChange={(e) => updateArray('social_links', idx, 'url', e.target.value)}
                                            placeholder="URL"
                                            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeItem('social_links', idx)}
                                            className="rounded p-2 text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => addItem('social_links', { name: '', url: '' })}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <Plus className="h-4 w-4" />
                                Add Social Link
                            </button>
                        </Section>
                    )}

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
