import { Head } from '@inertiajs/react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { Hero } from '@/Components/Hero';
import { ServicesGrid } from '@/Components/ServicesGrid';
import { Clients } from '@/Components/Clients';
import { Stats } from '@/Components/Stats';
import { Cta } from '@/Components/Cta';

export default function Home() {
    return (
        <>
            <Head title="Home" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                <Hero />
                <ServicesGrid />
                <Clients />
                <Stats />
                <Cta />

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}
