'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Code2, FolderKanban, Mail, TrendingUp, Users } from 'lucide-react';
import Sparkline from '@/components/admin/Sparkline';

// Static map — dynamic `bg-${color}-500/20` classes don't work with Tailwind
const colorClasses = {
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-green-500/20 text-green-400',
  purple: 'bg-purple-500/20 text-purple-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  pink: 'bg-pink-500/20 text-pink-400',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    skills: 0, projects: 0, messages: 0, unreadMessages: 0, visitsWeek: 0, visitsTotal: 0,
  });
  const [visitsDaily, setVisitsDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [skillsRes, projectsRes, messagesRes, visitsRes] = await Promise.all([
        fetch('/api/skills'),
        fetch('/api/projects'),
        fetch('/api/contact'),
        fetch('/api/visits'),
      ]);

      if ([skillsRes, projectsRes, messagesRes, visitsRes].some((r) => r.status === 401)) {
        window.location.href = '/'; // session expired
        return;
      }

      const skills = skillsRes.ok ? await skillsRes.json() : [];
      const projects = projectsRes.ok ? await projectsRes.json() : [];
      const messages = messagesRes.ok ? await messagesRes.json() : [];
      const visits = visitsRes.ok ? await visitsRes.json() : {};

      setStats({
        skills: Array.isArray(skills) ? skills.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        unreadMessages: Array.isArray(messages) ? messages.filter((m) => !m.read).length : 0,
        visitsWeek: visits.weekCount || 0,
        visitsTotal: visits.total || 0,
      });
      setVisitsDaily(Array.isArray(visits.daily) ? visits.daily : []);
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
    { title: 'Visitors (7d)', value: stats.visitsWeek, icon: Users, color: 'pink' },
  ];

  if (loading) return <div className="p-8">Loading stats...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

      {/* Traffic */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Traffic — last 30 days</h2>
          <span className="text-sm text-gray-400">{stats.visitsTotal} all-time pageviews · no cookies used</span>
        </div>
        {visitsDaily.length > 0 ? (
          <Sparkline daily={visitsDaily} />
        ) : (
          <p className="text-gray-500 text-sm">No traffic data yet — it appears as soon as someone visits your site.</p>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/admin/dashboard/projects" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left block">
            <h3 className="font-semibold mb-1">Manage Projects</h3>
            <p className="text-sm text-gray-400">Add, edit, or sync from GitHub</p>
          </Link>
          <Link href="/admin/dashboard/profile" className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-left block">
            <h3 className="font-semibold mb-1">Update Profile</h3>
            <p className="text-sm text-gray-400">Change hero intro, bio and social links</p>
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