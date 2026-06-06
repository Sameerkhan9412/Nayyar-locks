'use client';

import React, { useState, useEffect } from 'react';
import { FolderOpen, Plus, Edit2, Trash2, Save, X, Loader2, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import ImageUploadInput from '@/components/ImageUploadInput';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.categories || []);
      } else {
        setError(data.error || 'Failed to load categories');
      }
    } catch (err) {
      console.error('Categories load error:', err);
      setError('Connection error loading categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Auto slug generation based on name
  useEffect(() => {
    if (!editingId && name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  }, [name, editingId]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setImage('');
    setDescription('');
    setSortOrder('0');
    setIsActive(true);
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat._id);
    setName(cat.name);
    setSlug(cat.slug);
    setImage(cat.image);
    setDescription(cat.description);
    setSortOrder(String(cat.sortOrder));
    setIsActive(cat.isActive);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const payload = {
      name,
      slug,
      image,
      description,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(editingId ? 'Category updated successfully!' : 'Category created successfully!');
        resetForm();
        loadCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to submit category');
      }
    } catch (err) {
      console.error('Category submit error:', err);
      setError('Connection error submitting category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will fail if there are products assigned to it.')) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Category deleted successfully');
        loadCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Category delete error:', err);
      setError('Connection error deleting category');
    }
  };

  const toggleStatus = async (cat: CategoryItem) => {
    try {
      const res = await fetch(`/api/categories/${cat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cat,
          isActive: !cat.isActive,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories((prev) =>
          prev.map((item) => (item._id === cat._id ? { ...item, isActive: !item.isActive } : item))
        );
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-bronze" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Category Management</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Configure catalogs sections, sort levels, and banner images
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
        {/* Categories List (Left Panel) */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-150">
                  <tr>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Category Detail</th>
                    <th className="px-6 py-4">Sort Order</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50/50 font-semibold text-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                          <Image
                            src={cat.image || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=100&auto=format&fit=crop'}
                            alt={cat.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <h4 className="font-extrabold text-gray-900">{cat.name}</h4>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{cat.slug}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-600">
                          {cat.sortOrder}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleStatus(cat)}
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-all ${
                            cat.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-650 hover:text-brand-bronze hover:bg-brand-bronze/5 hover:border-brand-bronze/25 transition-all"
                            title="Edit details"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-650 hover:bg-red-100 transition-all"
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 font-medium">
              No product categories configured yet.
            </div>
          )}
        </div>

        {/* Categories Form (Right Panel) */}
        <div className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-50 pb-3 mb-4">
            {editingId ? 'Edit Category' : 'Create Category'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cat-name-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
              <input
                type="text"
                id="cat-name-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mortise Locks"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cat-slug-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slug (URL Path)</label>
              <input
                type="text"
                id="cat-slug-input"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. mortise-locks"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cat-image-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image URL / File</label>
              <ImageUploadInput
                id="cat-image-input"
                required
                value={image}
                onChange={setImage}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cat-desc-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
              <textarea
                id="cat-desc-input"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide category description details..."
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cat-sort-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort Order</label>
                <input
                  type="number"
                  id="cat-sort-input"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="0"
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                />
              </div>
              <div className="flex flex-col justify-end gap-1.5 pb-2.5">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-bronze focus:ring-brand-bronze"
                  />
                  Active Status
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
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
                className="flex-1 rounded-xl bg-brand-bronze py-3 text-xs font-bold text-white transition-all hover:bg-brand-bronze-hover focus:outline-none focus:ring-2 focus:ring-brand-bronze disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Category
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
