import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsapp from '@/components/FloatingWhatsapp';
import { getSiteSettings } from '@/lib/settings';

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
      <Navbar siteName={siteName} logo={settings?.logo} />
      <main className="flex-1">{children}</main>
      {settings && (
        <Footer
          siteName={siteName}
          logo={settings.logo}
          contact={settings.contact}
          socialLinks={settings.socialLinks}
          footer={settings.footer}
        />
      )}
      <FloatingWhatsapp phoneNumber={whatsappNumber} siteName={siteName} />
    </div>
  );
}
