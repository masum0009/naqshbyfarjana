import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  Heart,
  MessageCircle,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { FacebookIcon } from '@/components/Icons';
import { BRAND_INFO } from '@/lib/products-data';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18 space-y-16">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#781326]/10 text-[#781326] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#c99834]" />
          <span>Our Artisanal Legacy</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#141215] leading-tight">
          The Story of NAQSH by Farjana
        </h1>
        <p className="text-xs sm:text-sm text-[#6e686c] leading-relaxed">
          Where timeless Bengali handloom weaves converge with haute couture aesthetics.
        </p>
      </div>

      {/* Main Image Banner */}
      <div className="aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-[#141014] border border-[#c99834]/40 relative shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85"
          alt="Farjana Weaving Heritage"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141014] via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white">
          <span className="text-xs text-[#f5e6a8] font-bold tracking-widest uppercase font-serif">
            Artisanal Perfection
          </span>
          <h2 className="font-serif text-xl sm:text-3xl font-bold mt-1">
            "Every thread carries the soul of a master weaver."
          </h2>
        </div>
      </div>

      {/* Philosophy & Craft */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-[#554e53] leading-relaxed">
          <h3 className="font-serif text-2xl font-bold text-[#141215]">
            Crafted for the Modern Connoisseur
          </h3>
          <p>
            Founded by Farjana, <strong className="text-[#781326]">NAQSH</strong> was born out of an ardent passion for reviving ancient Bangladeshi textile arts. What started as an exclusive boutique Facebook community has blossomed into a cherished home for traditional craftsmanship.
          </p>
          <p>
            From the historic handlooms of <em>Rupganj</em> weaving 84-count Dhakai Jamdanis, to the delicate botanical hand-paintings on fine Bengal Muslin and opulent velvet zardozi bridal attire, every NAQSH piece is an heirloom in the making.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#f4eee2] border border-[#e8dece] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#781326] text-[#f5e6a8] flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#141215]">100% Genuine Handlooms</h4>
              <p className="text-xs text-[#7d757a]">Ethically sourced from heritage weaving clusters.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#781326] text-[#f5e6a8] flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#141215]">Bespoke Custom Stitching</h4>
              <p className="text-xs text-[#7d757a]">Tailored to your specific measurements and preferences.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#781326] text-[#f5e6a8] flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#141215]">Nationwide Trust</h4>
              <p className="text-xs text-[#7d757a]">Cash on Delivery across all 64 districts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#600c1c] text-white text-center space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#f5e6a8]">
          Join Our Daily Journey on Facebook
        </h3>
        <p className="text-xs sm:text-sm text-[#e8dece] max-w-xl mx-auto">
          Catch Farjana’s live design updates, customer fittings, and new fabric drops on our official Facebook Page.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={BRAND_INFO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-[#1877f2] text-white font-bold text-xs hover:bg-[#166fe5] shadow-lg transition-all flex items-center gap-2"
          >
            <FacebookIcon className="w-4 h-4" />
            <span>Visit @NAQSH.by.Farjana</span>
          </a>
          <a
            href={BRAND_INFO.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-white text-[#600c1c] font-bold text-xs hover:bg-[#fbf8f3] shadow-lg transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#1877f2]" />
            <span>Chat Directly with Farjana</span>
          </a>
        </div>
      </div>
    </div>
  );
}
