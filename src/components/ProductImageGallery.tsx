'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=800&auto=format&fit=crop&q=80');

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image View */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 shadow-sm transition-all duration-300">
        <Image
          src={activeImage}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
      </div>

      {/* Thumbnails Navigation */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img: string, idx: number) => {
            const isActive = activeImage === img;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 transition-all ${
                  isActive
                    ? 'border-2 border-brand-bronze ring-2 ring-brand-bronze/10'
                    : 'border border-gray-150 hover:border-brand-bronze/40'
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} alternate view ${idx + 1}`}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
