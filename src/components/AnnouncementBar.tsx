'use client';

import React from 'react';
import { Phone, Sparkles, Truck } from 'lucide-react';
import { FacebookIcon } from '@/components/Icons';
import { BRAND_INFO } from '@/lib/products-data';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#460813] text-[#f4eee2] text-xs py-2 px-4 border-b border-[#c99834]/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#e5ba55] animate-pulse" />
          <span>
            <strong className="text-[#f5e6a8]">Festive 2026 Collection</strong> — Free Delivery across Bangladesh on orders over ৳3,000!
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#e8dece]/90">
          <a
            href={BRAND_INFO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#f5e6a8] transition-colors"
          >
            <FacebookIcon className="w-3.5 h-3.5 text-[#1877f2]" />
            <span>FB: @NAQSH.by.Farjana</span>
          </a>
          <span className="hidden sm:inline text-[#c99834]/50">•</span>
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#c99834]" />
            <span>Cash on Delivery Available</span>
          </span>
          <span className="hidden sm:inline text-[#c99834]/50">•</span>
          <a
            href={`tel:${BRAND_INFO.phone}`}
            className="hidden lg:flex items-center gap-1 hover:text-[#f5e6a8] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#c99834]" />
            <span>Hotline: {BRAND_INFO.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
