import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Nav from 'app/nav';
import { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import { Suspense } from 'react';
import AuthProvider from './context/auth-provider';

const nunitoSans = Nunito_Sans({ subsets: ['latin'] });

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
      <body className={`${nunitoSans.className} h-full`}>
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
