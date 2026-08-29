'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, ExternalLink, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

const emptyForm = {
  title: '', description: '', category: '', image: '',
  technologies: '', githubUrl: '', liveUrl: '', order: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [syncing, setSyncing] = useState(false);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = res.ok ? await res.json() : [];
    setProjects(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setIsModalOpen(true); };
  const openEdit = (p) => {
    setForm({
      title: p.title || '', description: p.description || '', category: p.category || '',
      image: p.image || '', technologies: (p.technologies || []).join(', '),
      githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '', order: p.order ?? 0,
    });
    setEditingId(p._id);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setForm(emptyForm); };

  const handleSave = async (e) => {
    e.preventDefault();
    const techArray = form.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    const isEditing = Boolean(editingId);
    try {
      const res = await fetch(isEditing ? `/api/projects/${editingId}` : '/api/projects', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, technologies: techArray }),
      });
      if (res.ok) {
        toast.success(isEditing ? 'Project updated!' : 'Project saved');
        closeModal();
        fetchProjects();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Failed to save project');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Project deleted successfully');
        setProjects(projects.filter((p) => p._id !== id));
      } else {
        toast.error('Failed to delete project');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/github/sync', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(`Synced! ${data.added} added, ${data.updated} updated`);
        fetchProjects();
      } else {
        toast.error(data.error || 'Sync failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSyncing(false);
    }
  };

  const inputCls = 'w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 text-white transition disabled:opacity-50"
            title="Import your 6 most recently pushed GitHub repos"
          >
            <Github size={18} /> {syncing ? 'Syncing...' : 'Sync from GitHub'}
          </button>
          <button
            onClick={openAdd}
            className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-white"
          >
            <Plus size={18} /> Add Project
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
            <div className="flex items-center gap-4">
              {p.image ? (
                <Image
                  src={p.image} alt="" width={60} height={60}
                  unoptimized={p.image.startsWith('http')}
                  className="w-16 h-16 object-cover rounded bg-gray-700"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
              )}
              <div>
                <h3 className="font-bold text-white">{p.title}</h3>
                <p className="text-sm text-gray-400">{p.category}</p>
                <div className="flex gap-2 mt-1">
                  {p.technologies?.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs bg-gray-700 px-2 py-0.5 rounded text-blue-300">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <ExternalLink size={18} />
                </a>
              )}
              <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-blue-400 p-2 rounded transition" title="Edit">
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-400 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded"
                title="Delete Project"
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
            className="bg-gray-800 p-6 rounded-xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-4 text-white">{editingId ? 'Edit Project' : 'Add New Project'}</h2>

            <input className={inputCls} placeholder="Title" required
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

            <input className={inputCls} placeholder="Image URL (or /file.jpg from public folder)"
              value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />

            <textarea className={inputCls} placeholder="Description" required rows={3}
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Category</label>
              <select
                className="w-full bg-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Python">Python</option>
                <option value="Design">Design</option>
                <option value="GitHub">GitHub</option>
              </select>
            </div>

            <input className={inputCls} placeholder="Technologies (comma separated)"
              value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />

            <div className="grid grid-cols-2 gap-4">
              <input className={inputCls} placeholder="GitHub URL"
                value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
              <input className={inputCls} placeholder="Live URL"
                value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
            </div>

            <div>
              <label className="text-sm text-gray-400">Display Order (lower = first)</label>
              <input type="number" className={`${inputCls} mt-1`}
                value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={closeModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition">
                {editingId ? 'Update Project' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}