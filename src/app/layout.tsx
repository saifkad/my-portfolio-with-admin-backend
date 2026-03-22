import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ThemeProviders } from '@/components/ThemeProviders'; // Import

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Developer Portfolio',
  description: 'Professional developer portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProviders>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProviders>
      </body>
    </html>
  );
}