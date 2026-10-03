'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Share2,
  Check,
  Maximize2,
  X,
} from 'lucide-react';
import { FacebookIcon } from '@/components/Icons';
import { INITIAL_PRODUCTS, BRAND_INFO } from '@/lib/products-data';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { formatPrice, buildWhatsAppOrderLink } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('naqsh_custom_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductsList(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const product =
    productsList.find((p) => p.slug === slug) ||
    INITIAL_PRODUCTS.find((p) => p.slug === slug);

  const productImages: string[] = React.useMemo(() => {
    if (!product?.images) return [];
    const imgs = Array.isArray(product.images) ? product.images : [product.images];
    return imgs.filter((img) => typeof img === 'string' && img.trim().length > 0);
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Free Size');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync selected state whenever the product changes
  React.useEffect(() => {
    setActiveImageIndex(0);
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product?.id, product?.slug]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#141215]">Outfit Not Found</h2>
        <p className="text-sm text-gray-600">The product you are looking for may have been updated or sold out.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 rounded-full bg-[#781326] text-[#f5e6a8] font-bold text-xs"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const currentActiveImage =
    productImages[activeImageIndex] ||
    productImages[0] ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80';

  const handleNextImage = () => {
    if (productImages.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % productImages.length);
    }
  };

  const handlePrevImage = () => {
    if (productImages.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    }
  };

  const discountPercent = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) * 100
      )
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const whatsappLink = buildWhatsAppOrderLink({
    title: product.title,
    sku: product.sku,
    size: selectedSize,
    price: product.price,
  });

  const relatedProducts = productsList
    .filter((p) => p.id !== product.id && p.category_slug === product.category_slug)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#8e858a] mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#781326]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#781326]">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/shop?category=${product.category_slug}`}
          className="hover:text-[#781326]"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#141215] font-semibold truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-[#f4eee2] border border-[#e8dece] relative shadow-lg group">
            {/* Display ONLY the current active product image */}
            <img
              src={currentActiveImage}
              alt={`${product.title} - View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-md bg-[#781326] text-[#f5e6a8] text-xs font-bold uppercase shadow-md">
                  {discountPercent}% OFF
                </span>
              )}
              {product.is_bestseller && (
                <span className="px-3 py-1 rounded-md bg-[#c99834] text-white text-xs font-bold uppercase shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Bestseller
                </span>
              )}
            </div>

            {/* Quick Action Overlay: Zoom & Share */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="p-2.5 rounded-full bg-white/85 backdrop-blur-xs text-[#141215] hover:bg-white hover:text-[#781326] shadow-md transition-all cursor-pointer"
                title="Zoom image"
                aria-label="Zoom image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/85 backdrop-blur-xs text-[#141215] hover:bg-white shadow-md transition-all cursor-pointer"
                title="Share Outfit"
                aria-label="Share Outfit"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Navigation Chevrons when multiple images exist */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 backdrop-blur-xs text-[#141215] hover:bg-white hover:text-[#781326] shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 cursor-pointer"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 backdrop-blur-xs text-[#141215] hover:bg-white hover:text-[#781326] shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 cursor-pointer"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Counter Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-medium z-10">
                  {activeImageIndex + 1} / {productImages.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails Strip - Only showing this product's pictures */}
          {productImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#781326] ring-2 ring-[#781326]/30 scale-105 shadow-md opacity-100'
                      : 'border-[#e8dece] opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {activeImageIndex === idx && (
                    <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#781326]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info, Price, Size Selection, and Ordering Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#8e858a] uppercase tracking-wider mb-2">
              <span className="text-[#781326]">{product.category}</span>
              <span className="font-mono text-[#c99834] bg-[#c99834]/10 px-2 py-0.5 rounded-md">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215] leading-snug">
              {product.title}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-4 mt-4 p-4 rounded-2xl bg-white border border-[#e8dece] shadow-xs">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#781326]">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              <span className="text-xs font-bold text-[#0b4e39] bg-[#0b4e39]/10 px-3 py-1 rounded-full ml-auto">
                In Stock ({product.stock_count} units left)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#554e53] leading-relaxed">
            {product.description}
          </p>

          {/* Attributes */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#f4eee2] border border-[#e8dece] text-xs">
            <div>
              <span className="text-[#7d757a] block text-[11px] uppercase tracking-wider">
                Fabric Material
              </span>
              <span className="font-bold text-[#221e22] mt-0.5 block">
                {product.fabric}
              </span>
            </div>
            <div>
              <span className="text-[#7d757a] block text-[11px] uppercase tracking-wider">
                Color Palette
              </span>
              <span className="font-bold text-[#221e22] mt-0.5 block">
                {product.color}
              </span>
            </div>
          </div>

          {/* Size Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#2e292d] uppercase tracking-wider">
                Select Size / Dimension:
              </label>
              <Link
                href="/size-guide"
                className="text-xs text-[#781326] underline font-medium"
              >
                Size Guide & Measurements
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedSize === size
                      ? 'bg-[#781326] text-[#f5e6a8] shadow-md border border-[#781326]'
                      : 'bg-white text-[#423c40] border border-[#e8dece] hover:border-[#c99834]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Order Actions */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-6 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-sm hover:bg-[#500a18] shadow-lg transition-all flex items-center justify-center gap-2"
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

              <button
                onClick={handleBuyNow}
                className="w-full py-4 px-6 rounded-xl bg-[#c99834] text-[#141014] font-bold text-sm hover:bg-[#dfb743] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buy Now (Cash on Delivery)</span>
              </button>
            </div>

            {/* Social Direct Buy Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#25d366]/15 hover:bg-[#25d366] text-[#0d7d3b] hover:text-white font-bold text-xs border border-[#25d366]/40 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </a>

              <a
                href={BRAND_INFO.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#1877f2]/15 hover:bg-[#1877f2] text-[#1877f2] hover:text-white font-bold text-xs border border-[#1877f2]/40 transition-all flex items-center justify-center gap-2"
              >
                <FacebookIcon className="w-4 h-4" />
                <span>Ask on Messenger</span>
              </a>
            </div>
          </div>

          {/* Delivery & Trust highlights */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8dece] space-y-3 shadow-xs">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#c99834] shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-[#141215]">Fast Nationwide Delivery:</strong>
                <p className="text-[#6e686c] mt-0.5">
                  Inside Dhaka: 1–2 Days (৳80) • Outside Dhaka: 3–5 Days (৳150)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
              <ShieldCheck className="w-5 h-5 text-[#c99834] shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-[#141215]">Payment Verification:</strong>
                <p className="text-[#6e686c] mt-0.5">
                  Cash on Delivery or instant bKash / Nagad payment confirmation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
              <RotateCcw className="w-5 h-5 text-[#c99834] shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-[#141215]">3-Day Easy Size Exchange:</strong>
                <p className="text-[#6e686c] mt-0.5">
                  If you need a different size, Farjana’s team arranges replacement courier.
                </p>
              </div>
            </div>
          </div>

          {/* Details & Care info */}
          {product.details && product.details.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-serif font-bold text-sm text-[#141215] uppercase tracking-wider">
                Craftsmanship & Key Highlights
              </h3>
              <ul className="space-y-1 text-xs text-[#554e53]">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#c99834] shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.care_instructions && product.care_instructions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <h3 className="font-serif font-bold text-sm text-[#141215] uppercase tracking-wider">
                Fabric Care Instructions
              </h3>
              <ul className="space-y-1 text-xs text-[#554e53]">
                {product.care_instructions.map((care, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#781326] font-bold">•</span>
                    <span>{care}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#e8dece]">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#c99834] uppercase tracking-widest font-serif block mb-1">
              Matching Styles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#141215]">
              You May Also Love
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* High-Resolution Product Image Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all z-20 cursor-pointer"
            aria-label="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={currentActiveImage}
              alt={`${product.title} High Resolution`}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />

            {/* Lightbox Navigation Chevrons */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Thumbnail selector inside lightbox */}
            {productImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 max-w-full">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#f5e6a8] scale-105'
                        : 'border-white/30 opacity-50 hover:opacity-90'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
