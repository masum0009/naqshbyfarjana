'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { FacebookIcon } from '@/components/Icons';
import { BRAND_INFO } from '@/lib/products-data';

export default function FloatingSocials() {
  const cleanNumber = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
      {/* Facebook Messenger Floating Bubble */}
      <a
        href={BRAND_INFO.messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-[#0084ff] text-white p-3 rounded-full shadow-lg hover:scale-105 transition-all"
        title="Message us on Facebook"
        aria-label="Chat on Facebook Messenger"
      >
        <span className="hidden group-hover:inline text-xs font-semibold px-2">
          Chat on Messenger
        </span>
        <FacebookIcon className="w-6 h-6" />
      </a>

      {/* WhatsApp Floating Bubble */}
      <a
        href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
          'Assalamu Alaikum NAQSH by Farjana! 🌸 I am browsing your online store and have a question.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-[#25d366] text-white p-3.5 rounded-full shadow-xl hover:scale-105 transition-all glow-gold"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <span className="hidden group-hover:inline text-xs font-semibold px-2">
          Order on WhatsApp
        </span>
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
