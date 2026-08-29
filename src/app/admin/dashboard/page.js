'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Code2, FolderKanban, Mail, TrendingUp } from 'lucide-react';

// Static map — dynamic `bg-${color}-500/20` classes don't work with Tailwind
const colorClasses = {
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-green-500/20 text-green-400',
  purple: 'bg-purple-500/20 text-purple-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [skillsRes, projectsRes, messagesRes] = await Promise.all([
        fetch('/api/skills'),
        fetch('/api/projects'),
        fetch('/api/contact'),
      ]);

      if (skillsRes.status === 401 || projectsRes.status === 401 || messagesRes.status === 401) {
        window.location.href = '/'; // session expired
        return;
      }

      const skills = skillsRes.ok ? await skillsRes.json() : [];
      const projects = projectsRes.ok ? await projectsRes.json() : [];
      const messages = messagesRes.ok ? await messagesRes.json() : [];

      setStats({
        skills: Array.isArray(skills) ? skills.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        unreadMessages: Array.isArray(messages) ? messages.filter((m) => !m.read).length : 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Skills', value: stats.skills, icon: Code2, color: 'blue' },
    { title: 'Projects', value: stats.projects, icon: FolderKanban, color: 'green' },
    { title: 'Messages', value: stats.messages, icon: Mail, color: 'purple' },
    { title: 'Unread', value: stats.unreadMessages, icon: TrendingUp, color: 'yellow' },
  ];

  if (loading) return <div className="p-8">Loading stats...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                  <Icon size={24} />
                </div>
                <span className="text-3xl font-bold">{card.value}</span>
              </div>
              <h3 className="text-gray-400">{card.title}</h3>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/admin/dashboard/projects" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left block">
            <h3 className="font-semibold mb-1">Manage Projects</h3>
            <p className="text-sm text-gray-400">Add or edit portfolio items</p>
          </Link>
          <Link href="/admin/dashboard/profile" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left block">
            <h3 className="font-semibold mb-1">Update Profile</h3>
            <p className="text-sm text-gray-400">Change bio and social links</p>
          </Link>
          <Link href="/admin/dashboard/messages" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left block">
            <h3 className="font-semibold mb-1">View Messages</h3>
            <p className="text-sm text-gray-400">{stats.unreadMessages} unread messages</p>
          </Link>
        </div>
      </div>
    </div>
  );
}