import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 py-12 text-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold text-blue-400 mb-2">DevPortfolio</h3>
            <p className="text-gray-400">Building amazing web experiences</p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <Github size={24} />
            </a>
            <a
              href="/admin/dashboard"
              className="text-gray-400 hover:text-blue-400 transition text-sm"
            >
              Admin
            </a>
          </div>
        </div>

        {/* Optional: Made the divider softer to blend better */}
        <div className="border-t border-gray-800/50 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DevPortfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}