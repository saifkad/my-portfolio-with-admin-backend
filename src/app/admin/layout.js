'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Code2,
  FolderKanban,
  Newspaper,
  Mail,
  LogOut,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  // Unread message count for the sidebar badge
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/contact');
        if (res.ok) {
          const msgs = await res.json();
          if (Array.isArray(msgs)) setUnread(msgs.filter((m) => !m.read).length);
        }
      } catch {
        // badge is cosmetic — never let it break the panel
      }
    };
    fetchUnread();
  }, [pathname]); // re-check on navigation (reads a message → badge updates)

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to logout');
    }
  };

  const menuItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/dashboard/profile', icon: User, label: 'Profile' },
    { href: '/admin/dashboard/skills', icon: Code2, label: 'Skills' },
    { href: '/admin/dashboard/projects', icon: FolderKanban, label: 'Projects' },
    { href: '/admin/dashboard/blog', icon: Newspaper, label: 'Blog' },
    { href: '/admin/dashboard/messages', icon: Mail, label: 'Messages' },
    { href: '/admin/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <aside className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-400">Admin Panel</h2>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 transition ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 border-l-4 border-blue-400'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.label === 'Messages' && unread > 0 && (
                  <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-gray-700 hover:text-white transition mt-auto"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>

        <p className="px-6 py-4 mt-4 border-t border-gray-700 text-xs text-gray-500">
          Build: {process.env.NEXT_PUBLIC_BUILD_TIME
            ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString()
            : 'unknown'}
        </p>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}