import LoginForm from './components/loginForm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect('/monthly-report');

  return (
    <main className="p-4 md:p-10 flex items-center">
      <div className="card w-96 bg-neutral text-neutral-content">
        <div className="card-body items-center text-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
