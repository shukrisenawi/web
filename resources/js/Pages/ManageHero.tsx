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

const pageHeroTabs = [
    { key: 'home_hero', label: 'Home' },
    { key: 'services_hero', label: 'Services' },
    { key: 'web_development_hero', label: 'Web Development' },
    { key: 'mobile_apps_hero', label: 'Mobile Apps' },
    { key: 'web_system_hero', label: 'Web System' },
    { key: 'digital_marketing_hero', label: 'Digital Marketing' },
    { key: 'game_development_hero', label: 'Game Development' },
    { key: 'it_equipment_hero', label: 'IT Equipment' },
    { key: 'work_hero', label: 'Work' },
    { key: 'about_hero', label: 'About Us' },
] as const;

type PageHeroKey = (typeof pageHeroTabs)[number]['key'];

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

function PageHeroForm({
    heroKey,
    data,
    setData,
}: {
    heroKey: PageHeroKey;
    data: Record<string, any>;
    setData: (key: string, value: any) => void;
}) {
    const hero = (data[heroKey] || {}) as Record<string, any>;
    const fileKey = `${heroKey}_image_file`;

    const setHeroField = (field: string, value: any) => {
        setData(heroKey, { ...hero, [field]: value });
    };

    return (
        <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Badge">
                <input
                    type="text"
                    value={hero.badge || ''}
                    onChange={(e) => setHeroField('badge', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
            </Field>
            <ImageUpload
                label="Hero Image"
                preview={data[fileKey] ? URL.createObjectURL(data[fileKey]) : hero.image}
                onChange={(file) => setData(fileKey, file)}
            />
            <div className="sm:col-span-2">
                <Field label="Title">
                    <textarea
                        value={hero.title || ''}
                        onChange={(e) => setHeroField('title', e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </Field>
            </div>
            <div className="sm:col-span-2">
                <Field label="Subtitle">
                    <textarea
                        value={hero.subtitle || ''}
                        onChange={(e) => setHeroField('subtitle', e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </Field>
            </div>
            {(heroKey === 'home_hero' || heroKey === 'mobile_apps_hero' || heroKey === 'digital_marketing_hero' || heroKey === 'game_development_hero') && (
                <>
                    <Field label="Primary CTA">
                        <input
                            type="text"
                            value={hero.primary_cta || ''}
                            onChange={(e) => setHeroField('primary_cta', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </Field>
                    <Field label="Primary Link">
                        <input
                            type="text"
                            value={hero.primary_link || ''}
                            onChange={(e) => setHeroField('primary_link', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </Field>
                    <Field label="Secondary CTA">
                        <input
                            type="text"
                            value={hero.secondary_cta || ''}
                            onChange={(e) => setHeroField('secondary_cta', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </Field>
                    <Field label="Secondary Link">
                        <input
                            type="text"
                            value={hero.secondary_link || ''}
                            onChange={(e) => setHeroField('secondary_link', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </Field>
                    <Field label="Trusted Text">
                        <input
                            type="text"
                            value={hero.trusted_text || ''}
                            onChange={(e) => setHeroField('trusted_text', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </Field>
                    <Field label="Trusted Subtext">
                        <input
                            type="text"
                            value={hero.trusted_subtext || ''}
                            onChange={(e) => setHeroField('trusted_subtext', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </Field>
                </>
            )}
        </div>
    );
}

function CardsEditor({
    heroKey,
    data,
    setData,
}: {
    heroKey: string;
    data: Record<string, any>;
    setData: (key: string, value: any) => void;
}) {
    const hero = data[heroKey] || {};
    const cards = hero.cards || [];

    const setCards = (newCards: any[]) => {
        setData(heroKey, { ...hero, cards: newCards });
    };

    return (
        <>
            <div className="space-y-4">
                {cards.map((card: any, idx: number) => (
                    <div key={`card-${card.title || idx}`} className="rounded-lg border border-slate-200 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-700">Card #{idx + 1}</span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newCards = [...cards];
                                        const newIndex = idx - 1;
                                        if (newIndex < 0 || newIndex >= newCards.length) return;
                                        [newCards[idx], newCards[newIndex]] = [newCards[newIndex], newCards[idx]];
                                        setCards(newCards);
                                    }}
                                    className="rounded p-1 text-slate-400 hover:bg-slate-100"
                                >
                                    <GripVertical className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newCards = [...cards];
                                        newCards.splice(idx, 1);
                                        setCards(newCards);
                                    }}
                                    className="rounded p-1 text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Icon">
                                <input
                                    type="text"
                                    value={card.icon || ''}
                                    onChange={(e) => {
                                        const newCards = [...cards];
                                        newCards[idx] = { ...newCards[idx], icon: e.target.value };
                                        setCards(newCards);
                                    }}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </Field>
                            <Field label="Title">
                                <input
                                    type="text"
                                    value={card.title || ''}
                                    onChange={(e) => {
                                        const newCards = [...cards];
                                        newCards[idx] = { ...newCards[idx], title: e.target.value };
                                        setCards(newCards);
                                    }}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Description">
                                    <textarea
                                        value={card.description || ''}
                                        onChange={(e) => {
                                            const newCards = [...cards];
                                            newCards[idx] = { ...newCards[idx], description: e.target.value };
                                            setCards(newCards);
                                        }}
                                        rows={2}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={() => setCards([...cards, { icon: '', title: '', description: '' }])}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
                <Plus className="h-4 w-4" />
                Add Card
            </button>
        </>
    );
}

export default function ManageHero({ content }: ManageHeroProps) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, errors, reset } = useForm({
        ...content,
        hero_image_file: null as File | null,
        hero_avatar_files: {} as Record<number, File | null>,
        mobile_apps_hero_avatar_files: {} as Record<number, File | null>,
        digital_marketing_hero_avatar_files: {} as Record<number, File | null>,
        game_development_hero_avatar_files: {} as Record<number, File | null>,
        ...Object.fromEntries(pageHeroTabs.map((t) => [`${t.key}_image_file`, null as File | null])),
    } as any);

    const [activeTab, setActiveTab] = useState<'home' | PageHeroKey>('home');

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
        if (key === 'mobile_apps_hero_avatars') {
            const files = { ...data.mobile_apps_hero_avatar_files };
            delete files[index];
            setData('mobile_apps_hero_avatar_files', files);
        }
        if (key === 'digital_marketing_hero_avatars') {
            const files = { ...data.digital_marketing_hero_avatar_files };
            delete files[index];
            setData('digital_marketing_hero_avatar_files', files);
        }
        if (key === 'game_development_hero_avatars') {
            const files = { ...data.game_development_hero_avatar_files };
            delete files[index];
            setData('game_development_hero_avatar_files', files);
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

    const setMobileAppsHeroAvatar = (idx: number, file: File | null) => {
        setData('mobile_apps_hero_avatar_files', { ...data.mobile_apps_hero_avatar_files, [idx]: file });
    };

    const setDigitalMarketingHeroAvatar = (idx: number, file: File | null) => {
        setData('digital_marketing_hero_avatar_files', { ...data.digital_marketing_hero_avatar_files, [idx]: file });
    };

    const setGameDevHeroAvatar = (idx: number, file: File | null) => {
        setData('game_development_hero_avatar_files', { ...data.game_development_hero_avatar_files, [idx]: file });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/manage-hero', {
            preserveScroll: true,
            onSuccess: (page: any) => {
                reset('hero_image_file');
                setData('hero_avatar_files', {});
                setData('mobile_apps_hero_avatar_files', {});
                setData('digital_marketing_hero_avatar_files', {});
                setData('game_development_hero_avatar_files', {});
                pageHeroTabs.forEach((t) => {
                    setData(`${t.key}_image_file`, null);
                });
                const c = page.props.content as Record<string, any> | undefined;
                if (c) {
                    if (c.hero_avatars) setData('hero_avatars', c.hero_avatars);
                    if (c.mobile_apps_hero_avatars) setData('mobile_apps_hero_avatars', c.mobile_apps_hero_avatars);
                    if (c.digital_marketing_hero_avatars) setData('digital_marketing_hero_avatars', c.digital_marketing_hero_avatars);
                    if (c.game_development_hero_avatars) setData('game_development_hero_avatars', c.game_development_hero_avatars);
                    pageHeroTabs.forEach((t) => {
                        if (c[t.key]) setData(t.key, c[t.key]);
                    });
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
                            Manage hero section content for every page.
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

                    <div className="mb-6 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('home')}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === 'home'
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            Home Hero
                        </button>
                        {pageHeroTabs.slice(1).map((tab) => (
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

                    {activeTab === 'home' && (
                        <>
                            <Section title="Home Hero Content">
                                <PageHeroForm heroKey="home_hero" data={data} setData={setData} />
                            </Section>

                            <Section title="Trusted-by Avatars">
                                <p className="mb-4 text-sm text-slate-600">
                                    These avatars appear in the home hero section next to the trusted text.
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
                        </>
                    )}

                    {activeTab !== 'home' && activeTab !== 'mobile_apps_hero' && activeTab !== 'digital_marketing_hero' && (
                        <>
                            <Section title={`${pageHeroTabs.find((t) => t.key === activeTab)?.label} Hero`}>
                                <PageHeroForm heroKey={activeTab} data={data} setData={setData} />
                            </Section>

                            {['services_hero', 'web_development_hero', 'web_system_hero', 'game_development_hero', 'it_equipment_hero'].includes(activeTab) && (
                                <Section title="Hero Info Cards">
                                    <p className="mb-4 text-sm text-slate-600">
                                        These cards appear below the subtitle in the hero section.
                                    </p>

                                    <CardsEditor heroKey={activeTab} data={data} setData={setData} />
                                </Section>
                            )}

                            {activeTab === 'game_development_hero' && (
                                <Section title="Trusted-by Avatars">
                                    <p className="mb-4 text-sm text-slate-600">
                                        These avatars appear next to the trusted text in the Game Development hero section.
                                    </p>

                                    <div className="space-y-4">
                                        {(data.game_development_hero_avatars || []).map((avatar: any, idx: number) => (
                                            <div key={`gd-avatar-${avatar.image ? avatar.image.slice(-12) : idx}`} className="rounded-lg border border-slate-200 p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-slate-700">Avatar #{idx + 1}</span>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => moveItem('game_development_hero_avatars', idx, -1)}
                                                            className="rounded p-1 text-slate-400 hover:bg-slate-100"
                                                        >
                                                            <GripVertical className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem('game_development_hero_avatars', idx)}
                                                            className="rounded p-1 text-red-500 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <ImageUpload
                                                    label="Avatar Image"
                                                    preview={
                                                        data.game_development_hero_avatar_files[idx]
                                                            ? URL.createObjectURL(data.game_development_hero_avatar_files[idx]!)
                                                            : avatar.image
                                                    }
                                                    onChange={(file) => setGameDevHeroAvatar(idx, file)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => addItem('game_development_hero_avatars', { image: '' })}
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Avatar
                                    </button>
                                </Section>
                            )}
                        </>
                    )}

                    {activeTab === 'mobile_apps_hero' && (
                        <>
                            <Section title="Mobile Apps Hero">
                                <PageHeroForm heroKey="mobile_apps_hero" data={data} setData={setData} />
                            </Section>

                            <Section title="Trusted-by Avatars">
                                <p className="mb-4 text-sm text-slate-600">
                                    These avatars appear next to the trusted text in the Mobile Apps hero section.
                                </p>

                                <div className="space-y-4">
                                    {(data.mobile_apps_hero_avatars || []).map((avatar: any, idx: number) => (
                                        <div key={`ma-avatar-${avatar.image ? avatar.image.slice(-12) : idx}`} className="rounded-lg border border-slate-200 p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-slate-700">Avatar #{idx + 1}</span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveItem('mobile_apps_hero_avatars', idx, -1)}
                                                        className="rounded p-1 text-slate-400 hover:bg-slate-100"
                                                    >
                                                        <GripVertical className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem('mobile_apps_hero_avatars', idx)}
                                                        className="rounded p-1 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <ImageUpload
                                                label="Avatar Image"
                                                preview={
                                                    data.mobile_apps_hero_avatar_files[idx]
                                                        ? URL.createObjectURL(data.mobile_apps_hero_avatar_files[idx]!)
                                                        : avatar.image
                                                }
                                                onChange={(file) => setMobileAppsHeroAvatar(idx, file)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addItem('mobile_apps_hero_avatars', { image: '' })}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Avatar
                                </button>
                            </Section>
                        </>
                    )}

                    {activeTab === 'digital_marketing_hero' && (
                        <>
                            <Section title="Digital Marketing Hero">
                                <PageHeroForm heroKey="digital_marketing_hero" data={data} setData={setData} />
                            </Section>

                            <Section title="Trusted-by Avatars">
                                <p className="mb-4 text-sm text-slate-600">
                                    These avatars appear next to the trusted text in the Digital Marketing hero section.
                                </p>

                                <div className="space-y-4">
                                    {(data.digital_marketing_hero_avatars || []).map((avatar: any, idx: number) => (
                                        <div key={`dm-avatar-${avatar.image ? avatar.image.slice(-12) : idx}`} className="rounded-lg border border-slate-200 p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-slate-700">Avatar #{idx + 1}</span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveItem('digital_marketing_hero_avatars', idx, -1)}
                                                        className="rounded p-1 text-slate-400 hover:bg-slate-100"
                                                    >
                                                        <GripVertical className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem('digital_marketing_hero_avatars', idx)}
                                                        className="rounded p-1 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <ImageUpload
                                                label="Avatar Image"
                                                preview={
                                                    data.digital_marketing_hero_avatar_files[idx]
                                                        ? URL.createObjectURL(data.digital_marketing_hero_avatar_files[idx]!)
                                                        : avatar.image
                                                }
                                                onChange={(file) => setDigitalMarketingHeroAvatar(idx, file)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addItem('digital_marketing_hero_avatars', { image: '' })}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Avatar
                                </button>
                            </Section>
                        </>
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
