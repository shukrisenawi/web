import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { LandingHeader } from '@/Layouts/LandingHeader';
import { LandingFooter } from '@/Layouts/LandingFooter';
import { Cta } from '@/Components/Cta';
import { HeroBackground } from '@/Components/HeroBackground';

interface Post {
    id: number;
    title: string;
    slug: string;
    category: string | null;
    author: string | null;
    image: string | null;
    content: string;
    published_at: string | null;
}

export default function BlogPost() {
    const { post, related } = usePage().props as unknown as { post: Post; related: Post[] };

    const formatDate = (value: string | null) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    if (!post) {
        return (
            <>
                <Head title="Post Not Found" />
                <div className="min-h-screen bg-white">
                    <LandingHeader />
                    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                        <h1 className="text-4xl font-bold text-slate-900">Post Not Found</h1>
                        <p className="mt-4 text-slate-600">The article you are looking for does not exist.</p>
                        <Link href="/blog" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Link>
                    </div>
                    <LandingFooter mode="dark" />
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={post.title} />

            <div className="min-h-screen bg-white">
                <LandingHeader />

                <article className="relative overflow-hidden bg-[#050914] py-16 text-white sm:py-20">
                    <HeroBackground />
                    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Blog
                        </Link>
                        <span className="mt-6 block text-sm font-semibold uppercase tracking-wider text-blue-500">{post.category}</span>
                        <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">{post.title}</h1>
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.published_at)}
                            </span>
                        </div>
                    </div>
                </article>

                <section className="py-12 sm:py-16">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="aspect-[16/9] overflow-hidden rounded-2xl">
                            <img
                                src={post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'}
                                alt={post.title}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="prose prose-slate mt-10 max-w-none">
                            {post.content.split('\n').map((paragraph, idx) => {
                                if (!paragraph.trim()) return null;
                                if (paragraph.match(/^\d+\./)) {
                                    return <p key={idx} className="mt-2 text-slate-700">{paragraph.trim()}</p>;
                                }
                                return <p key={idx} className="mt-4 leading-relaxed text-slate-700">{paragraph.trim()}</p>;
                            })}
                        </div>

                        <div className="mt-12 border-t border-slate-200 pt-8">
                            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Blog
                            </Link>
                        </div>

                        {related.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-xl font-semibold text-slate-900">Related Posts</h2>
                                <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {related.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/blog/${item.slug}`}
                                            className="group block overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"
                                        >
                                            <div className="aspect-[16/10] overflow-hidden">
                                                <img
                                                    src={item.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <span className="text-xs font-semibold text-blue-600">{item.category}</span>
                                                <h3 className="mt-1 font-semibold text-slate-900">{item.title}</h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
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
