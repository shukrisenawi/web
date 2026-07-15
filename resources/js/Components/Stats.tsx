import { usePage } from '@inertiajs/react';
import { ShieldCheck, Users, Rocket, Headphones, Globe, Smartphone, Palette, TrendingUp, Cloud, Shield, Code, Megaphone, BarChart, Layers, Monitor } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
    ShieldCheck,
    Users,
    Rocket,
    Headphones,
    Globe,
    Smartphone,
    Palette,
    TrendingUp,
    Cloud,
    Shield,
    Code,
    Megaphone,
    BarChart,
    Layers,
    Monitor,
};

export function Stats() {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const stats = (c.stats || []);

    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2">
                    <div className="max-w-md">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Why Choose Us</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                            Your success is our priority.
                        </h2>
                        <p className="mt-4 text-sm text-slate-600">
                            We combine creativity, technology and strategy to deliver outstanding results that
                            drive real impact.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat: any, idx: number) => {
                            const Icon = iconMap[stat.icon] || ShieldCheck;
                            return (
                                <div key={stat.label + idx} className="text-center">
                                    <div className="mx-auto inline-flex rounded-full bg-slate-50 p-4">
                                        <Icon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <p className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</p>
                                    <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
