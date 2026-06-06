import React from 'react';
import Link from 'next/link';
import { ShoppingBag, FolderOpen, Mail, Star, ArrowRight, Settings as SettingsIcon, MessageSquare } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { ContactMessage } from '@/models/ContactMessage';
import { Review } from '@/models/Review';

export const revalidate = 0; // Always dynamic

export default async function AdminDashboardPage() {
  await dbConnect();

  // Query KPIs
  const totalProducts = await Product.countDocuments({});
  const totalCategories = await Category.countDocuments({});
  const unreadMessages = await ContactMessage.countDocuments({ isRead: false });

  // Calculate Average Rating
  const reviews = await Review.find({ isPublished: true }).select('rating').lean();
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc: number, cur: any) => acc + cur.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  // Fetch 5 latest contact messages
  const recentMessages = await ContactMessage.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-bronze/10 via-transparent to-transparent opacity-60"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome to Nayyarslocks Panel</h2>
          <p className="mt-2 text-sm text-gray-300 max-w-xl font-medium">
            Manage your catalog, read contact forms, edit customer testimonials, and configure global SEO settings instantly.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products KPI */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20 flex-shrink-0">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Products</span>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{totalProducts}</h3>
          </div>
        </div>

        {/* Categories KPI */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20 flex-shrink-0">
            <FolderOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</span>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{totalCategories}</h3>
          </div>
        </div>

        {/* Unread Inquiries KPI */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20 flex-shrink-0">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Inquiries</span>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{unreadMessages}</h3>
          </div>
        </div>

        {/* Rating KPI */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20 flex-shrink-0">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Rating</span>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{avgRating} / 5.0</h3>
          </div>
        </div>
      </div>

      {/* Grid of logs & action shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Contact Messages */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
              <h3 className="text-base font-extrabold text-gray-900">Recent Customer Inquiries</h3>
              <Link href="/admin/contacts" className="text-xs font-bold text-brand-bronze hover:underline">
                View All Inquiries
              </Link>
            </div>

            {recentMessages.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentMessages.map((msg: any) => (
                  <div key={msg._id.toString()} className="py-3.5 first:pt-0 last:pb-0 text-left">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-sm font-bold text-gray-800">{msg.name}</h4>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        msg.isRead ? 'bg-gray-100 text-gray-500' : 'bg-brand-bronze/10 text-brand-bronze'
                      }`}>
                        {msg.isRead ? 'Read' : 'New'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-1">{msg.subject}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-medium italic">
                      &quot;{msg.message}&quot;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-gray-400 font-medium">
                No customer inquiries received yet.
              </div>
            )}
          </div>
        </div>

        {/* Console Shortcuts */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-50 pb-4 mb-4">
            Console Shortcuts
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/products"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-sm font-bold text-gray-700 hover:border-brand-bronze/25 hover:bg-brand-bronze/5 hover:text-brand-bronze transition-all"
            >
              <span>Add New Lock</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-sm font-bold text-gray-700 hover:border-brand-bronze/25 hover:bg-brand-bronze/5 hover:text-brand-bronze transition-all"
            >
              <span>Manage Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-sm font-bold text-gray-700 hover:border-brand-bronze/25 hover:bg-brand-bronze/5 hover:text-brand-bronze transition-all"
            >
              <span>Site Configuration</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/reviews"
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-sm font-bold text-gray-700 hover:border-brand-bronze/25 hover:bg-brand-bronze/5 hover:text-brand-bronze transition-all"
            >
              <span>Enter Reviews</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
