'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  MapPin,
  Heart,
  Sparkles,
  Phone,
  ShieldCheck,
  Send,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { BRAND_INFO, CATEGORIES } from '@/lib/products-data';

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Collection', href: '/shop' },
    { name: 'Morja Lawn', href: '/shop?category=morja' },
    { name: 'Gul Banu', href: '/shop?category=gul-banu' },
    { name: 'Noor-E-Jahan', href: '/shop?category=noor-e-jahan' },
    { name: 'Heritage Sarees', href: '/shop?category=sarees' },
    { name: 'Track Order', href: '/track' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fbf8f3]/95 backdrop-blur-md border-b border-[#e8dece] transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-[#781326] hover:text-[#c99834] transition-colors focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#781326] hover:text-[#c99834] transition-colors focus:outline-none ml-1"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-block group">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-[#600c1c] uppercase group-hover:text-[#c99834] transition-colors">
                    NAQSH
                  </span>
                  <span className="text-[10px] tracking-[0.35em] text-[#c99834] font-medium uppercase -mt-1 font-sans">
                    BY FARJANA
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-all relative py-1 ${
                      isActive
                        ? 'text-[#781326] font-semibold'
                        : 'text-[#3d383b] hover:text-[#781326]'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c99834] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e8dece] bg-white text-xs text-[#6e686c] hover:border-[#c99834] hover:text-[#781326] transition-all"
                aria-label="Search products"
              >
                <Search className="w-3.5 h-3.5 text-[#c99834]" />
                <span>Search catalog...</span>
              </button>

              {/* Facebook Messenger Quick Order Button */}
              <a
                href={BRAND_INFO.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2] hover:text-white transition-all text-xs font-medium"
                title="Message on Facebook"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Messenger</span>
              </a>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-[#781326] text-white hover:bg-[#500a18] transition-all shadow-sm flex items-center justify-center"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#f5e6a8]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#c99834] text-white text-[11px] font-bold flex items-center justify-center shadow-xs border-2 border-[#fbf8f3]">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 px-4">
          <div className="bg-[#fbf8f3] rounded-2xl w-full max-w-2xl p-6 shadow-2xl border border-[#c99834]/40 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8dece]">
              <div className="flex items-center gap-2 text-[#781326] font-serif font-bold text-lg">
                <Search className="w-5 h-5 text-[#c99834]" />
                <span>Search NAQSH by Farjana</span>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:text-black hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Saree, 3-Piece, Jamdani, Silk, Kurti, Velvet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-5 py-3.5 pr-12 rounded-xl border border-[#d9af4f] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-white text-[#121013] text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#781326] text-[#f5e6a8] rounded-lg text-xs font-semibold hover:bg-[#500a18] transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-xs font-semibold text-[#8a8086] uppercase tracking-wider mb-2">
                Popular Searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Dhakai Jamdani', 'Emerald 3-Piece', 'Bridal Lehenga', 'Velvet Shawl', 'Muslin Saree', 'Organza Kurti'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        window.location.href = `/shop?search=${encodeURIComponent(term)}`;
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#e8dece] text-[#554d52] hover:border-[#c99834] hover:text-[#781326] hover:bg-[#fcf7ed] transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative ml-0 w-4/5 max-w-sm bg-[#fbf8f3] h-full shadow-2xl flex flex-col justify-between border-r border-[#c99834]/30 z-10 animate-in slide-in-from-left duration-300">
            <div>
              <div className="p-5 border-b border-[#e8dece] flex items-center justify-between bg-[#600c1c] text-white">
                <div>
                  <span className="font-serif text-xl font-extrabold tracking-widest text-[#f5e6a8]">
                    NAQSH
                  </span>
                  <p className="text-[10px] tracking-[0.25em] text-white/80">
                    BY FARJANA
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-[#2d282b] hover:bg-[#f4eee2] hover:text-[#781326] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="p-4 border-t border-[#e8dece]">
                <p className="text-xs font-bold text-[#781326] uppercase tracking-wider mb-2">
                  Browse Categories
                </p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs text-[#554d52] hover:text-[#781326]"
                    >
                      <span>{cat.name}</span>
                      <Sparkles className="w-3 h-3 text-[#c99834]" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#e8dece] bg-[#f4eee2] space-y-3">
              <a
                href={BRAND_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#1877f2] text-white text-xs font-semibold shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Visit Facebook Page</span>
              </a>
              <p className="text-center text-[11px] text-[#6d666b]">
                Hotline: {BRAND_INFO.phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
