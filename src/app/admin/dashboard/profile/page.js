'use client';
import { useState, useEffect } from 'react';
import { Save, User, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
// import Image from 'next/image';

export default function ProfilePage() {
  // Initialize state with all fields, including profileImage
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    bio: '',
    profileImage: '/default-avatar.png', // Default fallback
    backgroundImage: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    }
  });
  const [loading, setLoading] = useState(false);

  // Fetch existing data on load
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        // Ensure socialLinks exists if it's missing from DB
        setFormData({
          ...data,
          socialLinks: data.socialLinks || { github: '', linkedin: '', twitter: '' }
        });
      })
      .catch(err => console.error("Failed to load user", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <User size={24} className="text-blue-400" /> Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl space-y-6 border border-gray-700 shadow-xl">
        
        {/* --- IMAGE SECTION --- */}
        <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Profile Images</h3>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Photo Preview */}
            {/* <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30 relative group">
                <Image 
                  src={formData.profileImage || '/default-avatar.png'} 
                  alt="Profile Preview"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-400">Profile Picture</span>
            </div> */}

            {/* Inputs for Images */}
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Profile Photo URL</label>
                <div className="relative">
                  <Upload size={18} className="absolute left-3 top-3 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="e.g. /my-photo.jpg" 
                    value={formData.profileImage || ''}
                    onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Put your image in the <code className="bg-gray-700 px-1 rounded">public</code> folder, then type the filename here (e.g., <code className="text-blue-400">/my-photo.jpg</code>).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Background Image URL</label>
                <input 
                  type="text" 
                  placeholder="e.g. /background.jpg" 
                  value={formData.backgroundImage || ''}
                  onChange={(e) => setFormData({...formData, backgroundImage: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- BASIC INFO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input 
              className="input-field" 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
            <input 
              className="input-field" 
              value={formData.title || ''} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
          <textarea 
            className="input-field" 
            rows="4" 
            value={formData.bio || ''} 
            onChange={e => setFormData({...formData, bio: e.target.value})} 
          />
        </div>
        
        {/* --- SOCIAL LINKS --- */}
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Social Links</h3>
          <div className="space-y-3">
            <input 
              className="input-field" 
              placeholder="GitHub URL" 
              value={formData.socialLinks?.github || ''} 
              onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, github: e.target.value}})} 
            />
            <input 
              className="input-field" 
              placeholder="LinkedIn URL" 
              value={formData.socialLinks?.linkedin || ''} 
              onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})} 
            />
            <input 
              className="input-field" 
              placeholder="Twitter/X URL" 
              value={formData.socialLinks?.twitter || ''} 
              onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, twitter: e.target.value}})} 
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex justify-center items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
        >
          <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}