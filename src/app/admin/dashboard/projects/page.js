'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: '', 
    image: '', 
    technologies: '', 
    githubUrl: '', 
    liveUrl: '' 
  });

  // Fetch projects on load
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const techArray = form.technologies.split(',').map(t => t.trim());
    
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, technologies: techArray })
    });

    if (res.ok) {
      toast.success('Project saved');
      setIsModalOpen(false);
      fetchProjects(); // Refresh list
    }
  };

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleDelete = async (id) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Project deleted successfully');
        // Remove the item from state immediately so UI updates without refresh
        setProjects(projects.filter((p) => p._id !== id));
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };
  // ------------------------------------

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-white"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p._id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700">
            <div className="flex items-center gap-4">
              <img 
                src={p.image || 'https://via.placeholder.com/150'} 
                alt="" 
                className="w-16 h-16 object-cover rounded bg-gray-700" 
              />
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
                 <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                   <ExternalLink size={18} />
                 </a>
               )}
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <form onSubmit={handleSave} className="bg-gray-800 p-6 rounded-xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">Add New Project</h2>
            
            <input 
              className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none" 
              placeholder="Title" 
              required 
              onChange={e => setForm({...form, title: e.target.value})} 
            />
            
            <input 
              className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none" 
              placeholder="Image URL" 
              required 
              onChange={e => setForm({...form, image: e.target.value})} 
            />
            
            <textarea 
              className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none" 
              placeholder="Description" 
              required 
              onChange={e => setForm({...form, description: e.target.value})} 
            />
            
            <input 
              className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none" 
              placeholder="Category (e.g. Web, Mobile)" 
              required 
              onChange={e => setForm({...form, category: e.target.value})} 
            />
            
            <input 
              className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none" 
              placeholder="Technologies (comma separated)" 
              onChange={e => setForm({...form, technologies: e.target.value})} 
            />
            
            <div className="grid grid-cols-2 gap-4">
               <input 
                 className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none" 
                 placeholder="GitHub URL" 
                 onChange={e => setForm({...form, githubUrl: e.target.value})} 
               />
               <input 
                 className="w-full bg-gray-700 p-3 rounded text-white border border-gray-600 focus:border-blue-500 outline-none" 
                 placeholder="Live URL" 
                 onChange={e => setForm({...form, liveUrl: e.target.value})} 
               />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}