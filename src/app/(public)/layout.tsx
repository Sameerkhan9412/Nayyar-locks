import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import { getSiteSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings?.seo?.metaTitle || "Nayyar Locks",
      template: `%s | ${settings?.siteName || "Nayyar Locks"}`
    },
    description: settings?.seo?.metaDescription || "Shop premium locks including padlocks, smart locks, deadbolts, and door handles from Nayyarslocks. Durable, secure, and modern designs.",
    keywords: settings?.seo?.keywords || ["locks", "smart locks", "padlocks", "security locks", "door locks", "nayyarslocks"]
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || 'Nayyarslocks';
  const whatsappNumber = settings?.contact?.whatsappNumber || '9219595948';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar siteName={siteName} logo={settings?.logo} brochureUrl={settings?.brochureUrl} />
      <main className="flex-1">{children}</main>
      {settings && (
        <Footer
          siteName={siteName}
          logo={settings.logo}
          contact={settings.contact}
          socialLinks={settings.socialLinks}
          footer={settings.footer}
          brochureUrl={settings.brochureUrl}
        />
      )}
      <FloatingWhatsapp phoneNumber={whatsappNumber} siteName={siteName} />
    </div>
  );
}
