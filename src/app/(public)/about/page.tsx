import React from 'react';
import Image from 'next/image';
import { Compass, Eye, ShieldCheck, HeartHandshake } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import { getSiteSettings } from '@/lib/settings';

export const revalidate = 60;

export default async function AboutPage() {
  await dbConnect();
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || 'Nayyarslocks';

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-bronze">Our Story</span>
          <h1 className="text-4xl font-extrabold text-gray-950 mt-2">Crafting Security Since 1996</h1>
          <p className="text-sm text-gray-500 mt-4 font-medium leading-relaxed">
            Learn about Nayyarslocks&apos; journey to becoming one of the most reliable and premium security hardware manufacturers.
          </p>
        </div>

        {/* Story details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 text-left">
            <h2 className="text-2xl font-extrabold text-gray-950 mb-6">The Legacy of {siteName}</h2>
            <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">
              {settings?.about?.story ||
                'Founded with a dedication to security and precision engineering, Nayyarslocks has grown into a leading manufacturer and provider of high-security locking systems. We utilize high-grade solid brass, carbon steel, and smart-biometric circuits to create products that combine timeless strength with futuristic innovation. Every lock bearing the Nayyars name is rigorously tested against pry, bump, drill, and environmental wearing.'}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              We serve over 500,000 satisfied homeowners, institutional buildings, and warehouse hubs, ensuring they rest easy knowing their entryways are secured by our lock sets.
            </p>
          </div>
          <div className="lg:col-span-5 relative aspect-square w-full">
            <div className="absolute inset-0 rounded-3xl bg-brand-bronze/5 p-4 border border-brand-bronze/10 shadow-sm">
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={settings?.about?.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'}
                  alt="Nayyars Locks Workshop"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="rounded-3xl border border-gray-150 p-8 bg-gray-50/50 flex flex-col items-start text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-bronze text-white mb-6 shadow-md shadow-brand-bronze/20">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-3">Our Mission</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {settings?.about?.mission ||
                'To manufacture and deliver top-grade lock safety systems that secure lives and assets, maintaining unmatched customer trust and product integrity.'}
            </p>
          </div>
          <div className="rounded-3xl border border-gray-150 p-8 bg-gray-50/50 flex flex-col items-start text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-bronze text-white mb-6 shadow-md shadow-brand-bronze/20">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-3">Our Vision</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {settings?.about?.vision ||
                'To shape the future of locks engineering across the globe, recognized as the hallmark of durable protection and state-of-the-art keyless smart integration.'}
            </p>
          </div>
        </div>

        {/* Brand Values */}
        <div className="border-t border-gray-100 pt-16 text-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-bronze mb-10">Our Core Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-4">
              <ShieldCheck className="h-8 w-8 text-brand-bronze mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Security-First</h4>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                We make zero compromises when choosing materials or testing cylinder tolerances.
              </p>
            </div>
            <div className="p-4">
              <HeartHandshake className="h-8 w-8 text-brand-bronze mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Absolute Integrity</h4>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Transparent business coordinates, high quality specifications, and responsive guarantees.
              </p>
            </div>
            <div className="p-4">
              <Eye className="h-8 w-8 text-brand-bronze mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Customer Trust</h4>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Providing responsive customer support and direct sales channel on WhatsApp.
              </p>
            </div>
            <div className="p-4">
              <Compass className="h-8 w-8 text-brand-bronze mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Continuous Innovation</h4>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Expanding our keyless smart fingerprint and Wi-Fi locks to match global tech.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
