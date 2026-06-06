'use client';

import React from 'react';

interface FloatingWhatsappProps {
  phoneNumber: string;
  siteName: string;
}

export default function FloatingWhatsapp({ phoneNumber, siteName }: FloatingWhatsappProps) {
  const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
  const message = `Hi ${siteName || 'Nayyars'}, I am interested in your security locking systems. Please share details.`;
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      aria-label="Contact us on WhatsApp"
    >
      <svg
        className="h-8 w-8 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436.002 9.851-4.388 9.854-9.807.002-2.623-1.013-5.088-2.86-6.937C16.4 1.993 13.97 1.01 11.999 1.01c-5.444 0-9.866 4.399-9.87 9.822-.001 1.542.41 3.05 1.19 4.388L2.24 19.92l4.407-1.157h.001zm11.535-7.312c-.3-.15-1.771-.875-2.046-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-1.206-.604-2.126-1.054-2.926-1.745-.615-.533-1.025-1.189-1.145-1.39-.12-.2-.013-.308.087-.408.09-.09.2-.233.3-.35.1-.117.133-.2.2-.333.067-.133.033-.25-.017-.35-.05-.1-.475-1.146-.65-1.571-.17-.417-.34-.36-.475-.367-.12-.004-.26-.005-.4-.005-.14 0-.37.053-.56.26-.19.207-.73.713-.73 1.738 0 1.025.746 2.013.85 2.15.1.137 1.467 2.24 3.553 3.14 1.57.676 2.19.742 2.978.625.534-.08 1.637-.67 1.87-1.318.232-.647.232-1.2.163-1.318-.07-.118-.262-.19-.562-.34z" />
      </svg>
    </a>
  );
}
