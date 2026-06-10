import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import { Category } from '@/models/Category';

export const revalidate = 60;

export default async function CategoriesPage() {
  await dbConnect();
  const categories = await Category.find({
    isActive: true,
    $or: [{ parent: null }, { parent: { $exists: false } }],
  })
    .sort({ sortOrder: 1 })
    .lean();

  return (
    <div className="py-16 bg-gray-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-bronze">Product Categories</span>
          <h1 className="text-4xl font-extrabold text-gray-950 mt-2">Security Solutions For Every Setting</h1>
          <p className="text-sm text-gray-500 mt-4 font-medium leading-relaxed">
            Browse through our wide selection of industrial-grade brass padlocks, smart locks, lever door handles, and heavy gate mechanisms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((cat: any) => (
            <div
              key={cat._id.toString()}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-150 bg-white p-5 transition-all duration-300 hover:shadow-xl hover:border-brand-bronze/30"
            >
              <div>
                <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&auto=format&fit=crop&q=80'}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-950 group-hover:text-brand-bronze transition-colors">
                  {cat.name}
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed mt-2 font-medium">
                  {cat.description}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-50">
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="flex items-center justify-between rounded-xl bg-brand-bronze/5 px-4 py-3 text-sm font-bold text-brand-bronze hover:bg-brand-bronze hover:text-white transition-all"
                >
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
