'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { formatPrice, buildWhatsAppOrderLink } from '@/lib/utils';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) * 100
      )
    : 0;

  const isOutOfStock =
    product.in_stock === false ||
    (product.stock_count !== undefined && product.stock_count <= 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes[0] || 'Free Size';
    addToCart(product, defaultSize, 1);
  };

  const whatsappLink = buildWhatsAppOrderLink({
    title: product.title,
    sku: product.sku,
    price: product.price,
    size: product.sizes[0],
  });

  return (
    <>
      <div
        className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col justify-between ${
          isOutOfStock
            ? 'border-gray-200 opacity-90'
            : 'border-[#e8dece] hover:border-[#c99834]'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f4eee2]">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={
                isHovered && product.images.length > 1
                  ? product.images[1]
                  : product.images[0]
              }
              alt={product.title}
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out ${
                isOutOfStock ? 'grayscale-25' : ''
              }`}
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isOutOfStock ? (
              <span className="px-2.5 py-1 rounded-md bg-[#2d282b] text-[#f4eee2] text-[10px] font-bold tracking-wider uppercase shadow-xs">
                Stock Out
              </span>
            ) : (
              <>
                {discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-md bg-[#781326] text-[#f5e6a8] text-[10px] font-bold tracking-wider uppercase shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.is_bestseller && (
                  <span className="px-2.5 py-1 rounded-md bg-[#c99834] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Bestseller
                  </span>
                )}
                {product.is_new_arrival && (
                  <span className="px-2.5 py-1 rounded-md bg-[#0b4e39] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                    New
                  </span>
                )}
              </>
            )}
          </div>

          {/* Quick Action Overlay Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-[#1e1b20] hover:bg-[#781326] hover:text-white shadow-md transition-all"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-[#25d366] hover:bg-[#25d366] hover:text-white shadow-md transition-all"
              title="Order on WhatsApp"
              aria-label="Order on WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          {/* Bottom quick add hover pill */}
          <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
            {isOutOfStock ? (
              <div className="w-full py-2.5 px-4 rounded-xl bg-gray-800/90 backdrop-blur-xs text-white text-xs font-bold text-center shadow-lg">
                Stock Out
              </div>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="w-full py-2.5 px-4 rounded-xl bg-[#781326] text-[#f5e6a8] text-xs font-bold shadow-lg hover:bg-[#500a18] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add to Bag</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Meta / Content */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#8e858a] mb-1.5 uppercase tracking-wider">
              <span>{product.category}</span>
              <span className="font-mono text-[10px] text-[#c99834] font-semibold">{product.sku}</span>
            </div>

            <Link href={`/product/${product.slug}`} className="block group-hover:text-[#781326] transition-colors">
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#141215] line-clamp-2 leading-snug">
                {product.title}
              </h3>
            </Link>

            <p className="text-xs text-[#6e686c] mt-1 line-clamp-1">
              {product.fabric}
            </p>
          </div>

          {/* Pricing & Order Info */}
          <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-base sm:text-lg font-bold text-[#781326]">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {isOutOfStock ? (
              <span className="text-[11px] font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                Stock Out
              </span>
            ) : (
              <span className="text-[11px] font-medium text-[#0b4e39] bg-[#0b4e39]/10 px-2 py-0.5 rounded-full">
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
