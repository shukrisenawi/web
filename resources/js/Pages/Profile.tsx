import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Bell, User, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';
import ConfirmModal from '@/Components/ConfirmModal';

const inputClass =
    'mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none';
const labelClass = 'block text-sm font-medium text-slate-700';


interface PersonInCharge {
    name: string;
    role: string;
    email?: string | null;
}

interface UserProfile {
    name: string;
    email: string;
    company: string | null;
    industry?: string | null;
    industry_other?: string | null;
    business_address?: string | null;
    business_no?: string | null;
    whatsapp?: string | null;
    business_reg_no?: string | null;
    persons_in_charge?: PersonInCharge[];
    avatar: string | null;
}

const INDUSTRIES = [
    'Retail & E-Commerce',
    'Food & Beverage (F&B)',
    'Healthcare',
    'Education',
    'Finance',
    'Manufacturing',
    'Construction',
    'Real Estate',
    'Logistics',
    'Travel & Tourism',
    'Hotel & Hospitality',
    'Government',
    'NGO / Non-Profit',
    'Religious Organization',
    'Agriculture',
    'Beauty & Wellness',
    'Automotive',
    'IT & Technology',
    'Professional Services',
    'Others',
];

interface ProfileProps {
    user: UserProfile;
}

export default function Profile({ user }: ProfileProps) {
    const { flash } = usePage().props as any;

    const profileForm = useForm({
        name: user.name,
        email: user.email,
        company: user.company ?? '',
        industry: user.industry ?? '',
        industry_other: user.industry_other ?? '',
        business_address: user.business_address ?? '',
        business_no: user.business_no ?? '',
        whatsapp: user.whatsapp ?? '',
        business_reg_no: user.business_reg_no ?? '',
        persons_in_charge: user.persons_in_charge ?? [],
    });

    const addPerson = () => {
        profileForm.setData('persons_in_charge', [
            ...profileForm.data.persons_in_charge,
            { name: '', role: 'Staff', email: '' },
        ]);
    };

    const updatePerson = (idx: number, key: keyof PersonInCharge, value: string) => {
        const next = profileForm.data.persons_in_charge.map((p, i) =>
            i === idx ? { ...p, [key]: value } : p
        );
        profileForm.setData('persons_in_charge', next);
    };

    const removePerson = (idx: number) => {
        profileForm.setData(
            'persons_in_charge',
            profileForm.data.persons_in_charge.filter((_, i) => i !== idx)
        );
    };

    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [removeAvatarOpen, setRemoveAvatarOpen] = useState(false);

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (profileForm.data.industry === 'Others' && !profileForm.data.industry_other.trim()) {
            profileForm.setError('industry_other', 'Please specify your industry');
            return;
        }
        profileForm.post('/profile', {
            forceFormData: true,
        });
    };

    const avatarForm = useForm({
        avatar: null as File | null,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            avatarForm.setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
            avatarForm.post('/profile/avatar', {
                forceFormData: true,
                preserveScroll: true,
                onError: () => setAvatarPreview(user.avatar),
            });
        }
    };

    const handleAvatarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        avatarForm.post('/profile/avatar', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post('/profile/password', {
            onSuccess: () => passwordForm.reset(),
        });
    };

    const removeAvatarForm = useForm({});

    const handleRemoveAvatar = (e: React.FormEvent) => {
        e.preventDefault();
        setRemoveAvatarOpen(true);
    };

    const confirmRemoveAvatar = () => {
        removeAvatarForm.post('/profile/avatar/remove');
        setAvatarPreview(null);
        setRemoveAvatarOpen(false);
    };

    return (
        <>
            <Head title="Profile" />

            <DashboardLayout title="Profile & Team">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Profile & Team</h2>
                        <p className="text-sm text-slate-500">Manage your account information and security settings.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        Back to Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                        {flash.success}
                    </div>
                )}

                {/** Profile header */}
                <Card className="mb-6">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <label htmlFor="avatar" className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-600">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="font-mono text-3xl font-black text-white">{'</>'}</span>
                            )}
                            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                                Change
                            </span>
                        </label>
                        <input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            {user.company && <Badge color="blue">{user.company}</Badge>}
                            {avatarPreview && (
                                <form onSubmit={handleRemoveAvatar} className="mt-2">
                                    <button
                                        type="submit"
                                        disabled={removeAvatarForm.processing}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Remove avatar
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/** Edit profile / company */}
                    <Card>
                        <div className="mb-6 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            <div>
                                <h3 className="font-semibold text-slate-900">Company Information</h3>
                                <p className="text-sm text-slate-500">Update your business &amp; contact details.</p>
                            </div>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="company" className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                                <input
                                    id="company"
                                    type="text"
                                    value={profileForm.data.company}
                                    onChange={(e) => profileForm.setData('company', e.target.value)}
                                    className={inputClass}
                                    placeholder="Acme Corporation"
                                />
                                {profileForm.errors.company && <p className="mt-1 text-xs text-red-600">{profileForm.errors.company}</p>}
                            </div>

                            <div>
                                <label htmlFor="business_address" className={labelClass}>Company Address</label>
                                <textarea
                                    id="business_address"
                                    rows={2}
                                    value={profileForm.data.business_address}
                                    onChange={(e) => profileForm.setData('business_address', e.target.value)}
                                    className={inputClass}
                                    placeholder="Street, City, State, Postcode"
                                />
                                {profileForm.errors.business_address && <p className="mt-1 text-xs text-red-600">{profileForm.errors.business_address}</p>}
                            </div>

                            <div>
                                <label htmlFor="industry" className={labelClass}>Industry <span className="text-red-500">*</span></label>
                                <select
                                    id="industry"
                                    value={profileForm.data.industry}
                                    onChange={(e) => profileForm.setData('industry', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="">Select an industry…</option>
                                    {INDUSTRIES.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                {profileForm.errors.industry && <p className="mt-1 text-xs text-red-600">{profileForm.errors.industry}</p>}
                            </div>

                            {profileForm.data.industry === 'Others' && (
                                <div>
                                    <label htmlFor="industry_other" className={labelClass}>Please specify your industry <span className="text-red-500">*</span></label>
                                    <input
                                        id="industry_other"
                                        type="text"
                                        value={profileForm.data.industry_other}
                                        onChange={(e) => profileForm.setData('industry_other', e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Media, Entertainment…"
                                    />
                                    {profileForm.errors.industry_other && <p className="mt-1 text-xs text-red-600">{profileForm.errors.industry_other}</p>}
                                </div>
                            )}

                            <div className="border-t border-slate-100 pt-5">
                                <p className="mb-4 text-sm font-semibold text-slate-800">Contact Person</p>
                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="name" className={labelClass}>Contact Name <span className="text-red-500">*</span></label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) => profileForm.setData('name', e.target.value)}
                                            className={inputClass}
                                            placeholder="John Doe"
                                        />
                                        {profileForm.errors.name && <p className="mt-1 text-xs text-red-600">{profileForm.errors.name}</p>}
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="whatsapp" className={labelClass}>Mobile</label>
                                            <input
                                                id="whatsapp"
                                                type="tel"
                                                value={profileForm.data.whatsapp}
                                                onChange={(e) => profileForm.setData('whatsapp', e.target.value)}
                                                className={inputClass}
                                                placeholder="+60 12-345 6789"
                                            />
                                            {profileForm.errors.whatsapp && <p className="mt-1 text-xs text-red-600">{profileForm.errors.whatsapp}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={profileForm.data.email}
                                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                                className={inputClass}
                                                placeholder="you@company.com"
                                            />
                                            {profileForm.errors.email && <p className="mt-1 text-xs text-red-600">{profileForm.errors.email}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {avatarForm.errors.avatar && <p className="text-xs text-red-600">{avatarForm.errors.avatar}</p>}

                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
                            >
                                {profileForm.processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </Card>

                    {/** Persons in charge */}
                    <Card>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900">Persons In Charge</h3>
                                <p className="text-sm text-slate-500">Team members who can manage this account.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => profileForm.submit()}
                                disabled={profileForm.processing}
                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
                            >
                                {profileForm.processing ? 'Saving...' : 'Save'}
                            </button>
                        </div>

                        <div className="space-y-3">
                            {profileForm.data.persons_in_charge.map((person, idx) => (
                                <div key={`${person.name}-${idx}`} className="rounded-xl border border-slate-100 p-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={person.name}
                                            onChange={(e) => updatePerson(idx, 'name', e.target.value)}
                                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        />
                                        <select
                                            value={person.role}
                                            onChange={(e) => updatePerson(idx, 'role', e.target.value)}
                                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="Primary">Primary</option>
                                            <option value="Billing">Billing</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removePerson(idx)}
                                            className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email (optional)"
                                        value={person.email ?? ''}
                                        onChange={(e) => updatePerson(idx, 'email', e.target.value)}
                                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addPerson}
                                className="w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 hover:border-blue-500 hover:text-blue-600"
                            >
                                + Add Person In Charge
                            </button>
                        </div>
                    </Card>

                    {/** Change password */}
                    <Card>
                        <div className="mb-6 flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-600" />
                            <div>
                                <h3 className="font-semibold text-slate-900">Change Password</h3>
                                <p className="text-sm text-slate-500">Keep your account secure.</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="current_password" className={labelClass}>
                                    Current Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="current_password"
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className={inputClass}
                                    placeholder="••••••••"
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="mt-1 text-xs text-red-600">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className={labelClass}>New Password <span className="text-red-500">*</span></label>
                                <input
                                    id="password"
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className={inputClass}
                                    placeholder="••••••••"
                                />
                                {passwordForm.errors.password && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.password}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className={labelClass}
                                >
                                    Confirm New Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className={inputClass}
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-70"
                            >
                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </Card>
                </div>
            </DashboardLayout>

            <ConfirmModal
                open={removeAvatarOpen}
                onClose={() => setRemoveAvatarOpen(false)}
                onConfirm={confirmRemoveAvatar}
                title="Remove Avatar"
                message="Are you sure you want to remove your avatar?"
                confirmText="Remove"
                confirmColor="red"
            />
        </>
    );
}
