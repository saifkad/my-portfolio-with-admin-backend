declare const require: (path: string) => unknown;

require('./globals.css');
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ThemeProviders } from '@/components/ThemeProviders'; // Import

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Saif Dev Portfolio',
  description: 'Professional developer portfolio',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
          aria-label="Skip to content"
        >
          Skip to content
        </a>
        <ThemeProviders>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProviders>
      </body>
    </html>
  );
}