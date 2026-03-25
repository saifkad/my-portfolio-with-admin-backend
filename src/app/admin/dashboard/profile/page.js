'use client';
import { useState, useEffect } from 'react';
import { Save, User, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '', 
    title: '', 
    email: '', 
    bio: '', 
    profileImage: '', // Added
    backgroundImage: '', // Added
    socialLinks: { github: '', linkedin: '', twitter: '' }
  });
  const [loading, setLoading] = useState(false);

  // Load existing data on page load
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        // Ensure socialLinks exists to avoid errors
        setFormData({
          ...data,
          socialLinks: data.socialLinks || { github: '', linkedin: '', twitter: '' }
        });
      });
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
      console.error('Error updating profile:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <User size={24} /> Edit Profile
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl space-y-4">
          
          {/* Basic Info */}
          <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2">Basic Info</h2>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              placeholder="Your Name" 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Job Title</label>
            <input 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              placeholder="e.g. Full Stack Developer" 
              value={formData.title || ''} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              rows="4" 
              placeholder="Short description about yourself" 
              value={formData.bio || ''} 
              onChange={e => setFormData({...formData, bio: e.target.value})} 
            />
          </div>

          {/* Images Section */}
          <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mt-4">Images</h2>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
              <ImageIcon size={16} /> Profile Image URL
            </label>
            <input 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              placeholder="/my-photo.jpg or https://..." 
              value={formData.profileImage || ''} 
              onChange={e => setFormData({...formData, profileImage: e.target.value})} 
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Put image in &apos;public&apos; folder and use &apos;/filename.jpg&apos;
            </p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
              <ImageIcon size={16} /> About Me (Background) Image URL
            </label>
            <input 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              placeholder="/workspace.jpg or https://..." 
              value={formData.backgroundImage || ''} 
              onChange={e => setFormData({...formData, backgroundImage: e.target.value})} 
            />
          </div>

          {/* Social Links */}
          <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mt-4">Social Links</h2>
          
          <div className="space-y-3">
            <input 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              placeholder="GitHub URL" 
              value={formData.socialLinks?.github || ''} 
              onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, github: e.target.value}})} 
            />
            <input 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              placeholder="LinkedIn URL" 
              value={formData.socialLinks?.linkedin || ''} 
              onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})} 
            />
            <input 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" 
              placeholder="Twitter URL" 
              value={formData.socialLinks?.twitter || ''} 
              onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, twitter: e.target.value}})} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex justify-center items-center gap-2 transition mt-4"
          >
            <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Right Column: Live Preview */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Profile Preview</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                {formData.profileImage ? (
                  <Image 
                    src={formData.profileImage} 
                    alt="Profile Preview" 
                    width={128}
                    height={128}
                    className="w-full h-full rounded-full object-cover border-4 border-blue-500" 
                    onError={(e) => { e.target.style.display='none'; }} // Hide broken images
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-gray-500 border-4 border-gray-600">No Image</div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{formData.name || 'Your Name'}</h2>
              <p className="text-blue-400">{formData.title || 'Your Title'}</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">About Section Preview</h3>
            <div className="w-full h-48 rounded-lg overflow-hidden relative bg-gray-700">
              {formData.backgroundImage ? (
                <Image 
                  src={formData.backgroundImage} 
                  width={600}
                  height={400}
                  alt="Background Preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.style.display='none'; }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No Background Image</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}