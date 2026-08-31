import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white py-12 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-6 text-center md:mb-0 md:text-left">
            <h3 className="mb-2 text-2xl font-bold text-primary-600 dark:text-primary-400">
              Saif DevPortfolio
            </h3>

            <p className="text-gray-500 dark:text-gray-400">
              Building amazing web experiences
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/saif-al-dir"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              title="My GitHub"
              className="text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Github size={24} />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200/70 pt-8 text-center text-gray-500 dark:border-gray-800/70 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Saif DevPortfolio. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
