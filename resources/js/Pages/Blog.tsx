import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { HeroBackground } from '@/Components/HeroBackground';
import { Cta } from '@/Components/Cta';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image: string | null;
    category: string | null;
    author: string | null;
    published_at: string | null;
}

export default function Blog() {
    const { posts } = usePage().props as { posts: Post[] };

    const formatDate = (value: string | null) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <Head title="Blog" />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                <div className="relative overflow-hidden bg-[#050914] py-16 text-white sm:py-20">
                    <HeroBackground />
                    <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">Insights</p>
                        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Our Blog</h1>
                        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
                            Tips, trends and insights on technology, design and digital growth.
                        </p>
                    </div>
                </div>

                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {posts.map((post) => (
                                <article key={post.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'}
                                            alt={post.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <span className="text-xs font-semibold text-blue-600">{post.category}</span>
                                        <h3 className="mt-2 text-lg font-semibold text-slate-900">{post.title}</h3>
                                        <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">{post.excerpt || ''}</p>
                                        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {post.author}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(post.published_at)}
                                            </span>
                                        </div>
                                        <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                                            Read More
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {posts.length === 0 && (
                            <div className="py-16 text-center">
                                <p className="text-slate-500">No published blog posts yet.</p>
                            </div>
                        )}
                    </div>
                </section>

                <Cta />

                <LandingFooter mode="dark" />
            </div>
        </>
    );
}
