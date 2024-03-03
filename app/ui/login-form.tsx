'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { SignInOptions, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const username = formData.get('username') as string;
      const password = formData.get('password') as string;

      if (!/^[a-z0-9]{1,20}$/.test(username || '')) {
        setError('Invalid username');
        setLoading(false);
        return;
      }

      if (!/^[a-zA-Z0-9]{1,50}$/.test(password || '')) {
        setError('Invalid password');
        setLoading(false);
        return;
      }

      const signInOptions: SignInOptions = {
        username,
        password,
        redirect: false
      };

      const response = await signIn('credentials', signInOptions);

      if (!response?.error) {
        router.push('/');
        router.refresh();
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.log({ error });
      setError('An error occured. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <input
        className="input input-bordered w-full max-w-xs"
        name="username"
        type="text"
        placeholder="Enter username"
        required
        maxLength={20}
      />
      <input
        className="input input-bordered w-full max-w-xs"
        name="password"
        type="password"
        placeholder="Enter password"
        required
        maxLength={20}
        minLength={6}
      />
      <LoginButton loading={loading} />
      {error && (
        <div role="alert" className="alert alert-error">
          <ExclamationCircleIcon className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}

function LoginButton({ loading }: { loading: boolean }) {
  return (
    <button className="btn btn-primary" type="submit" disabled={loading}>
      {loading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <div className="flex items-center">
          <span>
            SIGN IN{' '}
            <span className="text-lg" aria-hidden="true">
              &rarr;
            </span>
          </span>
        </div>
      )}
    </button>
  );
}
