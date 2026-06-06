import mongoose, { Schema, model, models } from 'mongoose';

export interface ISettings {
  _id: mongoose.Types.ObjectId | string;
  siteName: string;
  logo: string;
  tagline: string;
  brochureUrl?: string;
  hero: {
    title: string;
    subtitle: string;
    bgImage: string;
    ctaText: string;
  };
  about: {
    story: string;
    mission: string;
    vision: string;
    image: string;
  };
  contact: {
    whatsappNumber: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  footer: {
    copyright: string;
    aboutText: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, default: 'Nayyarslocks' },
    logo: { type: String, default: '' },
    tagline: { type: String, default: 'Premium Locking Systems & Security Solutions' },
    brochureUrl: { type: String, default: '' },
    hero: {
      title: { type: String, default: 'Uncompromised Security, Premium Craftsmanship' },
      subtitle: { type: String, default: 'Discover our advanced range of padlocks, smart locks, and security hardware built to protect what matters most.' },
      bgImage: { type: String, default: '' },
      ctaText: { type: String, default: 'Explore Products' },
    },
    about: {
      story: { type: String, default: 'Nayyarslocks has been a trusted name in security hardware, providing heavy-duty, dependable locking systems for homes and businesses.' },
      mission: { type: String, default: 'To manufacture and supply world-class security locking systems ensuring safety and peace of mind for our customers.' },
      vision: { type: String, default: 'To become the premier choice for locking solutions, recognized for durability, cutting-edge technology, and client satisfaction.' },
      image: { type: String, default: '' },
    },
    contact: {
      whatsappNumber: { type: String, default: '9219595948' },
      phone: { type: String, default: '9219595948' },
      email: { type: String, default: 'info@nayyarslocks.com' },
      address: { type: String, default: 'Main Market, Security Hub Road, City Center' },
      hours: { type: String, default: 'Monday - Saturday: 9:00 AM - 7:00 PM (Closed Sunday)' },
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    seo: {
      metaTitle: { type: String, default: 'Nayyarslocks | Premium Locks & Security Solutions' },
      metaDescription: { type: String, default: 'Shop premium locks including padlocks, smart locks, deadbolts, and door handles from Nayyarslocks. Durable, secure, and modern designs.' },
      keywords: { type: [String], default: ['locks', 'smart locks', 'padlocks', 'security locks', 'door locks', 'nayyarslocks'] },
    },
    footer: {
      copyright: { type: String, default: '© 2026 Nayyarslocks. All rights reserved.' },
      aboutText: { type: String, default: 'Nayyarslocks stands for robust lock security. We build products with high grade materials to provide maximum safety and reliability.' },
    },
  },
  { timestamps: true }
);

export const Settings = models.Settings || model('Settings', SettingsSchema);
