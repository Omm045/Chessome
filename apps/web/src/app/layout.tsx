import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '../providers/QueryProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import { AuthProvider } from '../components/auth/AuthProvider';
import { AppLayout } from '../components/layout/AppLayout';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { OfflineBanner } from '../components/layout/OfflineBanner';
import { PostHogProvider } from '../providers/PostHogProvider';

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
        <PostHogProvider>
          <OfflineBanner />
          <ErrorBoundary>
            <QueryProvider>
            <AuthProvider>
              <ThemeProvider>
                <AppLayout>
                  {children}
                </AppLayout>
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
        </PostHogProvider>
      </body>
    </html>
  );
}
