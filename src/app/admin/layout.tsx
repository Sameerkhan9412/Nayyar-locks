'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderOpen,
  Star,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { name: 'Customer Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Inquiries', href: '/admin/contacts', icon: Mail },
    { name: 'Site Settings', href: '/admin/settings', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-150 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col bg-brand-black px-2 py-0.5 border-y border-brand-bronze text-white select-none rounded-sm">
              <span className="text-[10px] font-black tracking-[0.25em] font-sans leading-none">NAYYARS</span>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-gray-900">
              AdminConsole<span className="text-brand-bronze">.</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-brand-bronze/10 text-brand-bronze'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-brand-bronze'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-brand-bronze' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout info */}
        <div className="border-t border-gray-150 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-bold text-gray-600 hover:border-brand-bronze/25 hover:bg-brand-bronze/5 hover:text-brand-bronze transition-all"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              {navigation.find((nav) => nav.href === pathname)?.name || 'Admin Area'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-bronze/10 px-3 py-1 text-xs font-bold text-brand-bronze">
              Admin Session
            </span>
          </div>
        </header>

        {/* Page Inner Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
