'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice, buildCartWhatsAppOrderLink } from '@/lib/utils';
import { BRAND_INFO } from '@/lib/products-data';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  if (!isCartOpen) return null;

  const whatsappLink = buildCartWhatsAppOrderLink(items, subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#fbf8f3] h-full shadow-2xl flex flex-col justify-between z-10 border-l border-[#c99834]/30 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#e8dece] flex items-center justify-between bg-[#600c1c] text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#f5e6a8]" />
            <h3 className="font-serif font-bold text-lg text-[#f5e6a8]">Your Shopping Bag</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#c99834] text-white font-bold">
              {totalItems}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#f4eee2] flex items-center justify-center text-[#781326]">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#3d383b]">Your Bag is Empty</h4>
              <p className="text-xs text-[#7d757a] max-w-xs">
                Explore our royal sarees, 3-piece sets, and luxury bridal creations.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#781326] text-[#f5e6a8] text-xs font-semibold hover:bg-[#500a18] transition-all"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="flex gap-4 p-3 bg-white rounded-xl border border-[#e8dece] shadow-xs relative group"
              >
                {/* Image */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#f4eee2] shrink-0 relative">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between pr-6">
                      <h4 className="text-xs font-bold text-[#1e1b20] line-clamp-2">
                        {item.product.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#781326] font-medium mt-0.5">
                      Size: <span className="font-bold">{item.selectedSize}</span>
                    </p>
                    <p className="text-xs font-bold text-[#c99834] mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center border border-[#e8dece] rounded-md bg-[#fbf8f3]">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                        }
                        className="p-1 hover:text-[#781326] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#2b2729]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                        }
                        className="p-1 hover:text-[#781326] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#141215]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#e8dece] bg-white space-y-3 shadow-md">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#6e686c]">
                <span>Subtotal ({totalItems} items):</span>
                <span className="font-bold text-[#1e1b20]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#6e686c]">
                <span>Estimated Delivery:</span>
                <span className="text-[#0b4e39] font-medium">Calculated at Checkout</span>
              </div>
              <div className="flex justify-between text-sm font-serif font-bold text-[#781326] pt-2 border-t border-gray-100">
                <span>Total:</span>
                <span className="text-base text-[#c99834]">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-sm hover:bg-[#500a18] shadow-md transition-all group"
              >
                <span>Proceed to Checkout (COD / bKash)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25d366]/15 text-[#0d7d3b] hover:bg-[#25d366] hover:text-white font-semibold text-xs transition-all border border-[#25d366]/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant Order via WhatsApp</span>
              </a>
            </div>

            <p className="text-[10px] text-center text-[#8e858a]">
              🔒 100% Secure Checkout with Cash on Delivery & bKash / Nagad
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
