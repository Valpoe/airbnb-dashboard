import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Nav from './nav';
import { Suspense } from 'react';
import AuthProvider from './context/authProvider';
// import { Nunito } from 'next/font/google';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] })

// const nunito = Nunito({
//   subsets: ['latin'],
//   variable: '--font-nunito-sans',
// })

export const metadata = {
  title: 'Airbnb dashboard',
  description:
    'Data visualization',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-200">
      <body className={`${inter.className} h-full`}>
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
