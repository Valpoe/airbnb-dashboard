import LoginForm from '@/app/ui/login-form';
import bg from '@/public/login-background.png';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) redirect('/monthly-report');

  return (
    <main
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100vh'
      }}
      className="flex items-center justify-center"
    >
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
