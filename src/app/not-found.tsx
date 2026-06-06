import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-bronze/10 text-brand-bronze mb-8 border border-brand-bronze/20 shadow-md">
        <ShieldAlert className="h-10 w-10 animate-pulse" />
      </div>
      <h1 className="text-7xl font-black text-gray-900 tracking-tight">404</h1>
      <h2 className="text-2xl font-black text-gray-900 mt-4 leading-snug">
        Entry Denied / Page Not Found
      </h2>
      <p className="text-sm text-gray-500 max-w-sm mt-3 leading-relaxed font-semibold">
        It seems the security coordinates you requested do not exist, or the lock configuration was modified.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-bronze px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-bronze-hover shadow-lg shadow-brand-bronze/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/products"
          className="flex items-center justify-center rounded-xl bg-white border border-gray-250 px-6 py-3.5 text-sm font-bold text-gray-750 hover:bg-gray-50 transition-all"
        >
          Search Locks
        </Link>
      </div>
    </div>
  );
}
