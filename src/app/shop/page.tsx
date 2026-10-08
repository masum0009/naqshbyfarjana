'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  Sparkles,
  Search,
  X,
  ChevronDown,
  RotateCcw,
  Tag,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { INITIAL_PRODUCTS, CATEGORIES } from '@/lib/products-data';
import { fetchProducts, fetchCategories } from '@/lib/api-helpers';
import { Product, Category } from '@/types';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const tagParam = searchParams.get('tag') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedTag, setSelectedTag] = useState<string>(tagParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceMax, setPriceMax] = useState<number>(50000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<Category[]>(CATEGORIES);

  // Sync state whenever searchParams changes (e.g. clicking header links)
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
    const tag = searchParams.get('tag') || 'all';
    setSelectedTag(tag);
    const search = searchParams.get('search') || '';
    setSearchQuery(search);
  }, [searchParams]);

  // Load products and categories live from Supabase / cache
  useEffect(() => {
    let isMounted = true;
    fetchProducts().then((data) => {
      if (isMounted && data && data.length > 0) {
        setProductsList(data);
      }
    });
    fetchCategories().then((cats) => {
      if (isMounted && cats && cats.length > 0) {
        setCategoriesList(cats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle category change and update URL
  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    const query = params.toString();
    router.push(query ? `/shop?${query}` : '/shop', { scroll: false });
  };

  // Handle tag change and update URL
  const handleTagSelect = (tag: string) => {
    const nextTag = selectedTag.toLowerCase() === tag.toLowerCase() ? 'all' : tag;
    setSelectedTag(nextTag);
    const params = new URLSearchParams(searchParams.toString());
    if (nextTag === 'all') {
      params.delete('tag');
    } else {
      params.set('tag', nextTag);
    }
    const query = params.toString();
    router.push(query ? `/shop?${query}` : '/shop', { scroll: false });
  };

  // Extract unique tags and counts
  const uniqueTags = useMemo(() => {
    const map = new Map<string, number>();
    productsList.forEach((p) => {
      if (p.is_published !== false && p.tags) {
        p.tags.forEach((t) => {
          const clean = t.trim();
          if (clean) {
            map.set(clean, (map.get(clean) || 0) + 1);
          }
        });
      }
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [productsList]);

  // Extract unique fabrics
  const uniqueFabrics = useMemo(() => {
    const set = new Set<string>();
    productsList.forEach((p) => {
      if (p.fabric) {
        if (p.fabric.includes('Lawn') || p.fabric.includes('Chiffon')) set.add('Luxury Lawn & Chiffon');
        if (p.fabric.includes('Jamdani') || p.fabric.includes('Cotton')) set.add('Cotton / Jamdani');
        if (p.fabric.includes('Silk') || p.fabric.includes('Katan')) set.add('Pure Silk & Katan');
        if (p.fabric.includes('Muslin')) set.add('Bengal Muslin');
        if (p.fabric.includes('Organza')) set.add('Organza');
        if (p.fabric.includes('Velvet')) set.add('Micro-Velvet');
      }
    });
    return Array.from(set);
  }, [productsList]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Exclude unpublished / draft products from shop
      if (product.is_published === false) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && product.category_slug !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag !== 'all') {
        if (!product.tags || !product.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) {
          return false;
        }
      }

      // Fabric filter
      if (selectedFabric !== 'all') {
        const prodFabric = (product.fabric || '').toLowerCase();
        if (selectedFabric === 'Luxury Lawn & Chiffon' && !prodFabric.includes('lawn') && !prodFabric.includes('chiffon')) return false;
        if (selectedFabric === 'Cotton / Jamdani' && !prodFabric.includes('cotton') && !prodFabric.includes('jamdani')) return false;
        if (selectedFabric === 'Pure Silk & Katan' && !prodFabric.includes('silk') && !prodFabric.includes('katan')) return false;
        if (selectedFabric === 'Bengal Muslin' && !prodFabric.includes('muslin')) return false;
        if (selectedFabric === 'Organza' && !prodFabric.includes('organza')) return false;
        if (selectedFabric === 'Micro-Velvet' && !prodFabric.includes('velvet')) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchCategory = product.category.toLowerCase().includes(q);
        const matchTag = product.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSku && !matchCategory && !matchTag) return false;
      }

      // Price filter
      if (product.price > priceMax) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0);
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [productsList, selectedCategory, selectedTag, selectedFabric, searchQuery, priceMax, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setSelectedFabric('all');
    setSearchQuery('');
    setPriceMax(50000);
    setSortBy('featured');
    router.push('/shop', { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-[#c99834] uppercase tracking-widest font-serif block mb-1">
          Boutique Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#141215] tracking-tight">
          NAQSH Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#6e686c] mt-2">
          Browse handcrafted sarees, designer 3-piece sets, festive anarkalis, and bridal ensembles.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-[#e8dece] scrollbar-none">
        <button
          onClick={() => handleCategorySelect('all')}
          className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#781326] text-[#f5e6a8] shadow-md'
              : 'bg-white text-[#423c40] border border-[#e8dece] hover:border-[#c99834]'
          }`}
        >
          All Items ({productsList.length})
        </button>
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.slug
                ? 'bg-[#781326] text-[#f5e6a8] shadow-md'
                : 'bg-white text-[#423c40] border border-[#e8dece] hover:border-[#c99834]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Quick Tags Filter Pills Bar */}
      {uniqueTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e858a] flex items-center gap-1 shrink-0 mr-1">
            <Tag className="w-3 h-3 text-[#c99834]" /> Popular Tags:
          </span>
          <button
            onClick={() => handleTagSelect('all')}
            className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
              selectedTag === 'all'
                ? 'bg-[#c99834] text-white font-bold shadow-xs'
                : 'bg-[#f4eee2] text-[#5e555b] hover:bg-[#ebd9bd]'
            }`}
          >
            All Tags
          </button>
          {uniqueTags.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => handleTagSelect(name)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedTag.toLowerCase() === name.toLowerCase()
                  ? 'bg-[#781326] text-[#f5e6a8] font-bold shadow-xs'
                  : 'bg-[#f4eee2] text-[#5e555b] hover:bg-[#ebd9bd]'
              }`}
            >
              <span>#{name}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#e8dece] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-sm text-[#141215] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#c99834]" />
                <span>Filter & Refine</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#781326] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search within catalog */}
            <div>
              <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Jamdani, Silk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#e8dece] focus:outline-none focus:ring-1 focus:ring-[#781326] bg-[#fbf8f3]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter by Tags */}
            {uniqueTags.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-[#c99834]" />
                  <span>Curated Tags</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => handleTagSelect('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                      selectedTag === 'all'
                        ? 'bg-[#781326] text-[#f5e6a8] font-bold'
                        : 'bg-gray-100 text-[#574e54] hover:bg-[#f4eee2]'
                    }`}
                  >
                    All
                  </button>
                  {uniqueTags.map(({ name, count }) => (
                    <button
                      key={name}
                      onClick={() => handleTagSelect(name)}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition-colors flex items-center gap-1 ${
                        selectedTag.toLowerCase() === name.toLowerCase()
                          ? 'bg-[#781326] text-[#f5e6a8] font-bold'
                          : 'bg-gray-100 text-[#574e54] hover:bg-[#f4eee2]'
                      }`}
                    >
                      <span>#{name}</span>
                      <span className="text-[9px] opacity-70">({count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fabric Type */}
            <div>
              <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-2">
                Fabric Material
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedFabric('all')}
                  className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors flex justify-between ${
                    selectedFabric === 'all'
                      ? 'bg-[#781326]/10 text-[#781326] font-bold'
                      : 'text-[#574e54] hover:bg-[#f4eee2]'
                  }`}
                >
                  <span>All Fabrics</span>
                </button>
                {uniqueFabrics.map((fabric) => (
                  <button
                    key={fabric}
                    onClick={() => setSelectedFabric(fabric)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors flex justify-between ${
                      selectedFabric === fabric
                        ? 'bg-[#781326]/10 text-[#781326] font-bold'
                        : 'text-[#574e54] hover:bg-[#f4eee2]'
                    }`}
                  >
                    <span>{fabric}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-2">
                <span>Max Budget:</span>
                <span className="text-[#781326] font-serif">৳{priceMax.toLocaleString('en-BD')}</span>
              </div>
              <input
                type="range"
                min={4000}
                max={50000}
                step={1000}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#781326] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8e858a] mt-1">
                <span>৳4,000</span>
                <span>৳50,000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#e8dece]">
            <div className="text-xs text-[#6e686c] flex items-center flex-wrap gap-2">
              <span>
                Showing <strong className="text-[#141215]">{filteredProducts.length}</strong> items
              </span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#781326]/10 text-[#781326] px-2 py-0.5 rounded-md font-semibold text-[11px]">
                  {selectedCategory}
                  <button onClick={() => handleCategorySelect('all')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTag !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-[#c99834]/20 text-[#781326] px-2 py-0.5 rounded-md font-semibold text-[11px]">
                  #{selectedTag}
                  <button onClick={() => handleTagSelect('all')} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3 py-1.5 rounded-lg border border-[#e8dece] text-xs font-medium flex items-center gap-1.5 bg-white"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#c99834]" />
                <span>Filters</span>
                {(selectedCategory !== 'all' || selectedTag !== 'all' || selectedFabric !== 'all') && (
                  <span className="w-2 h-2 rounded-full bg-[#781326]" />
                )}
              </button>

              {/* Sort by dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8e858a] hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-[#e8dece] bg-white text-[#221e22] text-xs focus:outline-none focus:ring-1 focus:ring-[#781326]"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#e8dece] p-8 space-y-4">
              <Sparkles className="w-10 h-10 text-[#c99834] mx-auto opacity-50" />
              <h3 className="font-serif text-xl font-bold text-[#141215]">
                No Outfits Found Matching Your Criteria
              </h3>
              <p className="text-xs text-[#7d757a] max-w-sm mx-auto">
                Try clearing your search query or adjusting your category, tag, or fabric filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-[#781326] text-[#f5e6a8] text-xs font-bold hover:bg-[#500a18] transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-[#141215] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#c99834]" />
                <span>Filters & Refine</span>
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-2">
                Categories
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg ${
                    selectedCategory === 'all'
                      ? 'bg-[#781326] text-[#f5e6a8] font-bold'
                      : 'text-[#574e54] hover:bg-[#f4eee2]'
                  }`}
                >
                  All Categories ({productsList.length})
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg ${
                      selectedCategory === cat.slug
                        ? 'bg-[#781326] text-[#f5e6a8] font-bold'
                        : 'text-[#574e54] hover:bg-[#f4eee2]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Tags */}
            {uniqueTags.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#c99834]" />
                  <span>Tags</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleTagSelect('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] ${
                      selectedTag === 'all'
                        ? 'bg-[#781326] text-[#f5e6a8] font-bold'
                        : 'bg-gray-100 text-[#574e54]'
                    }`}
                  >
                    All
                  </button>
                  {uniqueTags.map(({ name, count }) => (
                    <button
                      key={name}
                      onClick={() => handleTagSelect(name)}
                      className={`px-2.5 py-1 rounded-md text-[11px] ${
                        selectedTag.toLowerCase() === name.toLowerCase()
                          ? 'bg-[#781326] text-[#f5e6a8] font-bold'
                          : 'bg-gray-100 text-[#574e54]'
                      }`}
                    >
                      #{name} ({count})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Fabric */}
            <div>
              <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-2">
                Fabric Material
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedFabric('all')}
                  className={`w-full text-left text-xs px-3 py-1.5 rounded-lg ${
                    selectedFabric === 'all'
                      ? 'bg-[#781326]/10 text-[#781326] font-bold'
                      : 'text-[#574e54]'
                  }`}
                >
                  All Fabrics
                </button>
                {uniqueFabrics.map((fabric) => (
                  <button
                    key={fabric}
                    onClick={() => setSelectedFabric(fabric)}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-lg ${
                      selectedFabric === fabric
                        ? 'bg-[#781326]/10 text-[#781326] font-bold'
                        : 'text-[#574e54]'
                    }`}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#781326] text-[#f5e6a8] text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading boutique catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
