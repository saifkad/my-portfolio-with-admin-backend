'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ category: 'frontend', name: '', proficiency: 50, order: 0 });

  useEffect(() => {
    fetch('/api/skills').then(res => res.json()).then(setSkills);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      toast.success('Skill added!');
      setIsModalOpen(false);
      fetch('/api/skills').then(res => res.json()).then(setSkills);
      setForm({ category: 'frontend', name: '', proficiency: 50, order: 0 }); // Reset
    }
  };

  const handleDelete = async (id) => {
    // Note: You would need a DELETE /api/skills/[id] route for this to work fully
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Skill deleted!');
        setSkills(skills.filter(s => s._id !== id)); // Optimistic UI update
      }
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error('Failed to delete skill');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Code2 size={24} /> Skills</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> Add Skill
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <div key={s._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">{s.category}</span>
              <button onClick={() => handleDelete(s._id)} className="text-gray-500 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
            <h3 className="font-bold text-lg">{s.name}</h3>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${s.proficiency}%` }}></div>
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{s.proficiency}%</p>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <form onSubmit={handleSave} className="bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Add New Skill</h2>
            
            <select className="w-full bg-gray-700 p-3 rounded text-white" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="tools">Tools</option>
            </select>

            <input className="w-full bg-gray-700 p-3 rounded text-white" placeholder="Skill Name (e.g. React)" required onChange={e => setForm({...form, name: e.target.value})} />
            
            <div>
              <label className="text-sm text-gray-400">Proficiency: {form.proficiency}%</label>
              <input type="range" min="0" max="100" className="w-full mt-2" value={form.proficiency} onChange={e => setForm({...form, proficiency: parseInt(e.target.value)})} />
            </div>

            <input type="number" className="w-full bg-gray-700 p-3 rounded text-white" placeholder="Order (Number)" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} />

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}