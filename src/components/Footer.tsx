import React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { FacebookIcon } from '@/components/Icons';
import { BRAND_INFO, CATEGORIES } from '@/lib/products-data';

export default function Footer() {
  return (
    <footer className="bg-[#141014] text-[#e8dece] pt-16 pb-8 border-t border-[#c99834]/30">
      {/* Brand Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#781326] flex items-center justify-center text-[#f5e6a8] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#f5e6a8]">100% Authentic Handloom</h4>
              <p className="text-xs text-[#a39a9f]">Master artisan crafted pieces</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#781326] flex items-center justify-center text-[#f5e6a8] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#f5e6a8]">All Bangladesh Delivery</h4>
              <p className="text-xs text-[#a39a9f]">Cash on delivery available</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#781326] flex items-center justify-center text-[#f5e6a8] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#f5e6a8]">bKash & Nagad Verified</h4>
              <p className="text-xs text-[#a39a9f]">Secure manual transaction checks</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-full bg-[#781326] flex items-center justify-center text-[#f5e6a8] shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#f5e6a8]">Easy Exchange</h4>
              <p className="text-xs text-[#a39a9f]">Hassle-free 3-day size exchange</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl font-extrabold tracking-[0.2em] text-[#f5e6a8]">
                NAQSH
              </span>
              <span className="text-[11px] tracking-[0.35em] text-[#c99834] font-medium uppercase font-sans">
                BY FARJANA
              </span>
            </div>
            <p className="text-xs text-[#c2b7be] leading-relaxed max-w-sm">
              {BRAND_INFO.description} Crafted with love, heritage weaves, and royal aesthetics to celebrate the elegance of every woman.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={BRAND_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Facebook Page"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href={`https://wa.me/${BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h3 className="font-serif text-sm font-bold text-[#f5e6a8] uppercase tracking-wider mb-4">
              Collections
            </h3>
            <ul className="space-y-2 text-xs text-[#b8aeb5]">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="hover:text-[#f5e6a8] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="text-[#c99834] font-semibold hover:underline">
                  View All Outfits →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="font-serif text-sm font-bold text-[#f5e6a8] uppercase tracking-wider mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2 text-xs text-[#b8aeb5]">
              <li>
                <Link href="/track" className="hover:text-[#f5e6a8] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-[#f5e6a8] transition-colors">
                  Size Guide & Measurements
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-[#f5e6a8] transition-colors">
                  Delivery & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#f5e6a8] transition-colors">
                  About Farjana & Our Artisans
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#f5e6a8] transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-white/40 hover:text-white/80 transition-colors">
                  Boutique Portal (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Payment */}
          <div>
            <h3 className="font-serif text-sm font-bold text-[#f5e6a8] uppercase tracking-wider mb-4">
              Dhaka Studio
            </h3>
            <ul className="space-y-3 text-xs text-[#b8aeb5]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c99834] shrink-0 mt-0.5" />
                <span>{BRAND_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c99834] shrink-0" />
                <span>{BRAND_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c99834] shrink-0" />
                <span>{BRAND_INFO.email}</span>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-white/10">
              <span className="text-[11px] text-[#8e858a] block mb-2 font-medium">
                Payment Options Accepted:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                <span className="px-2 py-1 rounded-sm bg-[#e2136e] text-white">bKash</span>
                <span className="px-2 py-1 rounded-sm bg-[#f7941d] text-white">Nagad</span>
                <span className="px-2 py-1 rounded-sm bg-[#781326] text-[#f5e6a8]">Cash On Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-[#8e858a] gap-4">
        <p>© {new Date().getFullYear()} NAQSH by Farjana. All rights reserved.</p>
        <p className="flex items-center gap-2 text-[11px]">
          <span>Cloudflare Edge Hosted</span>
          <span>•</span>
          <span>Powered by Supabase PostgreSQL</span>
        </p>
      </div>
    </footer>
  );
}
