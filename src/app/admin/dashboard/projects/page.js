'use client';

import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

const emptyForm = {
  title: '',
  description: '',
  category: '',
  image: '',
  technologies: '',
  githubUrl: '',
  liveUrl: '',
  order: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await res.json();

      // Supports both:
      // [...] and { projects: [...] }
      const projectList = Array.isArray(data)
        ? data
        : Array.isArray(data.projects)
          ? data.projects
          : [];

      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isModalOpen, closeModal]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (project) => {
    setForm({
      title: project.title || '',
      description: project.description || '',
      category: project.category || '',
      image: project.image || '',
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      order: project.order ?? 0,
    });

    setEditingId(project._id);
    setIsModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: name === 'order' ? Number(value) || 0 : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const technologies = form.technologies
      .split(',')
      .map((technology) => technology.trim())
      .filter(Boolean);

    const isEditing = Boolean(editingId);

    try {
      const res = await fetch(
        isEditing ? `/api/projects/${editingId}` : '/api/projects',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...form,
            technologies,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save project');
      }

      toast.success(isEditing ? 'Project updated!' : 'Project saved');

      closeModal();
      await fetchProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete project');
      }

      toast.success('Project deleted successfully');

      setProjects((previousProjects) =>
        previousProjects.filter((project) => project._id !== id)
      );
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Something went wrong');
    }
  };

  const inputClass =
    'w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>

        <button
          type="button"
          title="Add new project"
          aria-label="Add new project"
          onClick={openAdd}
          className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-white"
        >
          <Plus size={18} aria-hidden="true" />
          Add Project
        </button>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-gray-400">
            No projects found.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700"
            >
              <div className="flex items-center gap-4 min-w-0">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title || 'Project image'}
                    width={60}
                    height={60}
                    unoptimized={project.image.startsWith('http')}
                    className="w-16 h-16 object-cover rounded bg-gray-700"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-16 h-16 rounded bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                  />
                )}

                <div className="min-w-0">
                  <h3 className="font-bold text-white truncate">
                    {project.title}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {project.category}
                  </p>

                  <div className="flex gap-2 mt-1 flex-wrap">
                    {Array.isArray(project.technologies) &&
                      project.technologies.slice(0, 3).map((technology, index) => (
                        <span
                          key={`${technology}-${index}`}
                          className="text-xs bg-gray-700 px-2 py-0.5 rounded text-blue-300"
                        >
                          {technology}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open live project"
                    aria-label="Open live project"
                    className="text-gray-400 hover:text-white p-2 rounded"
                  >
                    <ExternalLink size={18} aria-hidden="true" />
                  </a>
                )}

                <button
                  type="button"
                  title="Edit project"
                  aria-label="Edit project"
                  onClick={() => openEdit(project)}
                  className="text-gray-400 hover:text-blue-400 p-2 rounded transition"
                >
                  <Pencil size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  title="Delete project"
                  aria-label="Delete project"
                  onClick={() => handleDelete(project._id)}
                  className="text-red-400 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <form
            onSubmit={handleSave}
            onClick={(event) => event.stopPropagation()}
            className="bg-gray-800 p-6 rounded-xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto border border-gray-700"
          >
            <h2 className="text-xl font-bold mb-4 text-white">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h2>

            <input
              name="title"
              className={inputClass}
              placeholder="Title"
              required
              value={form.title}
              onChange={handleChange}
            />

            <input
              name="image"
              className={inputClass}
              placeholder="Image URL or /file.jpg"
              value={form.image}
              onChange={handleChange}
            />

            <textarea
              name="description"
              className={inputClass}
              placeholder="Description"
              required
              rows={3}
              value={form.description}
              onChange={handleChange}
            />

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm text-gray-400">
                Category
              </label>

              <select
                id="category"
                name="category"
                className="w-full bg-gray-700 p-3 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Python">Python</option>
                <option value="Design">Design</option>
                <option value="GitHub">GitHub</option>
                <option value="AI/ML">AI/ML</option>
              </select>
            </div>

            <input
              name="technologies"
              className={inputClass}
              placeholder="Technologies, comma separated"
              value={form.technologies}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="githubUrl"
                className={inputClass}
                placeholder="GitHub URL"
                value={form.githubUrl}
                onChange={handleChange}
              />

              <input
                name="liveUrl"
                className={inputClass}
                placeholder="Live URL"
                value={form.liveUrl}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="order" className="text-sm text-gray-400">
                Display Order (lower = first)
              </label>

              <input
                id="order"
                name="order"
                type="number"
                className={`${inputClass} mt-1`}
                value={form.order}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                title="Cancel and close modal"
                aria-label="Cancel and close modal"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                aria-label={editingId ? 'Update project' : 'Save new project'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition"
              >
                {editingId ? 'Update Project' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
