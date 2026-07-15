import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Bell, User, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';


interface UserProfile {
    name: string;
    email: string;
    company: string | null;
    avatar: string | null;
}

interface ProfileProps {
    user: UserProfile;
}

export default function Profile({ user }: ProfileProps) {
    const { flash } = usePage().props as any;

    const profileForm = useForm({
        name: user.name,
        email: user.email,
        company: user.company ?? '',
    });

    const [avatarPreview, setAvatarPreview] = useState(user.avatar);

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
        if (confirm('Are you sure you want to remove your avatar?')) {
            removeAvatarForm.post('/profile/avatar/remove');
            setAvatarPreview(null);
        }
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
                    {/** Edit profile */}
                    <Card>
                        <div className="mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-slate-900">Edit Profile</h3>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                {profileForm.errors.name && <p className="mt-1 text-xs text-red-600">{profileForm.errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                {profileForm.errors.email && <p className="mt-1 text-xs text-red-600">{profileForm.errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company</label>
                                <input
                                    id="company"
                                    type="text"
                                    value={profileForm.data.company}
                                    onChange={(e) => profileForm.setData('company', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                {profileForm.errors.company && <p className="mt-1 text-xs text-red-600">{profileForm.errors.company}</p>}
                            </div>

                            {avatarForm.errors.avatar && <p className="text-xs text-red-600">{avatarForm.errors.avatar}</p>}

                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
                            >
                                {profileForm.processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </Card>

                    {/** Change password */}
                    <Card>
                        <div className="mb-4 flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-slate-900">Change Password</h3>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-slate-700">
                                    Current Password
                                </label>
                                <input
                                    id="current_password"
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="mt-1 text-xs text-red-600">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">New Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                {passwordForm.errors.password && <p className="mt-1 text-xs text-red-600">{passwordForm.errors.password}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="password_confirmation"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Confirm New Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-70"
                            >
                                {passwordForm.processing ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
}
