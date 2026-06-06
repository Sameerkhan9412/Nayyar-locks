import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MessageSquare, ArrowLeft, Shield, CheckCircle2, ChevronRight } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import { Product } from '@/models/Product';
import { getSiteSettings } from '@/lib/settings';
import ProductCard from '@/components/ProductCard';
import ProductImageGallery from '@/components/ProductImageGallery';

export const revalidate = 10;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  await dbConnect();
  const settings = await getSiteSettings();
  const defaultWhatsapp = settings?.contact?.whatsappNumber || '9219595948';

  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug')
    .lean();

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current product)
  const relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .populate('category', 'name slug')
    .limit(4)
    .lean();

  const whatsappNumber = product.whatsappOverride || defaultWhatsapp;
  const formattedNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const whatsappMessage = `Hi Nayyars, I am interested in this product: ${product.name} (SKU: ${product.SKU}). Please share price and details.`;
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const categoryObj = typeof product.category === 'object' && product.category ? product.category : null;

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-brand-bronze transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/products" className="hover:text-brand-bronze transition-colors">Products</Link>
          {categoryObj && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={`/products?category=${categoryObj.slug}`} className="hover:text-brand-bronze transition-colors">
                {categoryObj.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-400 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Back Link */}
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-bronze transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all products
        </Link>

        {/* Main Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 rounded-3xl border border-gray-150 bg-white p-6 sm:p-8 lg:p-10 shadow-sm mb-16">
          {/* Left: Product Images */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <ProductImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* Right: Info Panels */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="rounded-xl bg-brand-bronze/10 border border-brand-bronze/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-bronze">
                  {categoryObj?.name || 'Lock'}
                </span>
                <span className="text-xs font-bold text-gray-400 font-mono">
                  SKU: {product.SKU}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mb-3 leading-snug">
                {product.name}
              </h1>

              <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500">
                <span>Brand:</span>
                <span className="text-gray-900 font-bold">{product.brand}</span>
                <span className="text-gray-300">|</span>
                <span>Material:</span>
                <span className="text-gray-900 font-bold">{product.material}</span>
              </div>

              {/* Price section */}
              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-950">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through font-medium">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="rounded-lg bg-emerald-50 border border-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                  Short Description
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {product.shortDescription}
                </p>
              </div>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="border-t border-gray-100 pt-6 mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-4.5 w-4.5 text-brand-bronze" />
                    Key Features
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {product.features.map((feat: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-gray-600">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Call-to-Action */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-5 text-center text-base font-bold text-white transition-all hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 shadow-xl shadow-emerald-100"
              >
                <MessageSquare className="h-6 w-6 fill-current" />
                Inquire & Buy on WhatsApp
              </a>
              <p className="text-center text-xs text-gray-400 mt-3 font-semibold">
                Pre-filled message: &ldquo;Hi Nayyars, I am interested in this product. Please share price and details.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Full Description / Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Detailed Description */}
          <div className="lg:col-span-7 rounded-3xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950 mb-4 border-b border-gray-50 pb-3">
              Product Overview
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-medium whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="lg:col-span-5 rounded-3xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-950 mb-4 border-b border-gray-50 pb-3">
              Specifications
            </h2>
            <div className="overflow-hidden rounded-xl border border-gray-150 divide-y divide-gray-150">
              <div className="grid grid-cols-2 bg-gray-50/50 p-3 text-xs font-bold text-gray-500">
                <div>SPECIFICATION</div>
                <div>DETAIL</div>
              </div>
              <div className="grid grid-cols-2 p-3 text-xs font-medium text-gray-600">
                <div className="font-bold text-gray-800">Security Grade</div>
                <div>{product.securityGrade}</div>
              </div>
              <div className="grid grid-cols-2 p-3 text-xs font-medium text-gray-600">
                <div className="font-bold text-gray-800">Key Type</div>
                <div>{product.keyType}</div>
              </div>
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-2 p-3 text-xs font-medium text-gray-600">
                    <div className="font-bold text-gray-800">{key}</div>
                    <div>{val as string}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-gray-400">
                  No extra specifications listed.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-950 mb-8 text-left">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((prod: any) => (
                <ProductCard key={prod._id.toString()} product={prod} defaultWhatsapp={defaultWhatsapp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
