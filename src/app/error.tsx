'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, Home, Wrench } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-bronze/10 text-brand-bronze mb-8 border border-brand-bronze/20 shadow-md">
        <Wrench className="h-10 w-10 text-brand-bronze" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Error</h1>
      <h2 className="text-sm font-bold text-brand-bronze mt-2 uppercase tracking-widest">
        A Lock Malfunction Occurred
      </h2>
      <p className="text-xs text-gray-400 max-w-sm mt-3 leading-relaxed font-mono font-medium p-3 rounded-lg bg-gray-100 border border-gray-200 break-words">
        {error.message || 'An unexpected error occurred. Our engineers are investigating.'}
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-bronze px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-bronze-hover shadow-lg shadow-brand-bronze/20"
        >
          <RefreshCw className="h-4 w-4" />
          Attempt Recovery
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-250 px-6 py-3.5 text-sm font-bold text-gray-750 hover:bg-gray-50 transition-all"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
