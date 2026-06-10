import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, ShieldCheck, Award, Users, ArrowRight, MessageSquare, Wrench, FileText } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { Review } from '@/models/Review';
import { getSiteSettings } from '@/lib/settings';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  await dbConnect();
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || 'Nayyarslocks';
  const defaultWhatsapp = settings?.contact?.whatsappNumber || '9219595948';

  // Fetch active parent categories (limit to 8)
  const categories = JSON.parse(JSON.stringify(
    await Category.find({ isActive: true, parent: null })
      .sort({ sortOrder: 1 })
      .limit(8)
      .lean()
  ));

  // Fetch featured products
  const featuredProducts = JSON.parse(JSON.stringify(
    await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(4)
      .lean()
  ));

  // Fetch bestseller products
  const bestsellerProducts = JSON.parse(JSON.stringify(
    await Product.find({ isActive: true, isBestseller: true })
      .populate('category', 'name slug')
      .limit(4)
      .lean()
  ));

  // Fetch featured reviews
  const reviews = JSON.parse(JSON.stringify(
    await Review.find({ isPublished: true, isFeatured: true })
      .limit(3)
      .lean()
  ));

  const formattedWhatsapp = defaultWhatsapp.replace(/[^0-9]/g, '');
  const generalCtaMessage = `Hi ${siteName}, I would like to consult with a security expert regarding bulk locks orders. Please share details.`;
  const generalWhatsappUrl = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(generalCtaMessage)}`;

  return (
    <div className="relative">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-black via-gray-900 to-black py-24 text-white border-b border-brand-bronze/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-bronze/10 via-transparent to-transparent opacity-60"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="rounded-full bg-brand-bronze/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-bronze mb-6 border border-brand-bronze/20">
                ⭐ Trusted Security Brand
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-white drop-shadow-sm">
                {settings?.hero?.title || 'Uncompromised Security, Premium Craftsmanship'}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl font-medium leading-relaxed opacity-95">
                {settings?.hero?.subtitle || 'Discover our advanced range of padlocks, smart biometric locks, mechanical deadbolts, and security hardware engineered to safeguard your world.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-bronze px-8 py-4 text-sm font-bold text-white hover:bg-brand-bronze-hover transition-all shadow-lg hover:scale-102 shadow-brand-bronze/20"
                >
                  {settings?.hero?.ctaText || 'Explore Products'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {settings?.brochureUrl && (
                  <a
                    href={settings.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/20 backdrop-blur-sm px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all hover:scale-102"
                  >
                    <FileText className="h-4 w-4 text-brand-bronze" />
                    View Brochure
                  </a>
                )}
                {/* <a
                  href={generalWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/20 backdrop-blur-sm px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all hover:scale-102"
                >
                  <MessageSquare className="h-4 w-4 fill-current text-emerald-450" />
                  Consult on WhatsApp
                </a> */}
              </div>
            </div>
            <div className="lg:col-span-5 relative hidden lg:block aspect-square w-full">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/5 to-white/0 border border-white/10 p-4 shadow-2xl backdrop-blur-sm">
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-brand-black/60 border border-brand-bronze/10">
                  <Image
                    src={settings?.hero?.bgImage || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&auto=format&fit=crop&q=80'}
                    alt="Nayyars Locks Banner"
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover mix-blend-luminosity opacity-85 group-hover:scale-102 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-brand-black/60 backdrop-blur-md border border-brand-bronze/20">
                    <p className="text-sm font-bold text-white mb-1">Double Protection Technology</p>
                    <p className="text-xs text-gray-300 font-medium">Equipped with pick-resistant cylinders and hardened steel shackles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Business Stats */}
      <section className="relative -mt-10 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl border border-gray-150 bg-white p-6 shadow-xl text-center divide-y-0 divide-x divide-gray-100">
          <div className="flex flex-col items-center p-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-bronze mb-1">75+</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Years Experience</span>
          </div>
          <div className="flex flex-col items-center p-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-bronze mb-1">4th</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Generation Business
            </span>
          </div>
          <div className="flex flex-col items-center p-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-bronze mb-1">500K+</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Happy Customers</span>
          </div>
          {/* <div className="flex flex-col items-center p-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-bronze mb-1">100%</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rust-Proof Materials</span>
          </div> */}
          <div className="flex flex-col items-center p-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-bronze mb-1">120+</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lock Designs</span>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="py-20 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="text-left">
              <span className="text-sm font-bold uppercase tracking-widest text-brand-bronze">Product Range</span>
              <h2 className="text-3xl font-extrabold text-gray-950 mt-2">Explore Security Categories</h2>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-1.5 text-sm font-bold text-brand-bronze hover:text-brand-bronze-hover transition-colors"
            >
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat: any) => (
              <Link
                key={cat._id.toString()}
                href={`/products?category=${cat.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white p-4 text-center transition-all duration-300 hover:shadow-xl hover:border-red-200"
              >
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=400&auto=format&fit=crop&q=80'}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-bronze transition-colors">
                  {cat.name}
                </h3>
                <p className="line-clamp-2 text-xs text-gray-400 mt-1 text-left px-1 font-medium">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trust/Why Choose Us Section */}
      <section className="py-20 border-t border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-bold uppercase tracking-widest text-brand-bronze">Built to Protect</span>
            <h2 className="text-3xl font-extrabold text-gray-950 mt-2">Why Lock Experts Choose Nayyarslocks</h2>
            <p className="text-sm text-gray-500 mt-4 font-medium leading-relaxed">
              For over three decades, we have engineered locking systems that withstand heavy wear, environment rust, and targeted burglar manipulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bronze/5 text-brand-bronze mb-6 border border-brand-bronze/10">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hardened Durability</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Our shackles are made from hardened carbon steel alloys that resist cutting by bolt-cutters.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bronze/5 text-brand-bronze mb-6 border border-brand-bronze/10">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pick-Resistant Core</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                High precision cylinder pins and computerized dimple key patterns eliminate bump opening.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bronze/5 text-brand-bronze mb-6 border border-brand-bronze/10">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Anti-Corrosive Plating</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Finished with electro-plated coatings protecting against salt spray, humidity, and acid rain.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-bronze/5 text-brand-bronze mb-6 border border-brand-bronze/10">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Certified Security</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Certified and tested locks corresponding to high international safety rating standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Products & Best Sellers */}
      <section className="py-20 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Best Sellers */}
          {bestsellerProducts.length > 0 && (
            <div className="mb-20">
              <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="text-left">
                  <span className="text-sm font-bold uppercase tracking-widest text-brand-bronze">Top Choices</span>
                  <h2 className="text-3xl font-extrabold text-gray-950 mt-2">Our Best Sellers</h2>
                </div>
                <Link
                  href="/products"
                  className="flex items-center gap-1 text-sm font-bold text-brand-bronze hover:text-brand-bronze-hover transition-colors"
                >
                  View All Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {bestsellerProducts.map((prod: any) => (
                  <ProductCard key={prod._id.toString()} product={prod} defaultWhatsapp={defaultWhatsapp} />
                ))}
              </div>
            </div>
          )}

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div>
              <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="text-left">
                  <span className="text-sm font-bold uppercase tracking-widest text-brand-bronze">Curated Security</span>
                  <h2 className="text-3xl font-extrabold text-gray-950 mt-2">Featured Locks & Hardware</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((prod: any) => (
                  <ProductCard key={prod._id.toString()} product={prod} defaultWhatsapp={defaultWhatsapp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Customer Reviews / Testimonials */}
      {reviews.length > 0 && (
        <section className="py-20 bg-white border-t border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-bold uppercase tracking-widest text-brand-bronze">Client Reviews</span>
              <h2 className="text-3xl font-extrabold text-gray-950 mt-2">What Our Customers Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev: any) => (
                <div
                  key={rev._id.toString()}
                  className="flex flex-col justify-between rounded-2xl border border-gray-150 p-6 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 text-amber-500 mb-4">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                      &ldquo;{rev.title}&rdquo;
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {rev.comment}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-50 border border-gray-200">
                      <Image
                        src={rev.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop'}
                        alt={rev.customerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-gray-900">{rev.customerName}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{rev.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. WhatsApp Banner Call-to-Action */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-black via-gray-900 to-brand-black px-6 py-16 text-center text-white shadow-2xl md:px-12 sm:py-20 border border-brand-bronze/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-bronze/10 via-transparent to-transparent opacity-65"></div>
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-bronze/10 border border-brand-bronze/20 mb-6">
              <Users className="h-6 w-6 text-brand-bronze" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Looking for Bulk Custom Orders?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-8 font-medium leading-relaxed">
              We provide tailored locking solutions and special pricing brackets for hardware distributors, corporate clients, and real-estate developers. Consult directly with our sales executives.
            </p>
            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-brand-bronze px-10 py-5 text-sm font-bold text-white hover:bg-brand-bronze-hover transition-all shadow-xl hover:scale-103"
            >
              <MessageSquare className="h-5 w-5 fill-current text-white" />
              Inquire on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
