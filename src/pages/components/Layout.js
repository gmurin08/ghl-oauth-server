import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/AuthContext';
import { Cog } from 'lucide-react';
import { useState,useEffect } from 'react';

export default function Layout({ children }) {
  const { authed, setAuthed } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tokenExists = document.cookie.includes('token=');
    if (tokenExists && !authed) {
      document.dispatchEvent(new Event('authChange'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    setAuthed(false);
    document.dispatchEvent(new Event('authChange'));
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="w-full px-6 py-4 bg-white shadow flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">AutoBlog</Link>

        {authed ? (
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Cog className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="text-center text-gray-500 text-sm py-4">
        &copy; 2025 Alder Creek Digital
      </footer>
    </div>
  );
}
