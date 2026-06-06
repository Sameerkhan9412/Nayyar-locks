'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Loader2, Globe, Shield, PhoneCall, AlignLeft } from 'lucide-react';
import ImageUploadInput from '@/components/ImageUploadInput';
import FileUploadInput from '@/components/FileUploadInput';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'about' | 'contact' | 'seo'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    siteName: '',
    logo: '',
    tagline: '',
    brochureUrl: '',
    hero: { title: '', subtitle: '', bgImage: '', ctaText: '' },
    about: { story: '', mission: '', vision: '', image: '' },
    contact: { whatsappNumber: '', phone: '', email: '', address: '', hours: '' },
    socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '' },
    seo: { metaTitle: '', metaDescription: '', keywords: [] as string[] },
    footer: { copyright: '', aboutText: '' },
  });

  const [keywordsStr, setKeywordsStr] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (res.ok && data.success && data.settings) {
          setFormData(data.settings);
          setKeywordsStr(data.settings.seo?.keywords?.join(', ') || '');
        } else {
          setError('Failed to fetch settings from server');
        }
      } catch (err) {
        console.error('Settings load error:', err);
        setError('Connection error loading settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleNestedChange = (
    section: 'hero' | 'about' | 'contact' | 'socialLinks' | 'seo' | 'footer',
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    const payload = {
      ...formData,
      seo: {
        ...formData.seo,
        keywords: keywordsStr
          .split(',')
          .map((kw) => kw.trim())
          .filter((kw) => kw.length > 0),
      },
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('Website settings saved successfully!');
        setFormData(data.settings);
        setKeywordsStr(data.settings.seo?.keywords?.join(', ') || '');
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Settings save error:', err);
      setError('Connection error saving settings');
    } finally {
      setSaving(false);
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
          <h2 className="text-xl font-extrabold text-gray-900">Website Configuration</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Edit brand headers, contact parameters, social channels, and SEO fields
          </p>
        </div>
      </div>

      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-150 p-4 text-xs font-semibold text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-150 p-4 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-gray-200 gap-2 font-bold text-xs uppercase tracking-wider overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 font-extrabold ${
            activeTab === 'general'
              ? 'border-brand-bronze text-brand-bronze'
              : 'border-transparent text-gray-500 hover:text-brand-bronze'
          }`}
        >
          <SettingsIcon className="h-4 w-4" />
          General & Hero
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 font-extrabold ${
            activeTab === 'about'
              ? 'border-brand-bronze text-brand-bronze'
              : 'border-transparent text-gray-500 hover:text-brand-bronze'
          }`}
        >
          <AlignLeft className="h-4 w-4" />
          About Content
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 font-extrabold ${
            activeTab === 'contact'
              ? 'border-brand-bronze text-brand-bronze'
              : 'border-transparent text-gray-500 hover:text-brand-bronze'
          }`}
        >
          <PhoneCall className="h-4 w-4" />
          Contact & Social
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 font-extrabold ${
            activeTab === 'seo'
              ? 'border-brand-bronze text-brand-bronze'
              : 'border-transparent text-gray-500 hover:text-brand-bronze'
          }`}
        >
          <Globe className="h-4 w-4" />
          SEO & Footer
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-50 pb-2">
              Branding
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Site Name</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  placeholder="Nayyarslocks"
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Premium Security Locking Systems"
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Logo URL / Image</label>
                <ImageUploadInput
                  value={formData.logo}
                  onChange={(url) => setFormData({ ...formData, logo: url })}
                  placeholder="Logo image URL"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brochure PDF / File</label>
                <FileUploadInput
                  value={formData.brochureUrl || ''}
                  onChange={(url) => setFormData({ ...formData, brochureUrl: url })}
                  placeholder="Upload product catalog/brochure PDF"
                />
              </div>
            </div>

            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-50 pt-4 pb-2">
              Hero Section Settings
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hero Title</label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={(e) => handleNestedChange('hero', 'title', e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hero Subtitle</label>
                <textarea
                  value={formData.hero.subtitle}
                  onChange={(e) => handleNestedChange('hero', 'subtitle', e.target.value)}
                  rows={3}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold resize-none"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hero Call-to-Action Text</label>
                  <input
                    type="text"
                    value={formData.hero.ctaText}
                    onChange={(e) => handleNestedChange('hero', 'ctaText', e.target.value)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hero Background Image URL / File</label>
                  <ImageUploadInput
                    value={formData.hero.bgImage}
                    onChange={(url) => handleNestedChange('hero', 'bgImage', url)}
                    placeholder="Unsplash lock image URL"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-50 pb-2">
              About Editorial Contents
            </h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Our Brand Story</label>
              <textarea
                value={formData.about.story}
                onChange={(e) => handleNestedChange('about', 'story', e.target.value)}
                rows={5}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Our Mission</label>
                <textarea
                  value={formData.about.mission}
                  onChange={(e) => handleNestedChange('about', 'mission', e.target.value)}
                  rows={4}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                ></textarea>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Our Vision</label>
                <textarea
                  value={formData.about.vision}
                  onChange={(e) => handleNestedChange('about', 'vision', e.target.value)}
                  rows={4}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                ></textarea>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Editorial Side Image URL / File</label>
              <ImageUploadInput
                value={formData.about.image}
                onChange={(url) => handleNestedChange('about', 'image', url)}
                placeholder="Unsplash warehouse/locksmith image URL"
              />
            </div>
          </div>
        )}

        {/* Contact & Social Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-50 pb-2">
                Business Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.contact.whatsappNumber}
                    onChange={(e) => handleNestedChange('contact', 'whatsappNumber', e.target.value)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    value={formData.contact.phone}
                    onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Address</label>
                <input
                  type="text"
                  value={formData.contact.address}
                  onChange={(e) => handleNestedChange('contact', 'address', e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operating Business Hours</label>
                <input
                  type="text"
                  value={formData.contact.hours}
                  onChange={(e) => handleNestedChange('contact', 'hours', e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-50 pb-2">
                Social Link Coordinates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Facebook Link</label>
                  <input
                    type="text"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Instagram Link</label>
                  <input
                    type="text"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleNestedChange('socialLinks', 'instagram', e.target.value)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Twitter Link</label>
                  <input
                    type="text"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">LinkedIn Link</label>
                  <input
                    type="text"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleNestedChange('socialLinks', 'linkedin', e.target.value)}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO & Footer Tab */}
        {activeTab === 'seo' && (
          <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-50 pb-2">
              Search Engine Optimization Metadata
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">SEO Meta Title</label>
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">SEO Meta Description</label>
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                  rows={3}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold resize-none"
                ></textarea>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Keywords (Comma-separated)</label>
                <input
                  type="text"
                  value={keywordsStr}
                  onChange={(e) => setKeywordsStr(e.target.value)}
                  placeholder="brass locks, heavy padlocks, smart entrance locks"
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                />
              </div>
            </div>

            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-50 pt-4 pb-2">
              Footer Contents
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Footer Copyright Notice</label>
                <input
                  type="text"
                  value={formData.footer.copyright}
                  onChange={(e) => handleNestedChange('footer', 'copyright', e.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Footer Description Paragraph</label>
                <textarea
                  value={formData.footer.aboutText}
                  onChange={(e) => handleNestedChange('footer', 'aboutText', e.target.value)}
                  rows={3}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-semibold resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-brand-bronze px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-bronze-hover focus:outline-none focus:ring-2 focus:ring-brand-bronze disabled:opacity-50 shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Configuration...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
