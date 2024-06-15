'use client';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { SignInOptions, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import LoginButton from './login-button';
import styles from './styles.module.scss';

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
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <input
        className={cn('input', 'input-bordered', styles.inputField)}
        name="username"
        type="text"
        placeholder="Enter username"
        required
        maxLength={20}
      />
      <input
        className={cn('input', 'input-bordered', styles.inputField)}
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
          <ExclamationCircleIcon className={styles.icon} />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
