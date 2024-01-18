import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Nav from 'app/nav';
import { Metadata } from 'next';
import { Suspense } from 'react';
import AuthProvider from './context/authProvider';

// import { Inter } from 'next/font/google';
// test
// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { template: '%s | Data Dashboard', default: 'Data Dashboard' },
  description: 'Built with Next.js, PostgreSQL, Vercel',
  icons: {
    icon: '/favicon.ico'
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      {/* <body className={`${inter.className} h-full`}> */}
      <body className="h-full">
        <AuthProvider>
          <Suspense>
            <Nav />
          </Suspense>
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
