'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProductDetailClient from './product/[slug]/ProductDetailClient';

export default function NotFound() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient && pathname && pathname.startsWith('/product/')) {
    const slug = pathname.replace('/product/', '').replace(/\/$/, '');
    if (slug) {
      return <ProductDetailClient slug={slug} />;
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24 bg-[#faf7f2]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-[#e8dece] shadow-sm">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#fceddf] text-[#781326] font-bold text-xs uppercase tracking-widest">
          404 Not Found
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#141215]">Page Not Found</h1>
        <p className="text-sm text-[#736a6e] leading-relaxed">
          The artisanal outfit or boutique page you are looking for does not exist or may have been relocated.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#781326] text-[#f5e6a8] font-bold text-xs hover:bg-[#5e0e1d] transition-colors"
          >
            Explore Collections
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#e8dece] text-[#3d383b] font-bold text-xs hover:bg-[#faf7f2] transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
