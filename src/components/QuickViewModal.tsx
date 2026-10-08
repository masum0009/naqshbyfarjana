'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { formatPrice, buildWhatsAppOrderLink } from '@/lib/utils';
import { BRAND_INFO } from '@/lib/products-data';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Free Size');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) * 100
      )
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  const whatsappLink = buildWhatsAppOrderLink({
    title: product.title,
    sku: product.sku,
    size: selectedSize,
    price: product.price,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-[#fbf8f3] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#c99834]/40 z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-[#781326] hover:text-white shadow-md text-gray-600 transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#f4eee2] border border-[#e8dece] relative shadow-inner">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#781326] text-[#f5e6a8] text-xs font-bold uppercase shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-[#781326] scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8e858a] uppercase tracking-wider mb-1">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-[#c99834] font-mono">{product.sku}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141215] leading-snug">
                {product.title}
              </h2>

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#f4eee2] text-[#781326] border border-[#e8dece]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-serif text-2xl font-extrabold text-[#781326]">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
                {product.in_stock === false || (product.stock_count !== undefined && product.stock_count <= 0) ? (
                  <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                    Stock Out
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[#0b4e39] bg-[#0b4e39]/10 px-2.5 py-0.5 rounded-full">
                    In Stock & Ready to Ship
                  </span>
                )}
              </div>

              <p className="text-xs text-[#554e53] mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Fabric Details */}
              <div className="mt-4 p-3 rounded-xl bg-[#f4eee2] border border-[#e8dece] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#7d757a]">Fabric:</span>
                  <span className="font-semibold text-[#221e22]">{product.fabric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d757a]">Color:</span>
                  <span className="font-semibold text-[#221e22]">{product.color}</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-5">
                <label className="block text-xs font-bold text-[#2e292d] uppercase tracking-wider mb-2">
                  Select Size / Option:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-[#781326] text-[#f5e6a8] font-bold shadow-md border border-[#781326]'
                          : 'bg-white text-[#423c40] border border-[#e8dece] hover:border-[#c99834]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#e8dece]">
              <div className="flex gap-3">
                {product.in_stock === false || (product.stock_count !== undefined && product.stock_count <= 0) ? (
                  <div className="flex-1 py-3.5 px-6 rounded-xl bg-gray-200 text-gray-500 font-bold text-sm text-center">
                    Currently Stock Out
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-sm hover:bg-[#500a18] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-5 h-5 text-green-400" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                )}

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-xl bg-[#25d366] text-white hover:bg-[#1eb956] shadow-md transition-all flex items-center justify-center gap-2"
                  title="Inquire or Order on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs font-bold">Inquire / Order</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#7d757a] pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#c99834]" />
                  Cash on Delivery Available
                </span>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-[#781326] font-bold hover:underline"
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
