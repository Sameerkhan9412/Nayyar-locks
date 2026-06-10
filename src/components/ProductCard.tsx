'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&auto=format&fit=crop&q=80'];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  return (
    <>
      {/* Product Card Cardboard */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white transition-all duration-300 hover:shadow-xl hover:border-brand-bronze/30 cursor-pointer"
      >
        {/* Product Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <Image
            src={imagesList[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Details - Display ONLY product name */}
        <div className="p-5 flex-1 flex flex-col justify-center">
          <h3 className="line-clamp-2 text-base font-extrabold text-gray-900 transition-colors group-hover:text-brand-bronze text-center">
            {product.name}
          </h3>
        </div>
      </div>

      {/* Lightbox / Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-205"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full p-6 sm:p-8 flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 rounded-full bg-gray-100 p-2.5 text-gray-500 hover:bg-gray-200 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Image Gallery */}
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
              <Image
                src={imagesList[currentImageIndex]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain"
              />

              {/* Navigation Arrows for multi-image products */}
              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 hover:bg-white transition-all shadow-md"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 hover:bg-white transition-all shadow-md"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {imagesList.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Product Title inside Modal */}
            <div className="w-full text-center">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
