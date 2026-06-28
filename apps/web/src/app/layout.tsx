import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Chessome',
  description: 'Open-source chess analysis platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
