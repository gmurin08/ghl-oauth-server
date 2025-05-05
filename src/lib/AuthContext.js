import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const router = useRouter();

  const checkAuth = () => {
    const tokenExists = document.cookie.includes('token=');
    setAuthed(tokenExists);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        setAuthed(data.authed);
      } catch {
        setAuthed(false);
      }
    };
  
    checkAuth();
  
    // Listen for manual events
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);
  

  return (
    <AuthContext.Provider value={{ authed, setAuthed }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
