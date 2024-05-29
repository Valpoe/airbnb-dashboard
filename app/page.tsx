import LoginForm from '@/app/ui/login-form';
import Image from 'next/image';
import loginBackground from '@/public/login-background.png';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './lib/auth';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) redirect('/monthly-report');

  return (
    <main className="flex items-center justify-center h-screen">
      <Image
        src={loginBackground}
        alt="Login Background"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <div className="card w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center text-center">
          <h4 className="mb-5 mt-1 pb-1 text-xl font-semibold">
            Sign in to your account
          </h4>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
