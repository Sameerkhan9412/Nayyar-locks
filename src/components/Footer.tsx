import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from './SocialIcons';

interface FooterProps {
  siteName: string;
  logo?: string;
  contact: {
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
  footer: {
    copyright: string;
    aboutText: string;
  };
  brochureUrl?: string;
}

export default function Footer({ siteName, logo, contact, socialLinks, footer, brochureUrl }: FooterProps) {
  return (
    <footer className="border-t border-gray-150 bg-gray-950 text-gray-300">
      {/* Top Footer Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center self-start hover:opacity-95 transition-opacity">
              {logo ? (
                <div className="relative h-10 w-32">
                  <Image
                    src={logo}
                    alt={siteName}
                    fill
                    sizes="128px"
                    className="object-contain object-left"
                    priority
                  />
                </div>
              ) : (
                <div className="flex flex-col bg-brand-black px-4 py-1.5 border-y-2 border-brand-bronze text-white select-none rounded-sm">
                  <span className="text-[11px] font-black tracking-[0.35em] font-sans leading-none">NAYYARS</span>
                </div>
              )}
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              {footer.aboutText}
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-2">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gray-800 p-2 hover:bg-brand-bronze hover:text-white transition-all text-gray-400">
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gray-800 p-2 hover:bg-brand-bronze hover:text-white transition-all text-gray-400">
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gray-800 p-2 hover:bg-brand-bronze hover:text-white transition-all text-gray-400">
                  <TwitterIcon className="h-4 w-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gray-800 p-2 hover:bg-brand-bronze hover:text-white transition-all text-gray-400">
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              {brochureUrl && (
                <li>
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors text-brand-bronze font-semibold"
                  >
                    Download Brochure
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Business Hours
            </h3>
            <div className="flex gap-2.5 text-sm text-gray-400">
              <Clock className="h-5 w-5 text-brand-bronze flex-shrink-0" />
              <span>{contact.hours}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contact Details
            </h3>
            <ul className="flex flex-col gap-3.5 text-sm text-gray-400">
              <li className="flex gap-2.5">
                <MapPin className="h-5 w-5 text-brand-bronze flex-shrink-0" />
                <span>{contact.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone className="h-5 w-5 text-brand-bronze flex-shrink-0" />
                <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail className="h-5 w-5 text-brand-bronze flex-shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors break-all">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t border-gray-800 bg-gray-950/80 py-6 text-center text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>{footer.copyright}</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-white transition-colors">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
