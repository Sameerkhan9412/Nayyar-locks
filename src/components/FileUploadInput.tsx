'use client';

import React, { useState, useRef } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadInputProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function FileUploadInput({
  id,
  value,
  onChange,
  placeholder = 'https://example.com/brochure.pdf',
  required = false,
}: FileUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (allowing PDFs or images)
    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      setError('Please select a PDF brochure or an image file.');
      return;
    }

    // Reset state
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.error || 'Failed to upload file.');
      }
    } catch (err) {
      console.error('Frontend upload error:', err);
      setError('Connection failure while uploading file.');
    } finally {
      setUploading(false);
      // Clear file input value to allow selecting same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center gap-2">
        <input
          type="text"
          id={id}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={handleUploadClick}
          className="h-10 px-4 rounded-xl border border-brand-bronze text-brand-bronze hover:bg-brand-bronze/5 disabled:opacity-50 flex items-center justify-center gap-1.5 text-xs font-bold transition-all flex-shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload File
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,image/*"
          className="hidden"
        />
      </div>

      {error && (
        <div className="flex items-start gap-1 text-[11px] font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 font-sans">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
