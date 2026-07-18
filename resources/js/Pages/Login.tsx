import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />

            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-flex items-center justify-center gap-2 font-bold text-xl tracking-wider">
                            <div className="flex items-center text-blue-600">
                                <span className="font-mono text-2xl font-black">{'</>'}</span>
                            </div>
                            <span>
                                <span className="text-slate-900">KENJU</span>
                                <span className="text-blue-600">TECH</span>
                            </span>
                        </Link>
                        <h1 className="mt-6 text-2xl font-bold text-slate-900">Welcome back</h1>
                        <p className="mt-2 text-sm text-slate-500">Sign in to access your client dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                                />
                                Remember me
                            </label>
                            <Link href="#" className="text-sm font-semibold text-blue-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
                        >
                            Sign In
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-semibold text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
