import '@/app/ui/globals.css';

import AuthProvider from '@/app/context/auth-provider';
import Nav from '@/app/nav';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import { Suspense } from 'react';

const nunitoSans = Nunito_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { template: '%s | Data Dashboard', default: 'Data Dashboard' },
  description: 'Built with Next.js',
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
      <body className={`${nunitoSans.className} antialiased h-full`}>
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
