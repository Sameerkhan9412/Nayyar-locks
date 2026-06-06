'use client';

import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Simple validation
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setError('Please fill in all the required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setError('Connection error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="text-xl font-bold text-gray-950 mb-6 border-b border-gray-50 pb-3">
        Send Us a Message
      </h3>

      {success ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-150 p-6 text-center text-emerald-800 flex flex-col items-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 mb-3" />
          <h4 className="font-bold text-base mb-1">Inquiry Submitted!</h4>
          <p className="text-xs text-emerald-700 leading-relaxed font-semibold">
            Thank you for reaching out to Nayyarslocks. Our security specialists will review your message and contact you within 24 business hours.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 text-xs font-bold text-emerald-800 underline hover:text-emerald-900"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-150 p-3.5 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Full Name <span className="text-brand-bronze">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email Address <span className="text-brand-bronze">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Phone Number <span className="text-brand-bronze">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 92195 95948"
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Subject <span className="text-brand-bronze">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Bulk Order Inquiry"
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Message <span className="text-brand-bronze">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your security requirements or product queries here..."
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze font-medium resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-bronze py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-bronze-hover focus:outline-none focus:ring-2 focus:ring-brand-bronze disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending Inquiry...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
