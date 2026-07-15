import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { DashboardLayout, Card, Badge } from '@/Layouts/Dashboard';
import {
    Plus,
    Pencil,
    Trash2,
    Save,
    X,
    Image as ImageIcon,
    Calendar,
    Eye,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
} from 'lucide-react';

interface Post {
    id: number;
    title: string;
    slug: string;
    category: string | null;
    author: string | null;
    image: string | null;
    excerpt: string | null;
    content: string;
    published_at: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

interface ManageBlogProps {
    posts: Post[];
}

const emptyPost = {
    title: '',
    slug: '',
    category: '',
    author: '',
    image: null as string | null,
    excerpt: '',
    content: '',
    published_at: '',
    is_published: true,
    image_file: null as File | null,
};

export default function ManageBlog({ posts }: ManageBlogProps) {
    const { flash } = usePage().props as any;
    const [editing, setEditing] = useState<Post | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showDelete, setShowDelete] = useState<Post | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({ ...emptyPost });

    const startCreate = () => {
        setEditing(null);
        setIsCreating(true);
        reset();
        setData({ ...emptyPost });
    };

    const startEdit = (postItem: Post) => {
        setIsCreating(false);
        setEditing(postItem);
        setData({
            title: postItem.title,
            slug: postItem.slug,
            category: postItem.category || '',
            author: postItem.author || '',
            image: postItem.image,
            excerpt: postItem.excerpt || '',
            content: postItem.content,
            published_at: postItem.published_at || '',
            is_published: postItem.is_published,
            image_file: null,
        });
    };

    const cancelForm = () => {
        setEditing(null);
        setIsCreating(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('slug', data.slug);
        formData.append('category', data.category);
        formData.append('author', data.author);
        formData.append('excerpt', data.excerpt);
        formData.append('content', data.content);
        formData.append('published_at', data.published_at);
        formData.append('is_published', data.is_published ? '1' : '0');
        if (data.image_file) {
            formData.append('image', data.image_file);
        }

        if (editing) {
            put(`/manage-blog/${editing.slug}`, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => cancelForm(),
            });
        } else {
            post('/manage-blog', {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => cancelForm(),
            });
        }
    };

    const confirmDelete = (postItem: Post) => {
        setShowDelete(postItem);
    };

    const handleDelete = () => {
        if (!showDelete) return;
        router.delete(`/manage-blog/${showDelete.slug}`, {
            preserveScroll: true,
            onSuccess: () => setShowDelete(null),
        });
    };

    const isFormOpen = isCreating || editing !== null;

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
            <Head title="Manage Blog" />

            <DashboardLayout title="Manage Blog">
                {flash?.success && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                )}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-500">{posts.length} post(s)</div>
                    {!isFormOpen && (
                        <button
                            type="button"
                            onClick={startCreate}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            New Post
                        </button>
                    )}
                </div>

                {isFormOpen && (
                    <Card className="mb-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {editing ? 'Edit Post' : 'Create Post'}
                            </h3>
                            <button
                                type="button"
                                onClick={cancelForm}
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Title *</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Post title"
                                    />
                                    {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Slug</label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="auto-generated-if-empty"
                                    />
                                    {errors.slug && <p className="text-xs text-red-600">{errors.slug}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Category</label>
                                    <input
                                        type="text"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="e.g. Web System"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Author</label>
                                    <input
                                        type="text"
                                        value={data.author}
                                        onChange={(e) => setData('author', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        placeholder="Author name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Published Date</label>
                                    <input
                                        type="date"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        id="is_published"
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600"
                                    />
                                    <label htmlFor="is_published" className="text-sm font-medium text-slate-700">
                                        Published
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Excerpt</label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="Short summary of the post"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Content *</label>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows={10}
                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="Write your post content here..."
                                />
                                {errors.content && <p className="text-xs text-red-600">{errors.content}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Featured Image</label>
                                <div className="flex items-center gap-3">
                                    {data.image && !data.image_file && (
                                        <img
                                            src={data.image}
                                            alt="Preview"
                                            className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
                                        />
                                    )}
                                    {data.image_file && (
                                        <img
                                            src={URL.createObjectURL(data.image_file)}
                                            alt="Preview"
                                            className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
                                        />
                                    )}
                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                        <ImageIcon className="h-4 w-4" />
                                        {data.image || data.image_file ? 'Change Image' : 'Upload Image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setData('image_file', e.target.files?.[0] || null)}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={cancelForm}
                                    className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    </Card>
                )}

                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.id} className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-36">
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                        <ImageIcon className="h-8 w-8" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    {post.is_published ? (
                                        <Badge color="green">Published</Badge>
                                    ) : (
                                        <Badge color="slate">Draft</Badge>
                                    )}
                                    {post.category && (
                                        <span className="text-xs font-medium text-slate-500">{post.category}</span>
                                    )}
                                </div>
                                <h3 className="mt-1 text-lg font-semibold text-slate-900">{post.title}</h3>
                                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.excerpt || post.content}</p>
                                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                                    {post.author && <span>{post.author}</span>}
                                    {post.published_at && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(post.published_at)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                                    title="View post"
                                >
                                    <Eye className="h-4 w-4" />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => startEdit(post)}
                                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                                    title="Edit post"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => confirmDelete(post)}
                                    className="rounded-lg border border-slate-200 p-2 text-red-600 hover:bg-red-50"
                                    title="Delete post"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </Card>
                    ))}

                    {posts.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                            <p className="text-slate-500">No blog posts yet. Click "New Post" to create one.</p>
                        </div>
                    )}
                </div>

                {showDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-900">Delete post?</h4>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Are you sure you want to delete "{showDelete.title}"? This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDelete(null)}
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={processing}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                                >
                                    {processing ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </>
    );
}
