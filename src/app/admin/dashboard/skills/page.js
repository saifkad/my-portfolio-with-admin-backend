'use client';

import { useCallback, useEffect, useState } from 'react';
import { Code2, Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = {
  category: 'frontend',
  name: '',
  proficiency: 50,
  order: 0,
};

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to load skills');
      }

      const data = await res.json();

      // Supports both [...] and { skills: [...] }
      const skillList = Array.isArray(data)
        ? data
        : Array.isArray(data.skills)
          ? data.skills
          : [];

      setSkills(skillList);
    } catch (error) {
      console.error('Failed to load skills:', error);
      toast.error('Failed to load skills');
      setSkills([]);
    }
  }, []);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

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

  const openEdit = (skill) => {
    setForm({
      category: skill.category || 'frontend',
      name: skill.name || '',
      proficiency: skill.proficiency ?? 50,
      order: skill.order ?? 0,
    });

    setEditingId(skill._id);
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const isEditing = Boolean(editingId);

    try {
      const res = await fetch(
        isEditing ? `/api/skills/${editingId}` : '/api/skills',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save skill');
      }

      toast.success(isEditing ? 'Skill updated!' : 'Skill added!');

      closeModal();
      await loadSkills();
    } catch (error) {
      console.error('Failed to save skill:', error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete skill');
      }

      toast.success('Skill deleted!');

      setSkills((previousSkills) =>
        previousSkills.filter((skill) => skill._id !== id)
      );
    } catch (error) {
      console.error('Failed to delete skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code2 size={24} aria-hidden="true" />
          Skills
        </h1>

        <button
          type="button"
          title="Add new skill"
          aria-label="Add new skill"
          onClick={openAdd}
          className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} aria-hidden="true" />
          Add Skill
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-gray-400">
            No skills found.
          </div>
        ) : (
          skills.map((skill) => (
            <div
              key={skill._id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">
                  {skill.category}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    title="Edit skill"
                    aria-label="Edit skill"
                    onClick={() => openEdit(skill)}
                    className="text-gray-500 hover:text-blue-400 p-1 rounded"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    title="Delete skill"
                    aria-label="Delete skill"
                    onClick={() => handleDelete(skill._id)}
                    className="text-gray-500 hover:text-red-400 p-1 rounded"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg">{skill.name}</h3>

              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${skill.proficiency}%`,
                  }}
                />
              </div>

              <p className="text-right text-xs text-gray-400 mt-1">
                {skill.proficiency}%
              </p>
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
            className="bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h2>

            <div>
              <label
                htmlFor="skill-category"
                className="text-sm text-gray-400"
              >
                Category
              </label>

              <select
                id="skill-category"
                name="category"
                className="w-full bg-gray-700 p-3 rounded text-white mt-1"
                value={form.category}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category: event.target.value,
                  })
                }
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="tools">Tools</option>
              </select>
            </div>

            <div>
              <label htmlFor="skill-name" className="sr-only">
                Skill name
              </label>

              <input
                id="skill-name"
                name="name"
                className="w-full bg-gray-700 p-3 rounded text-white"
                placeholder="Skill Name (e.g. React)"
                required
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                  })
                }
              />
            </div>

            <div>
              <label
                htmlFor="skill-proficiency"
                className="text-sm text-gray-400"
              >
                Proficiency: {form.proficiency}%
              </label>

              <input
                id="skill-proficiency"
                name="proficiency"
                type="range"
                min="0"
                max="100"
                className="w-full mt-2"
                value={form.proficiency}
                onChange={(event) =>
                  setForm({
                    ...form,
                    proficiency: Number(event.target.value),
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="skill-order" className="sr-only">
                Display order
              </label>

              <input
                id="skill-order"
                name="order"
                type="number"
                className="w-full bg-gray-700 p-3 rounded text-white"
                placeholder="Order (Number)"
                value={form.order}
                onChange={(event) =>
                  setForm({
                    ...form,
                    order: Number(event.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                title="Cancel and close modal"
                aria-label="Cancel and close modal"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                aria-label={editingId ? 'Update skill' : 'Save new skill'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
