'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

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
  brochureUrl?: string;
}

export default function ProductCard({ product, defaultWhatsapp, brochureUrl }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Magnifier Zoom States
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [[x, y], setXY] = useState([0, 0]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();
    const xCoord = e.pageX - left - window.scrollX;
    const yCoord = e.pageY - top - window.scrollY;
    setXY([xCoord, yCoord]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

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

  const whatsappNum = product.whatsappOverride || defaultWhatsapp;
  const cleanWhatsapp = whatsappNum.replace(/[^0-9]/g, '');
  const message = `Hi, I am interested in your product: *${product.name}* (SKU: ${product.SKU || ''}). Please share details.`;
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {/* Product Card Cardboard */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white transition-all duration-300 hover:shadow-xl hover:border-brand-bronze/30 cursor-pointer h-full"
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

        {/* Details - Display product name & actions */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <h3 className="line-clamp-2 text-base font-extrabold text-gray-900 transition-colors group-hover:text-brand-bronze text-center mb-4 min-h-[3rem] flex items-center justify-center">
            {product.name}
          </h3>
          
          <div className="flex flex-col gap-2 mt-auto">
            {brochureUrl && (
              <a
                href={brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-bronze to-amber-500 px-4 py-2.5 text-xs font-bold text-white hover:from-brand-bronze-hover hover:to-amber-600 transition-all shadow-[0_4px_12px_rgba(197,126,55,0.2)] hover:shadow-[0_4px_20px_rgba(197,126,55,0.4)] hover:-translate-y-0.5 active:translate-y-0 duration-200"
              >
                <FileText className="h-4 w-4" />
                <span>View Brochure</span>
              </a>
            )}
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50/50 hover:bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              <svg className="h-4 w-4 fill-current text-emerald-600" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.452 5.418 1.453 5.39 0 9.778-4.387 9.782-9.78.002-2.614-1.013-5.071-2.861-6.92-1.847-1.849-4.305-2.865-6.924-2.867-5.392 0-9.786 4.393-9.79 9.785-.002 1.902.497 3.762 1.446 5.368L2.392 21.65l5.255-1.378zm10.106-4.58c-.27-.136-1.602-.79-1.85-.88-.25-.09-.43-.136-.61.136-.18.27-.694.88-.85 1.06-.157.18-.314.2-.584.065-.27-.136-1.14-.42-2.172-1.34-1.03-.92-1.72-2.054-1.922-2.4-.203-.34-.023-.527.147-.697.153-.153.34-.397.51-.595.17-.2.23-.34.34-.567.11-.227.06-.427-.03-.6-.09-.175-.75-1.81-.97-2.34-.21-.52-.45-.45-.61-.45-.16-.003-.34-.003-.52-.003-.18 0-.47.07-.71.34-.24.27-.92.9-1.08 1.81-.16.9.15 1.8.47 2.19.32.39 2.58 3.94 6.25 5.52.87.38 1.55.6 2.08.77.88.28 1.68.24 2.3.15.7-.1 1.6-.65 1.83-1.25.23-.6.23-1.11.16-1.21-.07-.1-.26-.14-.53-.27z" />
              </svg>
              <span>WhatsApp Us</span>
            </a>
          </div>
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
            <div 
              className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 cursor-zoom-in"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={imagesList[currentImageIndex]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain pointer-events-none"
              />

              {/* Glassy Magnifier Lens */}
              {showMagnifier && (
                <div
                  style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    height: '150px',
                    width: '150px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.7)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(0.5px)',
                    // Center the lens on the cursor
                    top: `${y - 75}px`,
                    left: `${x - 75}px`,
                    // Zoomed background settings
                    backgroundImage: `url(${imagesList[currentImageIndex]})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${imgWidth * 2.5}px ${imgHeight * 2.5}px`,
                    backgroundPosition: `${-(x * 2.5 - 75)}px ${-(y * 2.5 - 75)}px`,
                  }}
                />
              )}

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

            {/* Product Title & Actions inside Modal */}
            <div className="w-full text-center flex flex-col items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2">
                {brochureUrl && (
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-bronze to-amber-500 px-5 py-3 text-sm font-bold text-white hover:from-brand-bronze-hover hover:to-amber-600 transition-all shadow-[0_4px_12px_rgba(197,126,55,0.25)] hover:shadow-[0_4px_20px_rgba(197,126,55,0.45)] hover:-translate-y-0.5 active:translate-y-0 duration-200"
                  >
                    <FileText className="h-5 w-5" />
                    <span>View Brochure</span>
                  </a>
                )}
                
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50/50 hover:bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                  <svg className="h-5 w-5 fill-current text-emerald-600" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.498 1.452 5.418 1.453 5.39 0 9.778-4.387 9.782-9.78.002-2.614-1.013-5.071-2.861-6.92-1.847-1.849-4.305-2.865-6.924-2.867-5.392 0-9.786 4.393-9.79 9.785-.002 1.902.497 3.762 1.446 5.368L2.392 21.65l5.255-1.378zm10.106-4.58c-.27-.136-1.602-.79-1.85-.88-.25-.09-.43-.136-.61.136-.18.27-.694.88-.85 1.06-.157.18-.314.2-.584.065-.27-.136-1.14-.42-2.172-1.34-1.03-.92-1.72-2.054-1.922-2.4-.203-.34-.023-.527.147-.697.153-.153.34-.397.51-.595.17-.2.23-.34.34-.567.11-.227.06-.427-.03-.6-.09-.175-.75-1.81-.97-2.34-.21-.52-.45-.45-.61-.45-.16-.003-.34-.003-.52-.003-.18 0-.47.07-.71.34-.24.27-.92.9-1.08 1.81-.16.9.15 1.8.47 2.19.32.39 2.58 3.94 6.25 5.52.87.38 1.55.6 2.08.77.88.28 1.68.24 2.3.15.7-.1 1.6-.65 1.83-1.25.23-.6.23-1.11.16-1.21-.07-.1-.26-.14-.53-.27z" />
                  </svg>
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
