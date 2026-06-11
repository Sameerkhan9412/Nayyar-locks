import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FilterX, ArrowUpDown } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { getSiteSettings } from '@/lib/settings';
import ProductCard from '@/components/ProductCard';

export const revalidate = 10; // short cache to ensure changes reflect fast

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  await dbConnect();
  const settings = await getSiteSettings();
  const defaultWhatsapp = settings?.contact?.whatsappNumber || '9219595948';

  const params = await searchParams;
  const activeCategorySlug = params.category || '';
  const searchWord = params.search || '';
  const sortBy = params.sort || 'newest';
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const limit = 8; // Products per page
  const skip = (currentPage - 1) * limit;

  // Fetch all active categories for sidebar filters
  const categories = JSON.parse(JSON.stringify(
    await Category.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean()
  ));

  // Find category ID if a slug is provided
  let targetCategoryIds: string[] = [];
  let activeCategoryName = '';
  let parentCategory: any = null;
  let subCategoriesOfActive: any[] = [];

  if (activeCategorySlug) {
    const matchedCategory = categories.find((c: any) => c.slug === activeCategorySlug);
    if (matchedCategory) {
      targetCategoryIds.push(matchedCategory._id.toString());
      activeCategoryName = matchedCategory.name;

      if (matchedCategory.parent) {
        // This is a subcategory, find its parent
        parentCategory = categories.find((c: any) => c._id.toString() === matchedCategory.parent.toString());
        // Find sibling subcategories
        subCategoriesOfActive = categories.filter(
          (c: any) => c.parent && c.parent.toString() === matchedCategory.parent.toString()
        );
      } else {
        // This is a parent category, get all its subcategories
        const subs = categories.filter(
          (c: any) => c.parent && c.parent.toString() === matchedCategory._id.toString()
        );
        subs.forEach((sub: any) => targetCategoryIds.push(sub._id.toString()));
        subCategoriesOfActive = subs;
      }
    }
  }

  // Construct MongoDB Query
  const query: any = { isActive: true };

  // Category filter
  if (targetCategoryIds.length > 0) {
    query.category = { $in: targetCategoryIds };
  }

  // Search keyword match
  if (searchWord.trim() !== '') {
    const regex = { $regex: searchWord.trim(), $options: 'i' };
    
    // Check if searchWord matches any category name, to expand category search
    const matchingCats = await Category.find({
      name: { $regex: searchWord.trim(), $options: 'i' },
      isActive: true,
    }).select('_id');
    const matchingCatIds = matchingCats.map((c) => c._id.toString());

    query.$or = [
      { name: regex },
      { brand: regex },
      { SKU: regex },
      { tags: regex },
      { description: regex },
      { shortDescription: regex },
      { category: { $in: matchingCatIds } },
    ];
  }

  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sortBy === 'name-asc') {
    sortOption = { name: 1 };
  } else if (sortBy === 'name-desc') {
    sortOption = { name: -1 };
  } else if (sortBy === 'newest') {
    sortOption = { createdAt: -1 };
  }

  // Execute Query with Pagination
  const totalProducts = await Product.countDocuments(query);
  const products = JSON.parse(JSON.stringify(
    await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean()
  ));

  const totalPages = Math.ceil(totalProducts / limit);

  // Helper function to build dynamic link params
  const buildFilterLink = (filters: {
    category?: string | null;
    search?: string | null;
    sort?: string | null;
    page?: number | null;
  }) => {
    const queryParts = [];
    const cat = filters.category !== undefined ? filters.category : activeCategorySlug;
    const s = filters.search !== undefined ? filters.search : searchWord;
    const sortVal = filters.sort !== undefined ? filters.sort : sortBy;
    const pageVal = filters.page !== undefined ? filters.page : currentPage;

    if (cat) queryParts.push(`category=${encodeURIComponent(cat)}`);
    if (s) queryParts.push(`search=${encodeURIComponent(s)}`);
    if (sortVal && sortVal !== 'newest') queryParts.push(`sort=${sortVal}`);
    if (pageVal && pageVal > 1) queryParts.push(`page=${pageVal}`);

    return queryParts.length > 0 ? `/products?${queryParts.join('&')}` : '/products';
  };

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Summary */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-gray-950">
              {searchWord ? `Search Results for "${searchWord}"` : 'Browse Our Locks Collection'}
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-semibold">
              Showing {products.length} of {totalProducts} premium security products
            </p>
          </div>
          {/* Active filter tags */}
          {(activeCategorySlug || searchWord) && (
            <Link
              href="/products"
              className="flex items-center gap-1.5 self-start md:self-auto rounded-lg bg-brand-bronze/5 px-3 py-1.5 text-xs font-bold text-brand-bronze hover:bg-brand-bronze hover:text-white transition-all border border-brand-bronze/10"
            >
              <FilterX className="h-4 w-4" />
              Clear Active Filters
            </Link>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel: Sidebar Filters */}
          <aside className="flex flex-col gap-6">
            {/* Category Filter box */}
            <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-50 pb-3 mb-4">
                Categories
              </h3>
              <div className="flex flex-col gap-1.5 text-sm font-semibold text-gray-600">
                <Link
                  href={buildFilterLink({ category: null, page: 1 })}
                  className={`rounded-xl px-3 py-2 text-left transition-all hover:bg-gray-50 hover:text-brand-bronze ${
                    !activeCategorySlug ? 'bg-brand-bronze/5 text-brand-bronze font-bold' : ''
                  }`}
                >
                  All Products
                </Link>
                {categories
                  .filter((cat: any) => !cat.parent)
                  .map((cat: any) => {
                    const isParentActive =
                      activeCategorySlug === cat.slug ||
                      (parentCategory && parentCategory.slug === cat.slug);
                    return (
                      <Link
                        key={cat._id.toString()}
                        href={buildFilterLink({ category: cat.slug, page: 1 })}
                        className={`rounded-xl px-3 py-2 text-left transition-all hover:bg-gray-50 hover:text-brand-bronze ${
                          isParentActive ? 'bg-brand-bronze/5 text-brand-bronze font-bold' : ''
                        }`}
                      >
                        {cat.name}
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Sort Filter box */}
            <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-50 pb-3 mb-4 flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4 text-brand-bronze" />
                Sort By
              </h3>
              <div className="flex flex-col gap-1.5 text-sm font-semibold text-gray-600 font-medium">
                <Link
                  href={buildFilterLink({ sort: 'newest', page: 1 })}
                  className={`rounded-xl px-3 py-2 text-left transition-all hover:bg-gray-50 hover:text-brand-bronze ${
                    sortBy === 'newest' ? 'bg-brand-bronze/5 text-brand-bronze font-bold' : ''
                  }`}
                >
                  New Arrivals
                </Link>
                <Link
                  href={buildFilterLink({ sort: 'name-asc', page: 1 })}
                  className={`rounded-xl px-3 py-2 text-left transition-all hover:bg-gray-50 hover:text-brand-bronze ${
                    sortBy === 'name-asc' ? 'bg-brand-bronze/5 text-brand-bronze font-bold' : ''
                  }`}
                >
                  Name: A to Z
                </Link>
                <Link
                  href={buildFilterLink({ sort: 'name-desc', page: 1 })}
                  className={`rounded-xl px-3 py-2 text-left transition-all hover:bg-gray-50 hover:text-brand-bronze ${
                    sortBy === 'name-desc' ? 'bg-brand-bronze/5 text-brand-bronze font-bold' : ''
                  }`}
                >
                  Name: Z to A
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Panel: Products Grid */}
          <div className="lg:col-span-3">
            {/* Subcategories Filter Chips */}
            {activeCategorySlug && subCategoriesOfActive.length > 0 && (
              <div className="mb-6 p-4 bg-white border border-gray-150 rounded-2xl shadow-sm text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-bronze block mb-2.5">
                  Subcategories
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildFilterLink({ category: parentCategory ? parentCategory.slug : activeCategorySlug, page: 1 })}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                      !parentCategory
                        ? 'bg-brand-bronze text-white border-brand-bronze shadow-md shadow-brand-bronze/10'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All {parentCategory ? parentCategory.name : activeCategoryName}
                  </Link>
                  {subCategoriesOfActive.map((sub: any) => (
                    <Link
                      key={sub._id.toString()}
                      href={buildFilterLink({ category: sub.slug, page: 1 })}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                        activeCategorySlug === sub.slug
                          ? 'bg-brand-bronze text-white border-brand-bronze shadow-md shadow-brand-bronze/10'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((prod: any) => (
                  <ProductCard 
                    key={prod._id.toString()} 
                    product={prod} 
                    defaultWhatsapp={defaultWhatsapp} 
                    brochureUrl={settings?.brochureUrl}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-6 border border-gray-100">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No Locks Found</h3>
                <p className="text-sm text-gray-500 max-w-sm mt-2 leading-relaxed">
                  We couldn&apos;t find any active products matching your selection. Try adjusting your filters or search keywords.
                </p>
                <Link
                  href="/products"
                  className="mt-6 rounded-xl bg-brand-bronze px-6 py-3 text-sm font-bold text-white hover:bg-brand-bronze-hover transition-colors shadow-lg shadow-brand-bronze/20"
                >
                  Reset All Filters
                </Link>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Link
                  href={buildFilterLink({ page: Math.max(1, currentPage - 1) })}
                  className={`flex h-10 px-4 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors ${
                    currentPage === 1 ? 'pointer-events-none opacity-40' : ''
                  }`}
                >
                  Previous
                </Link>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pg = idx + 1;
                  return (
                    <Link
                      key={pg}
                      href={buildFilterLink({ page: pg })}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        currentPage === pg
                          ? 'bg-brand-bronze text-white shadow-md shadow-brand-bronze/20'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pg}
                    </Link>
                  );
                })}
                <Link
                  href={buildFilterLink({ page: Math.min(totalPages, currentPage + 1) })}
                  className={`flex h-10 px-4 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors ${
                    currentPage === totalPages ? 'pointer-events-none opacity-40' : ''
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
