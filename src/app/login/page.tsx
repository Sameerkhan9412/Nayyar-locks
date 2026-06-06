'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Redirect to admin panel dashboard
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection failure. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Branding header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex flex-col bg-brand-black px-5 py-2.5 border-y-2 border-brand-bronze text-white select-none rounded-sm">
              <span className="text-sm font-black tracking-[0.35em] font-sans leading-none">NAYYARS</span>
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-950">
            Admin Console Sign-in
          </h2>
          <p className="mt-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login form Card */}
        <div className="rounded-2xl border border-gray-150 bg-white p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-150 p-3.5 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="username-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="username-input"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    id="password-input"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-bronze py-3 text-sm font-bold text-white transition-all hover:bg-brand-bronze-hover focus:outline-none focus:ring-2 focus:ring-brand-bronze disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>

        {/* Public home link */}
        <div className="text-center">
          <Link href="/" className="text-xs font-bold text-gray-500 hover:text-brand-bronze transition-colors">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
