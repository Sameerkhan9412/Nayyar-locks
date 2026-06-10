'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, Save, X, Loader2, Eye } from 'lucide-react';
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
  parent?: string | null;
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
  const [parentCategory, setParentCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [previewProduct, setPreviewProduct] = useState<any | null>(null);
  const [previewActiveImage, setPreviewActiveImage] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

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
    setParentCategory('');
    setSubCategory('');
    setImages([]);
    setIsActive(true);
    setIsFeatured(false);
    setIsBestseller(false);
    setIsNewArrival(false);
  };

  const handleEdit = (prod: ProductItem) => {
    setEditingId(prod._id);
    setName(prod.name);
    setSlug(prod.slug);
    
    const catId = typeof prod.category === 'object' && prod.category ? prod.category._id : (prod.category as string) || '';
    const matchedCat = categories.find((c) => c._id === catId);
    if (matchedCat && matchedCat.parent) {
      setParentCategory(matchedCat.parent);
      setSubCategory(catId);
    } else {
      setParentCategory(catId);
      setSubCategory('');
    }

    setImages(prod.images || []);
    setIsActive(prod.isActive);
    setIsFeatured(prod.isFeatured);
    setIsBestseller(prod.isBestseller);
    setIsNewArrival(prod.isNewArrival);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const finalCategory = subCategory || parentCategory;
    if (!finalCategory) {
      setError('Please select a product category');
      return;
    }

    if (images.length === 0) {
      setError('Please upload or provide at least one product image.');
      return;
    }

    setSaving(true);

    const payload = {
      name,
      slug,
      category: finalCategory,
      images: images,
      isActive,
      isFeatured,
      isBestseller,
      isNewArrival,
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

  const handleView = (prod: ProductItem) => {
    let catName = 'Lock';
    let subCatName = '';
    
    const catId = typeof prod.category === 'object' && prod.category ? prod.category._id : (prod.category as string) || '';
    const matchedCat = categories.find((c) => c._id === catId);
    if (matchedCat) {
      if (matchedCat.parent) {
        const parentCat = categories.find((c) => c._id === matchedCat.parent);
        catName = parentCat ? parentCat.name : '';
        subCatName = matchedCat.name;
      } else {
        catName = matchedCat.name;
      }
    }

    setPreviewProduct({
      ...prod,
      displayParentCategory: catName,
      displaySubCategory: subCatName,
    });
    setPreviewActiveImage(prod.images[0] || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=800&auto=format&fit=crop&q=80');
  };

  const handleFormPreview = () => {
    let catName = 'Lock';
    let subCatName = '';
    const parentCatObj = categories.find(c => c._id === parentCategory);
    if (parentCatObj) {
      catName = parentCatObj.name;
    }
    const subCatObj = categories.find(c => c._id === subCategory);
    if (subCatObj) {
      subCatName = subCatObj.name;
    }

    setPreviewProduct({
      name: name || 'Untitled Product',
      displayParentCategory: catName,
      displaySubCategory: subCatName,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=800&auto=format&fit=crop&q=80'],
    });
    setPreviewActiveImage(images[0] || 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=800&auto=format&fit=crop&q=80');
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
                    let displayCategory = 'Lock';
                    if (typeof prod.category === 'object' && prod.category) {
                      const catObj = prod.category as any;
                      const fullCat = categories.find((c) => c._id === catObj._id);
                      if (fullCat && fullCat.parent) {
                        const parentCat = categories.find((c) => c._id === fullCat.parent);
                        displayCategory = parentCat ? `${parentCat.name} > ${catObj.name}` : catObj.name;
                      } else {
                        displayCategory = catObj.name;
                      }
                    }
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
                                  {displayCategory}
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
                              type="button"
                              onClick={() => handleView(prod)}
                              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:text-brand-bronze hover:bg-brand-bronze/5 hover:border-brand-bronze/25 transition-all"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(prod)}
                              className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:text-brand-bronze hover:bg-brand-bronze/5 hover:border-brand-bronze/25 transition-all"
                              title="Edit item"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(prod._id)}
                              className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-all"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-category-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                <select
                  id="prod-category-input"
                  required
                  value={parentCategory}
                  onChange={(e) => {
                    setParentCategory(e.target.value);
                    setSubCategory('');
                  }}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((cat) => !cat.parent)
                    .map((parentCat) => (
                      <option key={parentCat._id} value={parentCat._id}>
                        {parentCat.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prod-subcategory-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sub Category</label>
                <select
                  id="prod-subcategory-input"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!parentCategory}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">None (Optional)</option>
                  {categories
                    .filter((cat) => cat.parent === parentCategory)
                    .map((subCat) => (
                      <option key={subCat._id} value={subCat._id}>
                        {subCat.name}
                      </option>
                    ))}
                </select>
              </div>
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
              <button
                type="button"
                onClick={handleFormPreview}
                className="flex-1 rounded-xl border border-brand-bronze/35 bg-brand-bronze/5 py-3.5 text-xs font-bold text-brand-bronze hover:bg-brand-bronze/10 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Eye className="h-4 w-4" />
                Preview Product
              </button>
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
      {/* Product Details Preview Modal (Large View Screen) */}
      {previewProduct && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setPreviewProduct(null)}
        >
          <div 
            className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/70">
              <div className="text-left">
                <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                  <span>{previewProduct.name}</span>
                  {previewProduct.SKU && !previewProduct.SKU.startsWith('SKU-') && (
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-mono">
                      SKU: {previewProduct.SKU}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                  Product Details Preview Screen
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="rounded-full bg-white border border-gray-200 p-2 text-gray-500 hover:text-gray-900 hover:shadow transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Image Gallery */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 border border-gray-200 shadow-inner">
                    <Image
                      src={previewActiveImage}
                      alt={previewProduct.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                  {previewProduct.images && previewProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {previewProduct.images.map((img: string, idx: number) => {
                        const isActive = previewActiveImage === img;
                        return (
                          <button
                            key={`${img}-${idx}`}
                            type="button"
                            onClick={() => setPreviewActiveImage(img)}
                            className={`relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 transition-all ${
                              isActive
                                ? 'border-2 border-brand-bronze ring-2 ring-brand-bronze/10'
                                : 'border border-gray-200 hover:border-brand-bronze/40'
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`Preview view ${idx + 1}`}
                              fill
                              sizes="100px"
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  {/* Category & Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-brand-bronze bg-brand-bronze/10 border border-brand-bronze/20 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {previewProduct.displayParentCategory}
                    </span>
                    {previewProduct.displaySubCategory && (
                      <span className="text-[10px] text-gray-500 bg-gray-100 border border-gray-200 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {previewProduct.displaySubCategory}
                      </span>
                    )}
                    {previewProduct.brand && previewProduct.brand !== 'Nayyars' && (
                      <span className="text-[10px] text-gray-500 bg-gray-100 border border-gray-200 font-bold uppercase px-2 py-0.5 rounded">
                        Brand: {previewProduct.brand}
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  {Number(previewProduct.price) > 0 && (
                    <div className="flex items-baseline gap-3">
                      <p className="text-3xl font-extrabold text-gray-900">₹{Number(previewProduct.price).toLocaleString('en-IN')}</p>
                      {Number(previewProduct.originalPrice) > Number(previewProduct.price) && (
                        <>
                          <span className="text-base text-gray-400 line-through font-semibold">
                            ₹{Number(previewProduct.originalPrice).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                            {Math.round(((previewProduct.originalPrice - previewProduct.price) / previewProduct.originalPrice) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Attributes Grid */}
                  {((previewProduct.material && previewProduct.material !== 'N/A' && previewProduct.material !== '') || 
                    (previewProduct.keyType && previewProduct.keyType !== 'N/A' && previewProduct.keyType !== '') || 
                    (previewProduct.securityGrade && previewProduct.securityGrade !== 'N/A' && previewProduct.securityGrade !== '')) && (
                    <div className="grid grid-cols-3 gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      {previewProduct.material && previewProduct.material !== 'N/A' && previewProduct.material !== '' && (
                        <div className="text-center border-r border-gray-200">
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Material</span>
                          <span className="text-xs font-extrabold text-gray-800 mt-0.5 block">{previewProduct.material}</span>
                        </div>
                      )}
                      {previewProduct.keyType && previewProduct.keyType !== 'N/A' && previewProduct.keyType !== '' && (
                        <div className="text-center border-r border-gray-200">
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Key Type</span>
                          <span className="text-xs font-extrabold text-gray-800 mt-0.5 block">{previewProduct.keyType}</span>
                        </div>
                      )}
                      {previewProduct.securityGrade && previewProduct.securityGrade !== 'N/A' && previewProduct.securityGrade !== '' && (
                        <div className="text-center">
                          <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Security</span>
                          <span className="text-xs font-extrabold text-gray-800 mt-0.5 block">{previewProduct.securityGrade}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Descriptions */}
                  {((previewProduct.shortDescription && previewProduct.shortDescription !== 'No short description provided.' && previewProduct.shortDescription !== '') || 
                    (previewProduct.description && previewProduct.description !== 'No description provided.' && previewProduct.description !== '')) && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overview</h4>
                      {previewProduct.shortDescription && previewProduct.shortDescription !== 'No short description provided.' && previewProduct.shortDescription !== '' && (
                        <p className="text-sm font-semibold text-gray-850 leading-relaxed italic bg-amber-50/30 border border-amber-100/50 p-3 rounded-xl">
                          {previewProduct.shortDescription}
                        </p>
                      )}
                      {previewProduct.description && previewProduct.description !== 'No description provided.' && previewProduct.description !== '' && (
                        <p className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-line">
                          {previewProduct.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {((previewProduct.features && previewProduct.features.length > 0) || 
                (previewProduct.specifications && Object.keys(previewProduct.specifications).length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                  {/* Key Features */}
                  {previewProduct.features && previewProduct.features.length > 0 && (
                    <div className="space-y-3 text-left">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Key Features</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {previewProduct.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold text-gray-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-bronze flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technical Specifications */}
                  {previewProduct.specifications && Object.keys(previewProduct.specifications).length > 0 && (
                    <div className="space-y-3 text-left">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Technical Specifications</h4>
                      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                        <table className="w-full text-xs text-left">
                          <tbody className="divide-y divide-gray-200">
                            {Object.entries(previewProduct.specifications).map(([key, val]: any) => (
                              <tr key={key} className="hover:bg-gray-50/50">
                                <td className="px-4 py-3 font-bold text-gray-500 bg-gray-50/50 w-1/3 border-r border-gray-200">{key}</td>
                                <td className="px-4 py-3 font-semibold text-gray-800">{val}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 animate-pulse select-none">
                Live Preview Mode
              </span>
              <button
                type="button"
                onClick={() => setPreviewProduct(null)}
                className="rounded-xl bg-brand-black hover:bg-brand-black/90 text-white px-5 py-2 text-xs font-bold shadow-md transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
