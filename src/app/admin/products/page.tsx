'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import MultiImageUpload from '@/components/MultiImageUpload';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  } | string;
  images: string[];
  SKU: string;
  brand: string;
  price: number;
  originalPrice: number;
  material: string;
  keyType: string;
  securityGrade: string;
  features: string[];
  specifications: Record<string, string>;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  whatsappOverride?: string;
}

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [SKU, setSKU] = useState('');
  const [brand, setBrand] = useState('Nayyars');
  const [price, setPrice] = useState('0');
  const [originalPrice, setOriginalPrice] = useState('0');
  const [material, setMaterial] = useState('');
  const [keyType, setKeyType] = useState('');
  const [securityGrade, setSecurityGrade] = useState('');
  const [featuresStr, setFeaturesStr] = useState('');
  const [specificationsStr, setSpecificationsStr] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [whatsappOverride, setWhatsappOverride] = useState('');

  const loadData = async () => {
    try {
      const prodRes = await fetch('/api/products?admin=true');
      const prodData = await prodRes.json();

      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();

      if (prodRes.ok && prodData.success) {
        setProducts(prodData.products || []);
      } else {
        setError(prodData.error || 'Failed to load products');
      }

      if (catRes.ok && catData.success) {
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error('Products load error:', err);
      setError('Connection error loading data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
    setDescription('');
    setShortDescription('');
    setCategory('');
    setImages([]);
    setSKU('');
    setBrand('Nayyars');
    setPrice('0');
    setOriginalPrice('0');
    setMaterial('');
    setKeyType('');
    setSecurityGrade('');
    setFeaturesStr('');
    setSpecificationsStr('');
    setTagsStr('');
    setIsActive(true);
    setIsFeatured(false);
    setIsBestseller(false);
    setIsNewArrival(false);
    setWhatsappOverride('');
  };

  const handleEdit = (prod: ProductItem) => {
    setEditingId(prod._id);
    setName(prod.name);
    setSlug(prod.slug);
    setDescription(prod.description);
    setShortDescription(prod.shortDescription);
    setCategory(
      typeof prod.category === 'object' && prod.category ? prod.category._id : (prod.category as string) || ''
    );
    setImages(prod.images || []);
    setSKU(prod.SKU);
    setBrand(prod.brand);
    setPrice(String(prod.price));
    setOriginalPrice(String(prod.originalPrice));
    setMaterial(prod.material);
    setKeyType(prod.keyType);
    setSecurityGrade(prod.securityGrade);
    setFeaturesStr(prod.features?.join('\n') || '');

    // Parse specifications map back to key:value string rows
    const specRows = prod.specifications
      ? Object.entries(prod.specifications)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
      : '';
    setSpecificationsStr(specRows);

    setTagsStr(prod.tags?.join(', ') || '');
    setIsActive(prod.isActive);
    setIsFeatured(prod.isFeatured);
    setIsBestseller(prod.isBestseller);
    setIsNewArrival(prod.isNewArrival);
    setWhatsappOverride(prod.whatsappOverride || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!category) {
      setError('Please select a product category');
      return;
    }

    if (images.length === 0) {
      setError('Please upload or provide at least one product image.');
      return;
    }

    setSaving(true);

    // Parse specifications text area (format: Key: Value, key2: value2)
    const specifications: Record<string, string> = {};
    specificationsStr.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.includes(':')) {
        const parts = trimmed.split(':');
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        if (key && val) {
          specifications[key] = val;
        }
      }
    });

    const payload = {
      name,
      slug,
      description,
      shortDescription,
      category,
      images: images,
      SKU,
      brand,
      price: Number(price),
      originalPrice: Number(originalPrice),
      material,
      keyType,
      securityGrade,
      features: featuresStr
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
      specifications,
      tags: tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      isActive,
      isFeatured,
      isBestseller,
      isNewArrival,
      whatsappOverride: whatsappOverride || undefined,
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(editingId ? 'Product updated successfully!' : 'Product created successfully!');
        resetForm();
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to submit product');
      }
    } catch (err) {
      console.error('Product submit error:', err);
      setError('Connection error submitting product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This is permanent.')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Product deleted successfully');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Product delete error:', err);
      setError('Connection error deleting product');
    }
  };

  const toggleFlag = async (prod: ProductItem, flag: 'isActive' | 'isFeatured' | 'isBestseller' | 'isNewArrival') => {
    try {
      const res = await fetch(`/api/products/${prod._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...prod,
          [flag]: !prod[flag],
          category: typeof prod.category === 'object' && prod.category ? prod.category._id : prod.category,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((item) => (item._id === prod._id ? { ...item, [flag]: !item[flag] } : item))
        );
      }
    } catch (err) {
      console.error('Toggle flag error:', err);
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
          <h2 className="text-xl font-extrabold text-gray-900">Product Management</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Manage your hardware catalog items, prices, descriptions, and feature lists
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Products List (Left panel) */}
        <div className="xl:col-span-7 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-150">
                  <tr>
                    <th className="px-4 py-4">Product Detail</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4 text-center">Status</th>
                    <th className="px-4 py-4 text-center">Badges</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {products.map((prod) => {
                    const catName =
                      typeof prod.category === 'object' && prod.category ? prod.category.name : '';
                    return (
                      <tr key={prod._id} className="hover:bg-gray-50/50 font-semibold text-gray-700">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-200">
                              <Image
                                src={prod.images[0] || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=100&auto=format&fit=crop'}
                                alt={prod.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-gray-900 line-clamp-1">{prod.name}</h4>
                              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
                                <span>SKU: {prod.SKU}</span>
                                <span>•</span>
                                <span className="text-[10px] text-brand-bronze bg-brand-bronze/10 border border-brand-bronze/20 font-bold uppercase px-1 rounded">
                                  {catName || 'Lock'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="font-extrabold text-gray-900">₹{prod.price.toLocaleString('en-IN')}</p>
                          {prod.originalPrice > prod.price && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => toggleFlag(prod, 'isActive')}
                            className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase transition-all ${
                              prod.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                          >
                            {prod.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => toggleFlag(prod, 'isFeatured')}
                              className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase transition-all border ${
                                prod.isFeatured
                                  ? 'bg-amber-50 text-amber-700 border-amber-250'
                                  : 'bg-gray-50 text-gray-400 border-gray-150'
                              }`}
                            >
                              Featured
                            </button>
                            <button
                              onClick={() => toggleFlag(prod, 'isBestseller')}
                              className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase transition-all border ${
                                prod.isBestseller
                                  ? 'bg-brand-bronze/10 text-brand-bronze border-brand-bronze/20'
                                  : 'bg-gray-50 text-gray-400 border-gray-150'
                              }`}
                            >
                              Bestseller
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(prod)}
                              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-650 hover:text-brand-bronze hover:bg-brand-bronze/5 hover:border-brand-bronze/25 transition-all"
                              title="Edit item"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(prod._id)}
                              className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-650 hover:bg-red-100 transition-all"
                              title="Delete item"
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
              No products found in database.
            </div>
          )}
        </div>

        {/* Product Form (Right panel) */}
        <div className="xl:col-span-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-50 pb-3 mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left max-h-[600px] overflow-y-auto pr-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-name-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</label>
              <input
                type="text"
                id="prod-name-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Brass Mortise Lock"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-slug-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">URL Slug</label>
                <input
                  type="text"
                  id="prod-slug-input"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-sku-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">SKU Code</label>
                <input
                  type="text"
                  id="prod-sku-input"
                  required
                  value={SKU}
                  onChange={(e) => setSKU(e.target.value)}
                  placeholder="NY-ML-BR-45"
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-brand-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</label>
                <input
                  type="text"
                  id="prod-brand-input"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-category-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                <select
                  id="prod-category-input"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-price-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹)</label>
                <input
                  type="number"
                  id="prod-price-input"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-orig-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Original Price (₹)</label>
                <input
                  type="number"
                  id="prod-orig-input"
                  required
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-material-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider text-[10px]">Material</label>
                <input
                  type="text"
                  id="prod-material-input"
                  required
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Brass"
                  className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-key-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider text-[10px]">Key Type</label>
                <input
                  type="text"
                  id="prod-key-input"
                  required
                  value={keyType}
                  onChange={(e) => setKeyType(e.target.value)}
                  placeholder="Dimple Key"
                  className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-grade-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider text-[10px]">Security Grade</label>
                <input
                  type="text"
                  id="prod-grade-input"
                  required
                  value={securityGrade}
                  onChange={(e) => setSecurityGrade(e.target.value)}
                  placeholder="Grade 4"
                  className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-override-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Number Override (Optional)</label>
              <input
                type="text"
                id="prod-override-input"
                value={whatsappOverride}
                onChange={(e) => setWhatsappOverride(e.target.value)}
                placeholder="Defaults to setting WhatsApp if empty"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Images</label>
              <MultiImageUpload
                values={images}
                onChange={setImages}
              />
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                Upload images directly using Cloudinary or add external URLs dynamically.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-short-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Description</label>
              <input
                type="text"
                id="prod-short-input"
                required
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-desc-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Detailed Description</label>
              <textarea
                id="prod-desc-input"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-features-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Features List (One per line)</label>
              <textarea
                id="prod-features-input"
                value={featuresStr}
                onChange={(e) => setFeaturesStr(e.target.value)}
                rows={3}
                placeholder="Hardened shackle&#10;Anti-drill plate&#10;Pick resistant core"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze resize-none font-sans"
              ></textarea>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-specs-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specifications (Format: Key: Value, one per line)</label>
              <textarea
                id="prod-specs-input"
                value={specificationsStr}
                onChange={(e) => setSpecificationsStr(e.target.value)}
                rows={3}
                placeholder="Body Width: 50 mm&#10;Shackle Clearance: 25 mm&#10;Weight: 350 grams"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze resize-none font-sans"
              ></textarea>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="prod-tags-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tags (Comma-separated)</label>
              <input
                type="text"
                id="prod-tags-input"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="brass, padlock, outdoor, heavy-duty"
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded text-brand-bronze focus:ring-brand-bronze"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded text-brand-bronze focus:ring-brand-bronze"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="h-4 w-4 rounded text-brand-bronze focus:ring-brand-bronze"
                />
                Bestseller
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="h-4 w-4 rounded text-brand-bronze focus:ring-brand-bronze"
                />
                New Arrival
              </label>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-3.5 text-xs font-bold text-gray-650 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-brand-bronze py-3.5 text-xs font-bold text-white transition-all hover:bg-brand-bronze-hover focus:outline-none focus:ring-2 focus:ring-brand-bronze disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Product
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
