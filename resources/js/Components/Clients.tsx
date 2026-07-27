import { usePage } from '@inertiajs/react';
import { useState } from 'react';

function ClientLogo({ name, logo }: { name: string; logo: string }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span className="whitespace-nowrap text-lg font-bold text-slate-500 transition-colors hover:text-indigo-600">
                {name}
            </span>
        );
    }

    return (
        <img
            src={logo}
            alt={name}
            onError={() => setFailed(true)}
            className="h-[80px] w-auto shrink-0 object-contain opacity-90 transition hover:opacity-100"
        />
    );
}

export function Clients() {
    const { frontpage } = usePage().props as any;
    const c = frontpage ?? {};
    const clients = (c.clients || []).map((client: any) => ({
        name: client?.name || client,
        logo: client?.logo || null,
    }));

    // Duplicate the list for seamless infinite loop
    const doubled = [...clients, ...clients];

    return (
        <section className="border-y border-slate-200 bg-slate-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-center gap-3 text-center md:mb-10">
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Trusted By</p>
                    <p className="font-bold text-slate-900">{c.clients_title || 'GREAT COMPANIES'}</p>
                </div>

                <div className="relative overflow-hidden">
                    {/* Gradient masks on edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-50 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-50 to-transparent" />

                    <div className="animate-marquee flex w-max items-center gap-12">
                        {doubled.map((client: any, idx: number) =>
                            client.logo ? (
                                <ClientLogo key={client.name + idx} name={client.name} logo={client.logo} />
                            ) : (
                                <span
                                    key={client.name + idx}
                                    className="whitespace-nowrap text-lg font-bold text-slate-500 transition-colors hover:text-indigo-600"
                                >
                                    {client.name}
                                </span>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
