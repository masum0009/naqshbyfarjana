'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice, buildCartWhatsAppOrderLink } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#f4eee2] flex items-center justify-center text-[#781326] mx-auto">
          <ShoppingBag className="w-8 h-8 opacity-40" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#141215]">Your Shopping Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
          Explore our signature Jamdanis, 3-piece ensembles, and luxury partywear.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 rounded-full bg-[#781326] text-[#f5e6a8] font-bold text-xs hover:bg-[#500a18] transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const whatsappLink = buildCartWhatsAppOrderLink(items, subtotal);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="flex items-center justify-between pb-6 border-b border-[#e8dece]">
        <div>
          <span className="text-xs font-bold text-[#c99834] uppercase tracking-widest font-serif">
            Shopping Bag
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#141215]">
            Review Your Outfits ({totalItems})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-700 hover:underline font-medium"
        >
          Empty Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Items list */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize}`}
              className="p-5 rounded-3xl bg-white border border-[#e8dece] shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <div className="w-20 h-24 rounded-2xl bg-[#f4eee2] overflow-hidden shrink-0 border border-[#e8dece]">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-[#8e858a] uppercase font-bold font-mono">
                    {item.product.sku}
                  </span>
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-serif font-bold text-sm sm:text-base text-[#141215] hover:text-[#781326] block line-clamp-1"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-xs text-[#781326] font-semibold mt-0.5">
                    Selected Size: {item.selectedSize}
                  </p>
                  <p className="text-xs font-bold text-[#c99834] mt-1">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
              </div>

              {/* Controls and subtotal */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="flex items-center border border-[#e8dece] rounded-xl bg-[#fbf8f3] px-1">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                    }
                    className="p-1.5 hover:text-[#781326]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#141215]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                    }
                    className="p-1.5 hover:text-[#781326]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-serif font-bold text-base text-[#141215]">
                  {formatPrice(item.product.price * item.quantity)}
                </span>

                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8dece] shadow-md space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#141215] pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#6e686c]">
                <span>Items Subtotal:</span>
                <span className="font-bold text-[#141215]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6e686c]">
                <span>Delivery Charge:</span>
                <span className="text-[#0b4e39] font-medium">Inside Dhaka ৳80 / Outside ৳150</span>
              </div>
              <div className="flex justify-between text-base font-serif font-extrabold text-[#781326] pt-3 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-xl text-[#c99834]">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/checkout"
                className="w-full py-4 px-6 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-xs sm:text-sm hover:bg-[#500a18] shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366] text-[#0d7d3b] hover:text-white font-bold text-xs border border-[#25d366]/40 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Quick Order via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
