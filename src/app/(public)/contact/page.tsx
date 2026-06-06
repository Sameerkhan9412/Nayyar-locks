import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import { getSiteSettings } from '@/lib/settings';
import ContactForm from '@/components/ContactForm';

export const revalidate = 60;

export default async function ContactPage() {
  await dbConnect();
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || 'Nayyarslocks';
  const whatsappNumber = settings?.contact?.whatsappNumber || '9219595948';
  const phone = settings?.contact?.phone || '9219595948';
  const email = settings?.contact?.email || 'sales@nayyarslocks.com';
  const address = settings?.contact?.address || 'Nayyarslocks Industrial Area, Gate No. 2, Security Plaza, New Delhi, 110015';
  const hours = settings?.contact?.hours || 'Monday - Saturday: 9:00 AM - 7:00 PM (Closed on Sunday)';

  const formattedWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
  const generalCtaMessage = `Hi ${siteName}, I am visiting your contact page and would like to get in touch.`;
  const generalWhatsappUrl = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(generalCtaMessage)}`;

  return (
    <div className="py-16 bg-gray-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-bronze">Get In Touch</span>
          <h1 className="text-4xl font-extrabold text-gray-950 mt-2">Connect With Security Experts</h1>
          <p className="text-sm text-gray-500 mt-4 font-medium leading-relaxed">
            Have questions about our lock features, bulk commercial distribution, or smart installations? Reach out via form or WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <div className="rounded-3xl border border-gray-150 bg-white p-6 sm:p-8 shadow-sm flex flex-col gap-6">
              <h3 className="text-xl font-bold text-gray-950 mb-2 border-b border-gray-50 pb-3">
                Business Coordinates
              </h3>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20 flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Headquarters</h4>
                  <p className="text-sm text-gray-700 font-semibold mt-1 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20 flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone Support</h4>
                  <p className="text-sm text-gray-700 font-semibold mt-1">
                    <a href={`tel:${phone}`} className="hover:text-brand-bronze transition-colors">
                      {phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20 flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Sales</h4>
                  <p className="text-sm text-gray-700 font-semibold mt-1 break-all">
                    <a href={`mailto:${email}`} className="hover:text-brand-bronze transition-colors">
                      {email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-bronze/10 text-brand-bronze border border-brand-bronze/20 flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Office Hours</h4>
                  <p className="text-sm text-gray-700 font-semibold mt-1 leading-relaxed">
                    {hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call-out */}
            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-3xl bg-emerald-500 py-5 text-white transition-all hover:bg-emerald-600 shadow-xl shadow-emerald-100 text-base font-bold"
            >
              <MessageSquare className="h-6 w-6 fill-current" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
