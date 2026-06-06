import dbConnect from './dbConnect';
import { Settings } from '../models/Settings';

export async function getSiteSettings() {
  await dbConnect();
  try {
    const settings = await Settings.findOne().lean();
    if (!settings) {
      return {
        siteName: 'Nayyarslocks',
        logo: '',
        tagline: 'Premium Security Locking Systems & Solutions',
        brochureUrl: 'https://drive.google.com/file/d/1nVE7cyiYMmDhZIAcEi_3TQlJ36FKhRUc',
        hero: {
          title: 'Uncompromised Security, Premium Craftsmanship',
          subtitle: 'Discover our advanced range of padlocks, smart biometric locks, mechanical deadbolts, and security hardware engineered to safeguard your world.',
          bgImage: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=1600&auto=format&fit=crop&q=80',
          ctaText: 'Explore Locks Range',
        },
        about: {
          story: 'Founded with a dedication to security and precision engineering, Nayyarslocks has grown into a leading manufacturer and provider of high-security locking systems. We utilize high-grade solid brass, carbon steel, and smart-biometric circuits to create products that combine timeless strength with futuristic innovation.',
          mission: 'To manufacture and deliver top-grade lock safety systems that secure lives and assets.',
          vision: 'To shape the future of locks engineering across the globe, recognized as the hallmark of durable protection.',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        },
        contact: {
          whatsappNumber: '9219595948',
          phone: '9219595948',
          email: 'sales@nayyarslocks.com',
          address: 'Nayyarslocks Industrial Area, Gate No. 2, Security Plaza, New Delhi, 110015',
          hours: 'Monday - Saturday: 9:00 AM - 7:00 PM (Closed on Sunday)',
        },
        socialLinks: {
          facebook: 'https://facebook.com/nayyarslocks',
          instagram: 'https://instagram.com/nayyarslocks',
          twitter: 'https://twitter.com/nayyarslocks',
          linkedin: 'https://linkedin.com/company/nayyarslocks',
        },
        seo: {
          metaTitle: 'Nayyarslocks | Heavy-Duty Brass Padlocks & Smart Keyless Systems',
          metaDescription: 'Secure your residential and commercial properties with Nayyarslocks. Browse our collection of brass padlocks, fingerprint door handles, deadbolts, and heavy gate rim locks.',
          keywords: ['brass locks', 'nayyars locks', 'heavy duty padlocks', 'fingerprint biometric lock'],
        },
        footer: {
          copyright: '© 2026 Nayyarslocks. All rights reserved. Precision crafted for ultimate peace of mind.',
          aboutText: 'Nayyarslocks is a premier manufacturer of premium mechanical locks, high-security deadbolts, and modern smart entrance locking systems designed for ultimate durability.',
        },
      };
    }
    const settingsObj = JSON.parse(JSON.stringify(settings));
    if (!settingsObj.brochureUrl) {
      settingsObj.brochureUrl = 'https://drive.google.com/file/d/1nVE7cyiYMmDhZIAcEi_3TQlJ36FKhRUc';
    }
    return settingsObj;
  } catch (error) {
    console.error('Error fetching settings from database:', error);
    return null;
  }
}
