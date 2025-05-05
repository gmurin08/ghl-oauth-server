import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow space-y-4">
      <div className="flex justify-center">
        <Image src="/acd_logo.svg" height={200} width={350} alt="Logo" />
      </div>
      <h1 className="text-xl font-semibold">Create an Account</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
