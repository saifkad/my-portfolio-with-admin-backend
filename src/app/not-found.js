import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 text-center">
      <div className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-6">&lt;SaifDev /&gt;</div>
      <h1 className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        404
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mt-6">This page couldn&apos;t be found.</p>
      <p className="text-gray-500 dark:text-gray-500 mt-2">
        It either moved, never existed, or something crashed on my watch.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Link
          href="/"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-transform"
        >
          Back to the homepage
        </Link>
        <Link
          href="/#projects"
          className="px-8 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-full font-semibold hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          Skip to my projects
        </Link>
      </div>
    </div>
  );
}