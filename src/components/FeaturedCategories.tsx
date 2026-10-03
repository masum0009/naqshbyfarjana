'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/products-data';
import { fetchCategories } from '@/lib/api-helpers';
import { Category } from '@/types';

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    fetchCategories().then((data) => {
      if (isMounted && data && data.length > 0) {
        setCategories(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <section className="py-16 bg-[#fbf8f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#781326]/10 text-[#781326] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c99834]" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215] tracking-tight">
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#6e686c] mt-2">
            Discover Farjana’s signature silhouettes, traditional weaves, and festive partywear.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#141014] shadow-sm hover:shadow-xl transition-all duration-300 border border-[#e8dece] hover:border-[#c99834]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141014] via-[#141014]/40 to-transparent" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#f5e6a8] mb-1">
                  Collection
                </span>
                <h3 className="font-serif text-lg font-bold leading-tight text-white group-hover:text-[#f5e6a8] transition-colors">
                  {category.name}
                </h3>
                <p className="text-[11px] text-[#e8dece]/80 mt-1 line-clamp-2 font-light">
                  {category.description}
                </p>

                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#c99834] group-hover:translate-x-1 transition-transform">
                  <span>Explore Outfits</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
