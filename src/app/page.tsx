'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
  Star,
  CheckCircle2,
  Award,
  MessageCircle,
} from 'lucide-react';
import HeroBanner from '@/components/HeroBanner';
import FeaturedCategories from '@/components/FeaturedCategories';
import ProductCard from '@/components/ProductCard';
import FacebookPageBadge from '@/components/FacebookPageBadge';
import { INITIAL_PRODUCTS, BRAND_INFO } from '@/lib/products-data';

export default function HomePage() {
  const bestSellers = INITIAL_PRODUCTS.filter((p) => p.is_bestseller).slice(0, 4);
  const newArrivals = INITIAL_PRODUCTS.filter((p) => p.is_new_arrival).slice(0, 4);

  const testimonials = [
    {
      name: 'Nusrat Jahan',
      location: 'Gulshan, Dhaka',
      comment:
        'The Dhakai Jamdani I ordered for my sister’s wedding was simply breathtaking! The fabric is so soft and lightweight. Cash on delivery was super fast too.',
      rating: 5,
      product: 'Heritage Crimson Dhakai Jamdani',
    },
    {
      name: 'Dr. Sabrina Rahman',
      location: 'Chittagong',
      comment:
        'Farjana apu guided me personally on Messenger regarding the size of the Noor-E-Jahan 3-Piece. The fitting is immaculate and zardozi work looks even richer in person.',
      rating: 5,
      product: 'Noor-E-Jahan 3-Piece Suit',
    },
    {
      name: 'Tania Ahmed',
      location: 'Uttara, Dhaka',
      comment:
        'Ordered the hand-painted Muslin saree via bKash payment. Received within 24 hours in beautiful luxury gift packaging. Highly recommended boutique!',
      rating: 5,
      product: 'Gulrukh Floral Muslin Saree',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Carousel */}
      <HeroBanner />

      {/* 2. Featured Categories */}
      <FeaturedCategories />

      {/* 3. Bestselling Masterpieces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#781326]/10 text-[#781326] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#c99834]" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215] tracking-tight">
              Bestselling Royal Creations
            </h2>
            <p className="text-xs sm:text-sm text-[#6e686c] mt-1">
              Hand-picked heritage sarees, Morja lawn 3-piece sets, and festive luxury collections.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#781326] hover:text-[#c99834] transition-colors group"
          >
            <span>View Full Catalog ({INITIAL_PRODUCTS.length}+ Designs)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Designer Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#141014] text-white border border-[#c99834]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Story */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#781326] text-[#f5e6a8] text-xs font-bold uppercase tracking-widest font-serif">
                <Award className="w-4 h-4 text-[#c99834]" />
                <span>The Story of NAQSH</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Reviving Bengal’s Weaving Heritage with a Modern Soul
              </h2>

              <p className="text-xs sm:text-sm text-[#e8dece]/90 leading-relaxed font-light">
                Founded by Farjana, <strong className="text-[#f5e6a8]">NAQSH</strong> celebrates the golden traditions of Bengali handloom. Every thread is spun with purpose, connecting master weavers from Rupganj, Tangail, and Sirajganj to discerning connoisseurs of fashion worldwide.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#f5e6a8]">
                    100%
                  </span>
                  <span className="text-[#b3a8ae] text-[11px]">Authentic Handloom</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#f5e6a8]">
                    50k+
                  </span>
                  <span className="text-[#b3a8ae] text-[11px]">Happy Customers</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-bold text-[#f5e6a8]">
                    64
                  </span>
                  <span className="text-[#b3a8ae] text-[11px]">Districts Covered</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="px-6 py-3 rounded-xl bg-[#c99834] text-[#141014] font-bold text-xs hover:bg-[#dfb743] transition-all"
                >
                  Read Farjana’s Story
                </Link>
                <a
                  href={BRAND_INFO.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white/10 text-[#f5e6a8] border border-white/20 hover:bg-white/20 font-semibold text-xs transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#1877f2]" />
                  <span>Talk with Farjana</span>
                </a>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 h-72 lg:h-full min-h-[380px] relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"
                alt="NAQSH by Farjana Craftsmanship"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#141014] via-[#141014]/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0b4e39]/10 text-[#0b4e39] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0b4e39]" />
              <span>Fresh Off The Loom</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215] tracking-tight">
              New Season Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-[#6e686c] mt-1">
              Be the first to wear the newest additions to Farjana’s boutique wardrobe.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#781326] hover:text-[#c99834] transition-colors group"
          >
            <span>Explore All New Outfits</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Facebook Community Banner */}
      <FacebookPageBadge />

      {/* 7. Client Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#781326]/10 text-[#781326] text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#781326]" />
            <span>Words of Love</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215] tracking-tight">
            What Our Valued Clients Say
          </h2>
          <p className="text-xs sm:text-sm text-[#6e686c] mt-1">
            Real feedback from fashion enthusiasts across Dhaka, Chittagong, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#e8dece] shadow-xs hover:border-[#c99834] hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#c99834]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c99834]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#383336] leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#141215]">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-[#8e858a]">{t.location}</p>
                </div>
                <span className="text-[10px] text-[#781326] font-semibold bg-[#781326]/5 px-2 py-1 rounded-md">
                  Verified Order
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. VIP Newsletter & WhatsApp Club */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-gradient-to-r from-[#600c1c] to-[#781326] p-8 sm:p-12 text-white text-center max-w-4xl mx-auto shadow-xl border border-[#c99834]/40">
          <Sparkles className="w-8 h-8 text-[#f5e6a8] mx-auto mb-3 animate-pulse" />
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
            Join the <span className="text-[#f5e6a8]">NAQSH Privilege Club</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#f4eee2]/90 mt-2 max-w-lg mx-auto leading-relaxed">
            Get exclusive early access to Jamdani pre-orders, secret festive discounts, and private exhibition invitations.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for joining NAQSH Privilege Club! Farjana will be in touch with special previews.');
            }}
            className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              placeholder="Enter your Mobile (017...)"
              required
              className="px-4 py-3 rounded-xl bg-white text-black text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c99834] flex-1"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#c99834] text-[#141014] font-bold text-xs hover:bg-[#dfb743] transition-all shrink-0"
            >
              Get VIP Access
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
