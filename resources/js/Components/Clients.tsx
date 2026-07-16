import { usePage } from '@inertiajs/react';
import { useState } from 'react';

function ClientLogo({ name, logo }: { name: string; logo: string }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span className="text-xl font-bold text-slate-500 transition-colors hover:text-indigo-600">
                {name}
            </span>
        );
    }

    return (
        <img
            src={logo}
            alt={name}
            onError={() => setFailed(true)}
            className="h-9 w-auto object-contain opacity-90 transition hover:opacity-100"
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

    return (
        <section className="border-y border-slate-200 bg-slate-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="text-center md:text-left">
                        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Trusted By</p>
                        <p className="font-bold text-slate-900">{c.clients_title || 'GREAT COMPANIES'}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        {clients.map((client: any, idx: number) =>
                            client.logo ? (
                                <ClientLogo key={client.name + idx} name={client.name} logo={client.logo} />
                            ) : (
                                <span
                                    key={client.name + idx}
                                    className="text-xl font-bold text-slate-500 transition-colors hover:text-indigo-600"
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
