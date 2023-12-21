import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import NavBar from './navbar';
import Toast from './toast';
import { Suspense } from 'react';
// import AuthProvider from './context/authProvider';
import { getServerSession } from 'next-auth/next';
import Logout from './logout';
import Link from 'next/link';

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
  const session = await getServerSession();
  console.log("Session user: ", session?.user);
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        {/* <AuthProvider> */}
        <Suspense>
          <NavBar user={session?.user} />
          <nav>
          {!!session && <Logout />}
          {!session && <Link href="/login">Login</Link>}
        </nav>
        </Suspense>
        {children}
        <Analytics />
        <SpeedInsights />
        <Toast />
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
