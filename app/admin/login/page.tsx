'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-[#B8860B]/30 p-8">
        <h1 className="text-[#B8860B] uppercase tracking-widest text-lg font-semibold mb-8 text-center">
          Admin Login
        </h1>
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#B8860B]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black text-white border border-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#B8860B]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black text-white border border-gray-600 px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B]"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full border border-[#B8860B] text-[#B8860B] py-3 text-xs uppercase tracking-widest hover:bg-[#B8860B] hover:text-white transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}