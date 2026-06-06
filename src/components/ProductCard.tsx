'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    SKU: string;
    brand: string;
    price: number;
    originalPrice: number;
    category?: {
      name: string;
      slug: string;
    } | string;
    isBestseller?: boolean;
    isNewArrival?: boolean;
    whatsappOverride?: string;
  };
  defaultWhatsapp: string;
}

export default function ProductCard({ product, defaultWhatsapp }: ProductCardProps) {
  const whatsappNumber = product.whatsappOverride || defaultWhatsapp;
  const formattedNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const message = `Hi Nayyars, I am interested in this product: ${product.name} (SKU: ${product.SKU}). Please share price and details.`;
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const categoryName = typeof product.category === 'object' && product.category
    ? product.category.name
    : 'Lock';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white transition-all duration-300 hover:shadow-xl hover:border-brand-bronze/30">
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        {product.isBestseller && (
          <span className="rounded-full bg-brand-black border border-brand-bronze/45 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-bronze shadow-sm">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
            New Arrival
          </span>
        )}
      </div>

      {discount > 0 && (
        <div className="absolute right-3 top-3 z-10">
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 border border-emerald-250 shadow-sm">
            -{discount}% OFF
          </span>
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square w-full overflow-hidden bg-gray-50">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-bronze">
            {categoryName}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            {product.SKU}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="mb-2 block">
          <h3 className="line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-brand-bronze">
            {product.name}
          </h3>
        </Link>

        <p className="mb-4 text-xs font-medium text-gray-400">
          Brand: <span className="text-gray-600 font-semibold">{product.brand}</span>
        </p>

        {/* Pricing */}
        <div className="mt-auto mb-5 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-center text-sm font-bold text-white transition-all hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-md shadow-emerald-100"
          >
            <MessageSquare className="h-4 w-4 fill-current" />
            Buy on WhatsApp
          </a>
          <Link
            href={`/products/${product.slug}`}
            className="col-span-1 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 border border-gray-200"
            title="View Details"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
