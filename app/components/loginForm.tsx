'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { TextInput, Button } from '@tremor/react'
export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false,
    });

    console.log({ response });
    if (!response?.error) {
      router.push('/');
      router.refresh();
    }
  };
  return (  
    <form
      onSubmit={handleSubmit}
      className="space-y-4 md:space-y-6"
    >
      <TextInput
        name="username"
        type="text"
        placeholder='Username'
        required
      />
      <TextInput
        name="password"
        type="password"
        placeholder='Password'
        required
      />
      <Button type="submit" variant="secondary" className="w-full">Login</Button>
    </form>
  );
}