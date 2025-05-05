import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setAuthed } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setAuthed(true);
      document.dispatchEvent(new Event('authChange')); // notify layout
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded shadow space-y-4">
      <div className="flex justify-center">
        <Image
          src="/acd_logo.svg"
          height={200}
          width={350}
          alt="Alder Creek Digital Logo"
        />
      </div>
      <h1 className="text-xl font-semibold text-center">Admin Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
}
