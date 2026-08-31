'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Newspaper, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '', slug: '', excerpt: '', content: '', tags: '', published: false,
};

const slugify = (s) =>
  s.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadPosts = () => {
    fetch('/api/posts')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPosts(Array.isArray(data) ? data : []));
  };

  useEffect(() => { loadPosts(); }, []);

  // Escape closes the modal
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen]);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setIsModalOpen(true); };
  const openEdit = (p) => {
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      excerpt: p.excerpt || '',
      content: p.content || '',
      tags: (p.tags || []).join(', '),
      published: Boolean(p.published),
    });
    setEditingId(p._id);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setForm(emptyForm); };

  const handleTitleChange = (value) => {
    // Auto-generate the slug from the title while creating (never while editing)
    setForm((f) => ({
      ...f,
      title: value,
      slug: editingId ? f.slug : slugify(value),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    const isEditing = Boolean(editingId);
    try {
      const res = await fetch(isEditing ? `/api/posts/${editingId}` : '/api/posts', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(isEditing ? 'Post updated!' : form.published ? 'Post published!' : 'Draft saved');
        closeModal();
        loadPosts();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Failed to save post');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Post deleted');
        setPosts(posts.filter((p) => p._id !== id));
      } else {
        toast.error('Failed to delete post');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const inputCls = 'w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Newspaper size={24} /> Blog</h1>
        <button onClick={openAdd} className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-white">
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="grid gap-4">
        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-800 rounded-xl">
            No posts yet. Your first one is a weekend away.
          </div>
        )}
        {posts.map((p) => (
          <div key={p._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-white truncate">{p.title}</h3>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    p.published ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'
                  }`}
                >
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                /blog/{p.slug} · updated {new Date(p.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              {p.published && (
                <a
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                  title="View live post"
                >
                  <ExternalLink size={18} />
                </a>
              )}
              <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-blue-400 p-2 rounded transition" title="Edit" aria-label="Edit post">
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-400 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded"
                title="Delete Post"
                aria-label="Delete post"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4" onClick={closeModal}>
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-4 text-white">{editingId ? 'Edit Post' : 'New Post'}</h2>

            <input className={inputCls} placeholder="Title" required
              value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />

            <div>
              <label className="text-sm text-gray-400">Slug (URL) — auto-generated from the title</label>
              <input className={`${inputCls} mt-1`} required
                value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
              <p className="text-xs text-gray-500 mt-1">Will live at: /blog/{form.slug || 'your-slug'}</p>
            </div>

            <div>
              <label className="text-sm text-gray-400">Excerpt (shown on the blog list &amp; Google)</label>
              <textarea className={`${inputCls} mt-1`} rows={2}
                placeholder="One or two sentences summarizing the post"
                value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>

            <div>
              <label className="text-sm text-gray-400">Content — Markdown (## headings, **bold**, ```code```)</label>
              <textarea className={`${inputCls} mt-1 font-mono text-sm`} rows={14} required
                placeholder={'Write your post in Markdown…'}
                value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>

            <input className={inputCls} placeholder="Tags (comma separated): debugging, nextjs, auth"
              value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />

            <label className="flex items-center gap-3 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-5 h-5 accent-blue-600"
              />
              <span>Published <span className="text-gray-500 text-sm">(uncheck to keep as draft — hidden from the public blog)</span></span>
            </label>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition">
                {editingId ? 'Update Post' : form.published ? 'Publish' : 'Save Draft'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}