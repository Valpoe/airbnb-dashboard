'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { useState } from 'react';


export default function Form() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
    const formData = new FormData(e.currentTarget);
    const response = await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false,
    });

    if (!response?.error) {
      router.push('/');
      router.refresh();
    }
    else {
      setError("Invalid credentials");
    }
  } catch (error) {
    console.log({ error });
    setError("An error occured. Please try again.");
  } finally {
    setLoading(false);
  }

  };
  return (  
    <form
      onSubmit={handleSubmit}
      className="space-y-4 md:space-y-6"
    >
      <input
        className="input input-bordered w-full max-w-xs"
        name="username"
        type="text"
        placeholder='Username'
        required
      />
      <input
        className="input input-bordered w-full max-w-xs"
        name="password"
        type="password"
        placeholder='Password'
        required
      />
      <button className="btn btn-primary" type="submit" disabled={loading}>
      {loading ? <span className="loading loading-spinner"></span> : 'SIGN IN'}
        </button>
        {error && (
        <div role="alert" className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
      )}
    </form>
  );
}