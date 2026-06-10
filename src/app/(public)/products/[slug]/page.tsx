import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import { Product } from '@/models/Product';
import ProductImageGallery from '@/components/ProductImageGallery';

export const revalidate = 10;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  await dbConnect();

  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug')
    .lean();

  if (!product) {
    notFound();
  }

  const categoryObj = typeof product.category === 'object' && product.category ? (product.category as any) : null;

  return (
    <div className="py-16 bg-gray-50/50 min-h-screen flex flex-col items-center">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider justify-start w-full">
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
        <div className="w-full text-left mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-650 hover:text-brand-bronze transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all products
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 sm:p-10 shadow-md flex flex-col items-center gap-8 w-full max-w-2xl">
          {/* Product Image Gallery */}
          <div className="w-full max-w-md">
            <ProductImageGallery
              images={product.images || []}
              productName={product.name}
            />
          </div>

          {/* Product Name */}
          <div className="text-center w-full border-t border-gray-100 pt-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 leading-snug">
              {product.name}
            </h1>
            {categoryObj && (
              <span className="inline-block mt-3 rounded-full bg-brand-bronze/10 border border-brand-bronze/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-bronze">
                {categoryObj.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
