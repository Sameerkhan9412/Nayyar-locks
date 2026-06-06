'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Plus, X, Upload, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
}

export default function MultiImageUpload({ values = [], onChange }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    setUploading(true);

    const uploadedUrls: string[] = [];

    // Loop through files if the user selected multiple (or support single file upload sequentially)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setError('Please select valid image files only (PNG, JPG, WebP).');
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          setError(data.error || 'Failed to upload one of the images.');
        }
      } catch (err) {
        console.error('File upload API error:', err);
        setError('Network error uploading image.');
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...values, ...uploadedUrls]);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = values.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    
    // Simple URL validation
    if (!manualUrl.startsWith('http://') && !manualUrl.startsWith('https://') && !manualUrl.startsWith('/')) {
      setError('Please enter a valid URL (starting with http:// or https://)');
      return;
    }

    onChange([...values, manualUrl.trim()]);
    setManualUrl('');
    setError('');
  };

  return (
    <div className="space-y-3 w-full">
      {/* Thumbnails Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {values.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="group relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-200 shadow-sm transition-all hover:border-brand-bronze/40 hover:shadow-md"
          >
            <Image
              src={url}
              alt={`Product preview ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Hover overlay with Delete Button */}
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="rounded-full bg-red-650 p-2 text-white shadow-lg hover:bg-red-750 transition-colors transform scale-90 group-hover:scale-100 duration-200"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Image Order Badge */}
            <div className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white select-none">
              #{idx + 1}
            </div>
          </div>
        ))}

        {/* Upload Action Card */}
        <button
          type="button"
          disabled={uploading}
          onClick={handleUploadClick}
          className="relative aspect-square w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center p-3 transition-all hover:border-brand-bronze hover:bg-brand-bronze/5 hover:text-brand-bronze disabled:opacity-50 text-gray-500 cursor-pointer"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1.5">
              <Loader2 className="h-6 w-6 animate-spin text-brand-bronze" />
              <span className="text-[11px] font-bold">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <Upload className="h-6 w-6 text-gray-400 group-hover:text-brand-bronze transition-colors" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Add Image</span>
              <span className="text-[9px] text-gray-400">PNG, JPG, WebP</span>
            </div>
          )}
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {/* Manual URL Input Add-on */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="Or paste external image URL here"
          className="flex-1 rounded-xl border border-gray-300 px-3.5 py-2 text-xs outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
        />
        <button
          type="button"
          onClick={handleAddManualUrl}
          className="h-8 px-3 rounded-lg bg-gray-100 border border-gray-250 text-gray-700 hover:bg-gray-200 transition-all text-[11px] font-bold flex-shrink-0"
        >
          Add URL
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-1 text-[11px] font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 mt-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
