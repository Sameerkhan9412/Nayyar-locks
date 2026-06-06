'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle, Trash2, Eye, Reply, Star } from 'lucide-react';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages || []);
        if (data.messages && data.messages.length > 0 && !activeMessage) {
          // Default to first message
          setActiveMessage(data.messages[0]);
          // Mark as read if not already read
          if (!data.messages[0].isRead) {
            markStatus(data.messages[0]._id, 'isRead', true);
          }
        }
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Messages load error:', err);
      setError('Connection error loading messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const markStatus = async (id: string, field: 'isRead' | 'isReplied', value: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update local state
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, [field]: value } : msg))
        );
        if (activeMessage && activeMessage._id === id) {
          setActiveMessage((prev) => (prev ? { ...prev, [field]: value } : null));
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message? This action is permanent.')) {
      return;
    }

    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Message deleted successfully');
        const updated = messages.filter((msg) => msg._id !== id);
        setMessages(updated);
        setActiveMessage(updated.length > 0 ? updated[0] : null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete message');
      }
    } catch (err) {
      console.error('Delete message error:', err);
      setError('Connection error deleting message');
    }
  };

  const handleSelectMessage = (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      markStatus(msg._id, 'isRead', true);
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
          <h2 className="text-xl font-extrabold text-gray-900">Inquiry Inbox</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Review and manage contact submissions from website visitors
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

      {messages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-240px)] min-h-[500px]">
          {/* Messages list (Left pane) */}
          <div className="lg:col-span-5 border border-gray-200 rounded-2xl bg-white overflow-y-auto flex flex-col divide-y divide-gray-150">
            {messages.map((msg) => {
              const isSelected = activeMessage?._id === msg._id;
              return (
                <button
                  key={msg._id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex flex-col gap-2 relative ${
                    isSelected ? 'bg-red-50/30' : ''
                  }`}
                >
                  {/* Selection indicator bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm ${!msg.isRead ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>
                      {msg.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <h5 className={`text-xs truncate ${!msg.isRead ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                    {msg.subject}
                  </h5>

                  <div className="flex items-center gap-2 mt-1">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      msg.isRead ? 'bg-gray-100 text-gray-400' : 'bg-red-600 text-white shadow-sm'
                    }`}>
                      {msg.isRead ? 'Read' : 'New'}
                    </span>
                    {msg.isReplied && (
                      <span className="rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 text-[9px] font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Replied
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Message view details (Right pane) */}
          <div className="lg:col-span-7 border border-gray-200 rounded-2xl bg-white p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            {activeMessage ? (
              <div className="space-y-6">
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
                  <div className="text-left">
                    <h3 className="text-lg font-black text-gray-900 leading-snug">
                      {activeMessage.subject}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-bold">
                      From: <span className="text-gray-700 font-extrabold">{activeMessage.name}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      Date: {new Date(activeMessage.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => markStatus(activeMessage._id, 'isReplied', !activeMessage.isReplied)}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeMessage.isReplied
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Reply className="h-4 w-4" />
                      {activeMessage.isReplied ? 'Replied' : 'Mark Replied'}
                    </button>
                    <button
                      onClick={() => handleDelete(activeMessage._id)}
                      className="rounded-xl border border-red-200 bg-red-50 text-red-600 px-3 py-2 text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1.5"
                      title="Delete inquiry"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-xs font-semibold text-gray-600 border border-gray-150">
                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Email Address</span>
                    <a href={`mailto:${activeMessage.email}`} className="text-red-600 font-extrabold hover:underline break-all">
                      {activeMessage.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Phone Number</span>
                    <a href={`tel:${activeMessage.phone}`} className="text-gray-800 font-extrabold hover:underline">
                      {activeMessage.phone}
                    </a>
                  </div>
                </div>

                {/* Message Body */}
                <div className="rounded-xl border border-gray-100 p-6 bg-white shadow-inner min-h-[150px] text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Message Body</h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-semibold whitespace-pre-line">
                    {activeMessage.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-sm font-bold">No inquiry selected.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400 mb-6 border border-gray-100 mx-auto">
            <Mail className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Inbox is Empty</h3>
          <p className="text-sm text-gray-500 max-w-sm mt-2 leading-relaxed mx-auto font-medium">
            You don&apos;t have any customer messages yet. Inquiries submitted via the Contact Us form will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
