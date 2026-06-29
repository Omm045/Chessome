import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '../providers/QueryProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AppLayout } from '../components/layout/AppLayout';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Chessome | Premium Analysis',
  description: 'The world\'s most powerful open-source chess analysis platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`}>
        <QueryProvider>
          <ThemeProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
