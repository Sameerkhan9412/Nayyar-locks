'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShieldAlert, Settings as SettingsIcon } from 'lucide-react';
import SearchBar from './SearchBar';
import mainLogo from "../app/assets/logo.png"

interface NavbarProps {
  siteName: string;
  logo?: string;
  brochureUrl?: string;
}


export default function Navbar({ siteName, logo, brochureUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-150 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 hover:opacity-95 transition-opacity">
          {logo ? (
            <div className="relative h-14 w-34 rounded-md">
              <Image
                src={mainLogo}
                alt={siteName}
                fill
                sizes="128px"
                className="object-contain object-left rounded-md"
                priority
              />
            </div>
          ) : (
            <div className="flex flex-col bg-brand-black px-4 py-1.5 border-y-2 border-brand-bronze text-white select-none rounded-sm">
              <span className="text-[11px] font-black tracking-[0.35em] font-sans leading-none">NAYYARS</span>
            </div>
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-750">
          <Link href="/" className="transition-colors hover:text-brand-bronze">
            Home
          </Link>
          {/* <Link href="/categories" className="transition-colors hover:text-brand-bronze">
            Categories
          </Link> */}
          <Link href="/products" className="transition-colors hover:text-brand-bronze">
            Products
          </Link>
          <Link href="/about" className="transition-colors hover:text-brand-bronze">
            About Us
          </Link>
          <Link href="/contact" className="transition-colors hover:text-brand-bronze">
            Contact
          </Link>
          {brochureUrl && (
            <a
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-brand-bronze"
            >
              Brochure
            </a>
          )}
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:block flex-1 max-w-xs xl:max-w-md">
          <SearchBar />
        </div>

        {/* Admin Link - Desktop */}
        {/* <Link
          href="/admin"
          className="hidden md:flex items-center justify-center h-10 w-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-650 hover:text-brand-bronze hover:bg-brand-bronze/5 hover:border-brand-bronze/20 transition-all"
          title="Admin Panel"
        >
          <SettingsIcon className="h-5 w-5" />
        </Link> */}

        {/* Mobile Menu Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-50 border border-gray-100"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden flex flex-col gap-4 shadow-xl">
          {/* Mobile Search */}
          <div className="w-full">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-3 font-semibold text-gray-800">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              Contact
            </Link>
            {brochureUrl && (
              <a
                href={brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-3 py-2 text-brand-bronze hover:bg-brand-bronze/5 transition-colors font-bold"
              >
                Brochure
              </a>
            )}
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 bg-brand-bronze/5 text-brand-bronze transition-colors font-bold"
            >
              <ShieldAlert className="h-4 w-4" />
              Admin Panel
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
