'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  MessageCircle,
} from 'lucide-react';
import { BRAND_INFO } from '@/lib/products-data';

export default function HeroBanner() {
  const slides = [
    {
      title: 'Premium Lawn 3-Pieces & Luxury Collections',
      tagline: 'Curated Exclusively by Farjana',
      description:
        'Exquisite zardozi embellishments, rich raw silk suits, and romantic organza dupattas designed to make every moment unforgettable.',
      image:
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85',
      link: '/shop?category=morja',
      cta: 'Shop Morja & 3-Pieces',
      badge: 'Boutique Exclusive',
    },
    {
      title: 'Royal Dhakai Jamdani & Silk Sarees',
      tagline: 'Festive & Heritage Collection 2026',
      description:
        'Indulge in time-honored Bangladeshi handloom artistry. Pure 84-count Dhakai Jamdani, Katan Silk, and hand-painted Muslin crafted for life’s grandest celebrations.',
      image:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85',
      link: '/shop?category=sarees',
      cta: 'Explore Sarees',
      badge: 'Heritage Masterpieces',
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden bg-[#141014] text-white">
      {/* Background Image with Gradient Overlay */}
      <div className="relative min-h-[560px] md:min-h-[640px] flex items-center">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center brightness-75"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#141014] via-[#141014]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141014] via-transparent to-black/40" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 w-full">
          <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Gold Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#781326]/80 border border-[#c99834]/50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#f5e6a8]" />
              <span className="text-xs font-semibold tracking-wider text-[#f5e6a8] uppercase font-serif">
                {slide.badge}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#c99834] uppercase font-sans">
                {slide.tagline}
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                {slide.title}
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#e8dece]/90 leading-relaxed font-light max-w-xl">
              {slide.description}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href={slide.link}
                className="px-8 py-3.5 rounded-xl bg-[#c99834] text-[#141014] font-bold text-sm hover:bg-[#dfb743] shadow-lg hover:shadow-[#c99834]/30 transition-all flex items-center gap-2 group"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={BRAND_INFO.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f5e6a8] font-semibold text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#1877f2]" />
                <span>Message Farjana</span>
              </a>
            </div>

            {/* Bottom mini perks */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-3 gap-4 text-[11px] text-[#e8dece]/80">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#c99834] shrink-0" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c99834] shrink-0" />
                <span>bKash & Nagad Pay</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#c99834] shrink-0" />
                <span>Artisan Handcrafted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? 'w-8 bg-[#c99834]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
