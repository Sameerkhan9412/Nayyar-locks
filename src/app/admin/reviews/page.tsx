'use client';

import React, { useState, useEffect } from 'react';
import { Star, Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';

interface ReviewItem {
  _id: string;
  customerName: string;
  location: string;
  avatar: string;
  rating: number;
  title: string;
  comment: string;
  linkedProduct?: {
    _id: string;
    name: string;
    SKU: string;
  } | string;
  isFeatured: boolean;
  isPublished: boolean;
  source: string;
  reviewDate: string;
}

interface ProductDropdownItem {
  _id: string;
  name: string;
  SKU: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [products, setProducts] = useState<ProductDropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState('');
  const [rating, setRating] = useState('5');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [linkedProduct, setLinkedProduct] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [source, setSource] = useState('Manual');
  const [reviewDate, setReviewDate] = useState('');

  const loadData = async () => {
    try {
      // Load reviews
      const revRes = await fetch('/api/reviews');
      const revData = await revRes.json();

      // Load products for dropdown
      const prodRes = await fetch('/api/products?admin=true');
      const prodData = await prodRes.json();

      if (revRes.ok && revData.success) {
        setReviews(revData.reviews || []);
      } else {
        setError(revData.error || 'Failed to load reviews');
      }

      if (prodRes.ok && prodData.success) {
        setProducts(prodData.products || []);
      }
    } catch (err) {
      console.error('Reviews load data error:', err);
      setError('Connection error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setCustomerName('');
    setLocation('');
    setAvatar('');
    setRating('5');
    setTitle('');
    setComment('');
    setLinkedProduct('');
    setIsFeatured(false);
    setIsPublished(true);
    setSource('Manual');
    setReviewDate('');
  };

  const handleEdit = (rev: ReviewItem) => {
    setEditingId(rev._id);
    setCustomerName(rev.customerName);
    setLocation(rev.location);
    setAvatar(rev.avatar || '');
    setRating(String(rev.rating));
    setTitle(rev.title);
    setComment(rev.comment);
    setLinkedProduct(
      typeof rev.linkedProduct === 'object' && rev.linkedProduct
        ? rev.linkedProduct._id
        : (rev.linkedProduct as string) || ''
    );
    setIsFeatured(rev.isFeatured);
    setIsPublished(rev.isPublished);
    setSource(rev.source || 'Manual');
    setReviewDate(rev.reviewDate ? rev.reviewDate.substring(0, 10) : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const payload = {
      customerName,
      location,
      avatar,
      rating: Number(rating),
      title,
      comment,
      linkedProduct: linkedProduct || undefined,
      isFeatured,
      isPublished,
      source,
      reviewDate: reviewDate || undefined,
    };

    try {
      const url = editingId ? `/api/reviews/${editingId}` : '/api/reviews';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(editingId ? 'Review updated successfully!' : 'Review created successfully!');
        resetForm();
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Review submit error:', err);
      setError('Connection error submitting review');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Review deleted successfully');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Review delete error:', err);
      setError('Connection error deleting review');
    }
  };

  const toggleFeatured = async (rev: ReviewItem) => {
    try {
      const res = await fetch(`/api/reviews/${rev._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rev,
          isFeatured: !rev.isFeatured,
          linkedProduct: typeof rev.linkedProduct === 'object' && rev.linkedProduct ? rev.linkedProduct._id : rev.linkedProduct,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews((prev) =>
          prev.map((item) => (item._id === rev._id ? { ...item, isFeatured: !item.isFeatured } : item))
        );
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const togglePublished = async (rev: ReviewItem) => {
    try {
      const res = await fetch(`/api/reviews/${rev._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rev,
          isPublished: !rev.isPublished,
          linkedProduct: typeof rev.linkedProduct === 'object' && rev.linkedProduct ? rev.linkedProduct._id : rev.linkedProduct,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews((prev) =>
          prev.map((item) => (item._id === rev._id ? { ...item, isPublished: !item.isPublished } : item))
        );
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Customer Testimonials</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Input and manage shared feedback from Google, WhatsApp, and letters
          </p>
        </div>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-150 p-4 text-xs font-semibold text-emerald-800">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-150 p-4 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Reviews List */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {reviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-150">
                  <tr>
                    <th className="px-6 py-4">Client Detail</th>
                    <th className="px-6 py-4">Rating & Title</th>
                    <th className="px-6 py-4">Linked Product</th>
                    <th className="px-6 py-4 text-center">Featured</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {reviews.map((rev) => {
                    const prodName =
                      typeof rev.linkedProduct === 'object' && rev.linkedProduct
                        ? rev.linkedProduct.name
                        : '';
                    return (
                      <tr key={rev._id} className="hover:bg-gray-50/50 font-semibold text-gray-700">
                        <td className="px-6 py-4">
                          <h4 className="font-extrabold text-gray-900">{rev.customerName}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{rev.location}</p>
                          <span className="inline-block rounded bg-gray-100 text-[10px] font-bold text-gray-500 px-1.5 py-0.5 mt-1 font-mono">
                            {rev.source}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-0.5 text-amber-500 mb-1">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                          <p className="text-xs text-gray-900 font-bold truncate max-w-[150px]">{rev.title}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                          {prodName ? (
                            <div>
                              <p className="font-extrabold text-gray-800 line-clamp-1">{prodName}</p>
                              <span className="text-[10px] text-gray-400 font-mono">SKU: {typeof rev.linkedProduct === 'object' && rev.linkedProduct?.SKU}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-bold italic">Unlinked</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleFeatured(rev)}
                            className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase transition-all ${
                              rev.isFeatured
                                ? 'bg-red-50 text-red-600 border border-red-250'
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                          >
                            {rev.isFeatured ? 'Yes' : 'No'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => togglePublished(rev)}
                            className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase transition-all ${
                              rev.isPublished
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                                : 'bg-red-50 text-red-600 border border-red-250'
                            }`}
                          >
                            {rev.isPublished ? 'Published' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(rev)}
                              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
                              title="Edit review"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(rev._id)}
                              className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-650 hover:bg-red-100 transition-all"
                              title="Delete review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 font-medium">
              No testimonials configured yet.
            </div>
          )}
        </div>

        {/* Reviews Form */}
        <div className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-50 pb-3 mb-4">
            {editingId ? 'Edit Testimonial' : 'Record Testimonial'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rev-client-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Client Name</label>
              <input
                type="text"
                id="rev-client-input"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rev-location-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  id="rev-location-input"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Jaipur"
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rev-source-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Source</label>
                <input
                  type="text"
                  id="rev-source-input"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Google Review / WhatsApp"
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rev-rating-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</label>
                <select
                  id="rev-rating-input"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-semibold"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="rev-date-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  id="rev-date-input"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-semibold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="rev-product-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Linked Product</label>
              <select
                id="rev-product-input"
                value={linkedProduct}
                onChange={(e) => setLinkedProduct(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-semibold"
              >
                <option value="">None (General Review)</option>
                {products.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name} ({prod.SKU})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="rev-title-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Review Title</label>
              <input
                type="text"
                id="rev-title-input"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Excellent lock security!"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="rev-comment-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Comments</label>
              <textarea
                id="rev-comment-input"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Write review testimonial details..."
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-semibold resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                Published
              </label>
            </div>

            <div className="flex gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-650 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-red-600 py-3 text-xs font-bold text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
