'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Suggestion {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  SKU: string;
  brand: string;
  category?: {
    name: string;
    slug: string;
  };
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle outside clicks to close suggestion dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live search query fetching
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.products || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/products/${slug}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex w-full items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search locks, brands, SKUs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            className="w-full rounded-l-full border border-gray-300 bg-white py-2.5 pl-5 pr-10 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-brand-bronze" />
            ) : (
              query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )
            )}
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center rounded-r-full border border-brand-bronze bg-brand-bronze px-5 py-2.5 text-white hover:bg-brand-bronze-hover focus:outline-none focus:ring-2 focus:ring-brand-bronze"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-1.5 w-full rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl transition-all">
          {suggestions.length > 0 ? (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Matching Products
              </div>
              {suggestions.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleSuggestionClick(item.slug)}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.images[0] || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=100&auto=format&fit=crop'}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-sm font-semibold text-gray-900">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>SKU: {item.SKU}</span>
                      <span>•</span>
                      <span className="font-medium text-brand-bronze bg-brand-bronze/10 px-1.5 py-0.5 rounded text-[10px]">
                        {item.category?.name || 'Lock'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold text-gray-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </button>
              ))}
              <div className="border-t border-gray-100 mt-1.5 pt-1.5">
                <button
                  onClick={handleSubmit}
                  className="w-full text-center text-xs font-semibold text-brand-bronze hover:text-brand-bronze-hover py-1"
                >
                  View all results for &quot;{query}&quot;
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No products found matching &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
