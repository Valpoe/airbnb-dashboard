'use client';

import { useSession } from 'next-auth/react';
import Navbar from './navbar';

export default function Nav() {
  const { data: session } = useSession();
  return session?.user ? <Navbar user={session?.user} /> : null;
}
