// app/admin/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
import { Users, Code2, FolderKanban, Mail, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    messages: 0,
    unreadMessages: 0
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
        fetch('/api/contact')
      ]);

      const skills = await skillsRes.json();
      const projects = await projectsRes.json();
      const messages = await messagesRes.json();

      setStats({
        skills: skills.length,
        projects: projects.length,
        messages: messages.length,
        unreadMessages: messages.filter(m => !m.read).length
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
        {statCards.map((card, index) => {
          const Icon = card.icon;
          // Note: Tailwind classes like text-blue-400 work dynamically or need full safelist
          return (
            <div key={index} className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${card.color}-500/20 rounded-lg`}>
                  <Icon className={`text-${card.color}-400`} size={24} />
                </div>
                <span className="text-3xl font-bold">{card.value}</span>
              </div>
              <h3 className="text-gray-400">{card.title}</h3>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="/admin/dashboard/projects" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left cursor-pointer block">
            <h3 className="font-semibold mb-1">Manage Projects</h3>
            <p className="text-sm text-gray-400">Add or edit portfolio items</p>
          </a>
          <a href="/admin/dashboard/profile" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left cursor-pointer block">
            <h3 className="font-semibold mb-1">Update Profile</h3>
            <p className="text-sm text-gray-400">Change bio and social links</p>
          </a>
          <a href="/admin/dashboard/messages" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left cursor-pointer block">
            <h3 className="font-semibold mb-1">View Messages</h3>
            <p className="text-sm text-gray-400">{stats.unreadMessages} unread messages</p>
          </a>
        </div>
      </div>
    </div>
  );
}