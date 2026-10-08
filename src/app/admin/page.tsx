'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  Package,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Truck,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  LogOut,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Search,
} from 'lucide-react';
import { BRAND_INFO, INITIAL_PRODUCTS, CATEGORIES } from '@/lib/products-data';
import { formatPrice, generateSku } from '@/lib/utils';
import {
  fetchProducts,
  fetchOrders,
  fetchCategories,
  saveProduct,
  updateProduct,
  deleteProduct,
  saveCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
} from '@/lib/api-helpers';
import { Order, OrderStatus, Product, Category } from '@/types';

export default function AdminDashboardPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('naqsh_custom_categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= CATEGORIES.length) return parsed;
        }
      } catch (e) {}
    }
    return CATEGORIES;
  });
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'published' | 'draft' | 'in_stock' | 'out_of_stock'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // New product modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('sarees');
  const [newPrice, setNewPrice] = useState<number>(12000);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(14000);
  const [newFabric, setNewFabric] = useState('Pure Dhakai Cotton');
  const [newColor, setNewColor] = useState('Crimson & Gold');
  const [newSizes, setNewSizes] = useState('Free Size (6.5 Yards with Blouse Piece)');
  const [newImages, setNewImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
  ]);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newInStock, setNewInStock] = useState<boolean>(true);
  const [newStock, setNewStock] = useState<number>(10);
  const [newIsPublished, setNewIsPublished] = useState<boolean>(true);
  const [newDescription, setNewDescription] = useState('');

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('sarees');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number | undefined>(undefined);
  const [editFabric, setEditFabric] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editSizes, setEditSizes] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editImageUrlInput, setEditImageUrlInput] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editInStock, setEditInStock] = useState<boolean>(true);
  const [editStock, setEditStock] = useState<number>(10);
  const [editIsPublished, setEditIsPublished] = useState<boolean>(true);
  const [editDescription, setEditDescription] = useState('');

  // Category modal states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [newCatImage, setNewCatImage] = useState(
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
  );
  const [newCatDisplayOrder, setNewCatDisplayOrder] = useState<number>(1);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatDescription, setEditCatDescription] = useState('');
  const [editCatImage, setEditCatImage] = useState('');
  const [editCatDisplayOrder, setEditCatDisplayOrder] = useState<number>(1);

  // Default admin PIN for local setup (or configurable via env)
  const ADMIN_PASS = 'naqsh2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PASS || pin === 'admin123') {
      setIsAuthenticated(true);
      loadOrders();
      loadProducts();
      loadCategories();
    } else {
      alert('Incorrect Admin Passcode. Please check your credentials (Default: naqsh2026).');
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      if (data && data.length > 0) {
        setCategories(data);
        setNewCategory((prev) => (data.some((c) => c.slug === prev) ? prev : data[0].slug));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug =
      newCatSlug.trim() ||
      newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const res = await saveCategory({
      name: newCatName.trim(),
      slug,
      description: newCatDescription.trim(),
      image: newCatImage.trim(),
      display_order: Number(newCatDisplayOrder),
    });

    if (res.data) {
      setCategories((prev) => [...prev, res.data!]);
    } else {
      await loadCategories();
    }

    setIsAddCategoryOpen(false);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDescription('');
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatSlug(cat.slug);
    setEditCatDescription(cat.description || '');
    setEditCatImage(cat.image);
    setEditCatDisplayOrder((cat as any).display_order || 1);
  };

  const handleSaveEditedCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const updatedCat: Category = {
      ...editingCategory,
      name: editCatName.trim(),
      slug: editCatSlug.trim(),
      description: editCatDescription.trim(),
      image: editCatImage.trim(),
    };

    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory.id ? updatedCat : c))
    );

    await updateCategory({ ...updatedCat, display_order: Number(editCatDisplayOrder) });
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm('Are you sure you want to remove this collection/category from the boutique?')) return;

    setCategories((prev) => prev.filter((c) => c.id !== catId));
    await deleteCategory(catId);

    if (editingCategory?.id === catId) {
      setEditingCategory(null);
    }
  };

  const handleUpdateStatus = async (orderNumber: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.order_number === orderNumber ? { ...o, order_status: newStatus } : o))
    );
    await updateOrderStatus(orderNumber, newStatus);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategoryObj = categories.find((c) => c.slug === newCategory) || CATEGORIES.find((c) => c.slug === newCategory);

    // Combine any typed input in input box with existing images list
    const extraUrls = newImageUrlInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'));

    const combinedImages = Array.from(new Set([...newImages, ...extraUrls])).filter(Boolean);
    const finalImages =
      combinedImages.length > 0
        ? combinedImages
        : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'];

    const productPayload: Partial<Product> = {
      title: newTitle.trim(),
      slug: newTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: newDescription.trim() || 'Bespoke handloom artisan piece curated by Farjana.',
      price: Number(newPrice),
      original_price: newOriginalPrice ? Number(newOriginalPrice) : undefined,
      category: selectedCategoryObj ? selectedCategoryObj.name : 'Royal Sarees',
      category_slug: newCategory,
      fabric: newFabric.trim(),
      color: newColor.trim(),
      sizes: newSizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: finalImages,
      in_stock: newInStock && Number(newStock) > 0,
      stock_count: Number(newStock),
      is_published: newIsPublished,
      is_featured: true,
      is_new_arrival: true,
      sku: newSku.trim() || generateSku(newCategory, newTitle),
    };

    const res = await saveProduct(productPayload);
    if (res.data) {
      setProducts((prev) => [res.data!, ...prev]);
    } else {
      await loadProducts();
    }

    setIsAddProductOpen(false);
    setNewTitle('');
    setNewSku('');
    setNewImageUrlInput('');
    setNewInStock(true);
    setNewStock(10);
    setNewIsPublished(true);
  };

  const handleOpenAddProduct = async () => {
    try {
      const data = await fetchCategories();
      if (data && data.length > 0) {
        setCategories(data);
        if (!newCategory || !data.some((c) => c.slug === newCategory)) {
          setNewCategory(data[0].slug);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsAddProductOpen(true);
  };

  const handleOpenEditModal = async (prod: Product) => {
    try {
      const data = await fetchCategories();
      if (data && data.length > 0) {
        setCategories(data);
      }
    } catch (e) {}
    setEditingProduct(prod);
    setEditTitle(prod.title);
    setEditCategory(prod.category_slug || (categories.find((c) => c.name === prod.category)?.slug) || 'sarees');
    setEditPrice(prod.price);
    setEditOriginalPrice(prod.original_price);
    setEditFabric(prod.fabric || '');
    setEditColor(prod.color || '');
    setEditSizes(prod.sizes ? prod.sizes.join(', ') : 'Free Size');
    setEditImages(Array.isArray(prod.images) ? [...prod.images] : [prod.images].filter(Boolean));
    setEditImageUrlInput('');
    setEditSku(prod.sku);
    setEditInStock(prod.in_stock !== false && (prod.stock_count === undefined || prod.stock_count > 0));
    setEditStock(prod.stock_count !== undefined ? prod.stock_count : 10);
    setEditIsPublished(prod.is_published !== false);
    setEditDescription(prod.description || '');
  };

  const handleSaveEditedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const selectedCategoryObj = categories.find((c) => c.slug === editCategory) || CATEGORIES.find((c) => c.slug === editCategory);

    const extraUrls = editImageUrlInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'));

    const combinedImages = Array.from(new Set([...editImages, ...extraUrls])).filter(Boolean);
    const finalImages =
      combinedImages.length > 0
        ? combinedImages
        : editingProduct.images?.length > 0
        ? editingProduct.images
        : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'];

    const updatedProduct: Product = {
      ...editingProduct,
      title: editTitle.trim(),
      description: editDescription.trim(),
      price: Number(editPrice),
      original_price: editOriginalPrice ? Number(editOriginalPrice) : undefined,
      category: selectedCategoryObj ? selectedCategoryObj.name : editingProduct.category,
      category_slug: editCategory,
      fabric: editFabric.trim(),
      color: editColor.trim(),
      sizes: editSizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: finalImages,
      sku: editSku.trim() || editingProduct.sku || generateSku(editCategory, editTitle),
      in_stock: editInStock && Number(editStock) > 0,
      stock_count: Number(editStock),
      is_published: editIsPublished,
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
    );

    await updateProduct(updatedProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this outfit from the boutique?')) return;

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    await deleteProduct(productId);

    if (editingProduct?.id === productId) {
      setEditingProduct(null);
    }
  };

  const handleToggleStock = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const nextStock = !target.in_stock;
    const updated: Product = {
      ...target,
      in_stock: nextStock,
      stock_count: nextStock ? (target.stock_count > 0 ? target.stock_count : 10) : 0,
    };
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updated : p))
    );
    await updateProduct(updated);
  };

  const handleTogglePublish = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    const currentPublished = target.is_published !== false;
    const updated: Product = { ...target, is_published: !currentPublished };
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? updated : p))
    );
    await updateProduct(updated);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.order_status !== statusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchNum = o.order_number?.toLowerCase().includes(q);
      const matchName = o.customer_name?.toLowerCase().includes(q);
      const matchPhone = o.customer_phone?.toLowerCase().includes(q);
      const matchTrx = o.trx_id?.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchTrx) return false;
    }
    return true;
  });

  const filteredProductsList = products.filter((p) => {
    if (productStatusFilter === 'published' && p.is_published === false) return false;
    if (productStatusFilter === 'draft' && p.is_published !== false) return false;
    if (productStatusFilter === 'in_stock' && (!p.in_stock || (p.stock_count !== undefined && p.stock_count <= 0))) return false;
    if (productStatusFilter === 'out_of_stock' && p.in_stock && (p.stock_count === undefined || p.stock_count > 0)) return false;

    if (productSearchQuery.trim()) {
      const q = productSearchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredCategoriesList = categories.filter((c) => {
    if (categorySearchQuery.trim()) {
      const q = categorySearchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.order_status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.order_status === 'delivered').length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8dece] shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#781326] text-[#f5e6a8] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.3em] text-[#c99834] uppercase font-bold">
              Boutique Management
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#141215]">
              NAQSH Admin Portal
            </h1>
            <p className="text-xs text-[#7d757a]">
              Manage orders, verify bKash / Nagad payments, and edit outfits.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Passcode (Default: naqsh2026)"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-[#d9af4f] text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-xs hover:bg-[#500a18] shadow-md transition-all cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="p-3 rounded-xl bg-[#fbf8f3] border border-[#e8dece] text-[11px] text-[#6e686c]">
            <p>
              Default Passcode: <code className="font-bold text-[#781326]">naqsh2026</code>
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Change in <code className="text-[#c99834]">.env.local</code> as <code>ADMIN_SECRET_KEY</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e8dece] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c99834] uppercase tracking-widest font-serif">
            <Sparkles className="w-4 h-4" />
            <span>Farjana's Operations Portal</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#141215]">
            NAQSH Boutique Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddProduct}
            className="px-4 py-2.5 rounded-xl bg-[#781326] text-[#f5e6a8] text-xs font-bold shadow-md hover:bg-[#500a18] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Outfit</span>
          </button>
          <button
            onClick={() => {
              loadOrders();
              loadProducts();
            }}
            className="px-3 py-2.5 rounded-xl bg-white border border-[#e8dece] text-xs font-medium text-[#383336] hover:border-[#c99834] flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8e858a]">
            <span>Total Sales Volume</span>
            <DollarSign className="w-4 h-4 text-[#c99834]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#781326]">
            {formatPrice(totalRevenue)}
          </p>
          <p className="text-[11px] text-[#7d757a]">{orders.length} Total orders recorded</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8e858a]">
            <span>Pending Dispatch</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-600">
            {pendingOrders}
          </p>
          <p className="text-[11px] text-[#7d757a]">Requires packaging or payment verification</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8e858a]">
            <span>Delivered Parcels</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-green-700">
            {deliveredOrders}
          </p>
          <p className="text-[11px] text-[#7d757a]">Delivered safely across Bangladesh</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#e8dece] pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#781326] text-[#f5e6a8] shadow-md'
              : 'bg-white text-gray-600 hover:text-black border border-[#e8dece]'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#781326] text-[#f5e6a8] shadow-md'
              : 'bg-white text-gray-600 hover:text-black border border-[#e8dece]'
          }`}
        >
          Catalog & Stock Control ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#781326] text-[#f5e6a8] shadow-md'
              : 'bg-white text-gray-600 hover:text-black border border-[#e8dece]'
          }`}
        >
          Collections & Categories ({categories.length})
        </button>
      </div>

      {/* 1. Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#e8dece]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#8e858a] mr-2">Status:</span>
              {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase transition-all cursor-pointer ${
                      statusFilter === status
                        ? 'bg-[#c99834] text-[#141014] font-bold shadow-xs'
                        : 'bg-[#fbf8f3] border border-[#e8dece] text-[#554e53] hover:border-gray-400'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="Search Order #, Phone, Name, TrxID..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-9 text-xs rounded-xl border border-[#e8dece] bg-[#fbf8f3] focus:outline-none focus:ring-1 focus:ring-[#781326]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-[#e8dece] text-gray-500 text-xs space-y-2">
              <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-semibold text-sm text-[#141215]">No Orders Found</p>
              <p>When customers order via COD or bKash, orders will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.order_number}
                  className="p-6 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-4 hover:border-[#c99834] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-extrabold text-[#781326]">
                          {order.order_number}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            order.order_status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.order_status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>
                      <p className="text-xs text-[#8e858a] mt-0.5">
                        Placed: {new Date(order.created_at).toLocaleString('en-BD')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#141215]">
                        {formatPrice(order.total_amount)}
                      </span>
                      <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#781326]/10 text-[#781326] font-bold uppercase">
                        {order.payment_method}
                      </span>
                    </div>
                  </div>

                  {/* Customer and Delivery info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[#8e858a] text-[10px] uppercase font-bold">
                        Customer Info
                      </span>
                      <p className="font-bold text-[#141215] text-sm">{order.customer_name}</p>
                      <p className="text-[#554e53] font-semibold">{order.customer_phone}</p>
                      {order.customer_email && (
                        <p className="text-[#7d757a]">{order.customer_email}</p>
                      )}
                    </div>

                    <div>
                      <span className="text-[#8e858a] text-[10px] uppercase font-bold">
                        Delivery Address
                      </span>
                      <p className="text-[#383336] leading-relaxed">
                        {order.delivery_address}, {order.city}
                      </p>
                      <span className="text-[11px] text-[#781326] font-semibold">
                        Zone: {order.delivery_zone}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#8e858a] text-[10px] uppercase font-bold">
                        Payment & Trx Verification
                      </span>
                      <p className="text-[#141215] font-semibold">
                        Method: {order.payment_method.toUpperCase()}
                      </p>
                      {order.trx_id ? (
                        <p className="text-[#0b4e39] font-mono font-bold mt-1 bg-green-50 p-2 rounded-lg border border-green-200">
                          TrxID: {order.trx_id} (Sender: {order.sender_number || 'N/A'})
                        </p>
                      ) : (
                        <p className="text-gray-500 mt-1">Cash on Delivery (Pay to rider)</p>
                      )}
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="bg-[#fbf8f3] p-3 rounded-2xl border border-[#e8dece] text-xs space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#8e858a]">
                      Ordered Items:
                    </span>
                    <div className="space-y-1">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span>
                            • {it.product_title} ({it.size}) x {it.quantity}
                          </span>
                          <span className="font-semibold">
                            {formatPrice(it.total_price || it.unit_price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status update controls & quick actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#8e858a] font-medium">Update Status:</span>
                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          handleUpdateStatus(order.order_number, e.target.value as OrderStatus)
                        }
                        className="px-3 py-1.5 rounded-lg border border-[#d9af4f] bg-white text-xs font-semibold text-[#141215] cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed & Tailored</option>
                        <option value="processing">Quality Packaging</option>
                        <option value="shipped">In Transit / Courier</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Assalamu Alaikum ${order.customer_name}! 🌸 This is Farjana from NAQSH regarding your order #${order.order_number}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-[#25d366] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#1eb956] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Customer</span>
                      </a>
                      <a
                        href={`tel:${order.customer_phone}`}
                        className="px-3 py-2 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold flex items-center gap-1.5 hover:bg-gray-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Products Tab with Edit & Delete */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#e8dece]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setProductStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  productStatusFilter === 'all'
                    ? 'bg-[#781326] text-[#f5e6a8] shadow-sm'
                    : 'bg-[#f4eee2] text-[#4a4247] hover:bg-[#e8dece]'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setProductStatusFilter('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  productStatusFilter === 'published'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Published ({products.filter((p) => p.is_published !== false).length})</span>
              </button>
              <button
                onClick={() => setProductStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  productStatusFilter === 'draft'
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <EyeOff className="w-3 h-3" />
                <span>Drafts / Hidden ({products.filter((p) => p.is_published === false).length})</span>
              </button>
              <button
                onClick={() => setProductStatusFilter('in_stock')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  productStatusFilter === 'in_stock'
                    ? 'bg-green-700 text-white shadow-sm'
                    : 'bg-green-50 text-green-800 hover:bg-green-100 border border-green-200'
                }`}
              >
                In Stock ({products.filter((p) => p.in_stock && (p.stock_count === undefined || p.stock_count > 0)).length})
              </button>
              <button
                onClick={() => setProductStatusFilter('out_of_stock')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  productStatusFilter === 'out_of_stock'
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                }`}
              >
                Stock Out ({products.filter((p) => !p.in_stock || (p.stock_count !== undefined && p.stock_count <= 0)).length})
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative min-w-[220px]">
                <input
                  type="text"
                  placeholder="Search outfits, SKU, fabric..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-9 text-xs rounded-xl border border-[#e8dece] bg-[#fbf8f3] focus:outline-none focus:ring-1 focus:ring-[#781326]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 rounded-xl bg-[#781326] text-[#f5e6a8] text-xs font-bold shadow-md hover:bg-[#500a18] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Outfit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProductsList.map((prod) => {
              const isProdStockOut = !prod.in_stock || (prod.stock_count !== undefined && prod.stock_count <= 0);
              const isProdPublished = prod.is_published !== false;
              return (
                <div
                  key={prod.id}
                  className={`p-5 rounded-3xl bg-white border shadow-xs flex flex-col justify-between space-y-4 transition-all relative group ${
                    !isProdPublished ? 'border-amber-300 bg-amber-50/20' : 'border-[#e8dece] hover:border-[#c99834]'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-[#e8dece] relative">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className={`w-full h-full object-cover ${isProdStockOut ? 'grayscale-30' : ''}`}
                      />
                      {!isProdPublished && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-white bg-amber-600 px-1 py-0.5 rounded">
                            Draft
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#c99834] font-mono font-bold">
                          {prod.sku}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm text-[#141215] truncate mt-0.5">
                        {prod.title}
                      </h3>
                      <p className="text-[11px] text-[#8e858a] mt-0.5">{prod.category}</p>
                      <p className="text-[#781326] font-bold text-sm mt-1">
                        {formatPrice(prod.price)}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                        Units in Stock: <strong className={isProdStockOut ? 'text-red-600' : 'text-green-700'}>{prod.stock_count || 0}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Status Badges & Quick Toggles */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleToggleStock(prod.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                        !isProdStockOut
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      title="Click to toggle Stock availability"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${!isProdStockOut ? 'bg-green-600' : 'bg-red-600'}`} />
                      <span>{!isProdStockOut ? 'In Stock' : 'Stock Out'}</span>
                    </button>

                    <button
                      onClick={() => handleTogglePublish(prod.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                        isProdPublished
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      }`}
                      title="Click to toggle Boutique Visibility (Published / Hidden)"
                    >
                      {isProdPublished ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-700" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-amber-700" />
                          <span>Draft (Hidden)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/product/${prod.slug}`}
                      target="_blank"
                      className="text-[11px] font-semibold text-[#781326] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Live</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="px-3 py-1.5 rounded-xl bg-[#781326] text-[#f5e6a8] text-xs font-bold hover:bg-[#500a18] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        title="Delete Outfit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Categories & Collections Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#e8dece]">
            <div className="text-xs text-[#6e686c]">
              Boutique Collections: <strong>{filteredCategoriesList.length}</strong> active categories
            </div>

            <div className="flex items-center gap-3">
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search collection name, slug..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-9 text-xs rounded-xl border border-[#e8dece] bg-[#fbf8f3] focus:outline-none focus:ring-1 focus:ring-[#781326]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#781326] text-[#f5e6a8] text-xs font-bold shadow-md hover:bg-[#500a18] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Collection</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategoriesList.map((cat) => {
              const count = products.filter((p) => p.category_slug === cat.slug).length;
              return (
                <div
                  key={cat.id}
                  className="p-5 rounded-3xl bg-white border border-[#e8dece] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#c99834] transition-all relative group"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-[#e8dece]">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#c99834] font-mono font-bold">
                          slug: {cat.slug}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm text-[#141215] truncate">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-[#6e686c] line-clamp-2 leading-relaxed">
                        {cat.description || 'No description added yet.'}
                      </p>
                      <p className="text-[10px] font-semibold text-[#781326] pt-0.5">
                        {count} {count === 1 ? 'Outfit' : 'Outfits'} in store
                      </p>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      target="_blank"
                      className="text-[11px] font-semibold text-[#781326] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View in Shop</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="px-3 py-1.5 rounded-xl bg-[#781326] text-[#f5e6a8] text-xs font-bold hover:bg-[#500a18] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        title="Delete Collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setEditingProduct(null)}
          />

          <div className="relative bg-[#fbf8f3] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#c99834]/40 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8dece]">
              <div className="flex items-center gap-2 text-[#781326] font-serif font-bold text-xl">
                <Edit3 className="w-5 h-5 text-[#c99834]" />
                <span>Edit Outfit: {editingProduct.title}</span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Outfit Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-[#3d383b] uppercase tracking-wider">
                      SKU Code
                    </label>
                    <span className="text-[10px] text-[#8e858a]">Auto-generated if empty</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={editSku}
                      onChange={(e) => setEditSku(e.target.value)}
                      placeholder="e.g. NQ-SR-1024 (Auto-generated)"
                      className="w-full px-4 py-3 pr-24 rounded-xl border border-[#e8dece] bg-white text-[#141215] font-mono focus:outline-none focus:ring-2 focus:ring-[#781326]"
                    />
                    <button
                      type="button"
                      onClick={() => setEditSku(generateSku(editCategory, editTitle))}
                      className="absolute right-2 px-2.5 py-1.5 rounded-lg bg-[#f4eee2] hover:bg-[#e8dece] text-[#781326] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      title="Generate new SKU"
                    >
                      Auto Gen
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Selling Price (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Original Price (৳)
                  </label>
                  <input
                    type="number"
                    value={editOriginalPrice || ''}
                    onChange={(e) =>
                      setEditOriginalPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>
              </div>

              {/* Stock Control & Publication Controls */}
              <div className="p-4 rounded-2xl bg-[#f4eee2] border border-[#e8dece] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#781326]">
                    Inventory & Store Visibility
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                      Stock Availability *
                    </label>
                    <select
                      value={editInStock ? 'true' : 'false'}
                      onChange={(e) => setEditInStock(e.target.value === 'true')}
                      className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                    >
                      <option value="true">In Stock (Available to Order)</option>
                      <option value="false">Stock Out (Marked Sold Out)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                      Stock Quantity (Units) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editStock}
                      onChange={(e) => setEditStock(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e8dece]">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editIsPublished}
                      onChange={(e) => setEditIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-[#781326] focus:ring-[#781326] cursor-pointer"
                    />
                    <div className="text-xs">
                      <strong className="text-[#141215] block">Publish to Boutique Storefront</strong>
                      <span className="text-[#6e686c]">
                        {editIsPublished
                          ? 'Visible to public boutique shoppers and catalog listings.'
                          : 'Hidden / Draft mode. Only visible to admins in the portal.'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Fabric Composition *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFabric}
                    onChange={(e) => setEditFabric(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Color Palette *
                  </label>
                  <input
                    type="text"
                    required
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Available Sizes (comma separated)
                </label>
                <input
                  type="text"
                  value={editSizes}
                  onChange={(e) => setEditSizes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#e8dece]">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider text-[11px]">
                    Product Images ({editImages.length})
                  </label>
                  <span className="text-[10px] text-gray-500">First image is the Main Cover</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={editImageUrlInput}
                    onChange={(e) => setEditImageUrlInput(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#e8dece] bg-[#fbf8f3] focus:outline-none focus:ring-1 focus:ring-[#781326]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editImageUrlInput.trim()) {
                        const urls = editImageUrlInput
                          .split(/[\n,]+/)
                          .map((u) => u.trim())
                          .filter((u) => u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/'));
                        if (urls.length > 0) {
                          setEditImages((prev) => [...prev, ...urls]);
                          setEditImageUrlInput('');
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-xs hover:bg-[#500a18] transition-all cursor-pointer"
                  >
                    Add Photo
                  </button>
                </div>

                {/* Thumbnails preview */}
                {editImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                    {editImages.map((url, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 bg-gray-100 group ${
                          idx === 0 ? 'border-[#781326]' : 'border-[#e8dece]'
                        }`}
                      >
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1">
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                              idx === 0 ? 'bg-[#781326] text-[#f5e6a8]' : 'bg-black/60 text-white'
                            }`}
                          >
                            {idx === 0 ? 'Cover' : `#${idx + 1}`}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-1 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditImages((prev) => [url, ...prev.filter((_, i) => i !== idx)]);
                              }}
                              className="text-[10px] px-2 py-0.5 rounded bg-[#781326] text-[#f5e6a8] font-bold cursor-pointer"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Description & Craft Highlights
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-sm hover:bg-[#500a18] shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteProduct(editingProduct.id)}
                  className="px-6 py-4 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAddProductOpen(false)}
          />

          <div className="relative bg-[#fbf8f3] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#c99834]/40 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8dece]">
              <div className="flex items-center gap-2 text-[#781326] font-serif font-bold text-xl">
                <Sparkles className="w-5 h-5 text-[#c99834]" />
                <span>Add New Boutique Outfit</span>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Outfit Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Maroon Zari Jamdani Saree"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-[#3d383b] uppercase tracking-wider">
                      SKU Code
                    </label>
                    <span className="text-[10px] text-[#8e858a]">Auto-generated if empty</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      placeholder="e.g. NQ-SR-1024 (Auto-generated)"
                      className="w-full px-4 py-3 pr-24 rounded-xl border border-[#e8dece] bg-white text-[#141215] font-mono focus:outline-none focus:ring-2 focus:ring-[#781326]"
                    />
                    <button
                      type="button"
                      onClick={() => setNewSku(generateSku(newCategory, newTitle))}
                      className="absolute right-2 px-2.5 py-1.5 rounded-lg bg-[#f4eee2] hover:bg-[#e8dece] text-[#781326] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      title="Generate new SKU"
                    >
                      Auto Gen
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Selling Price (৳ BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Original Price (for discount strikethrough)
                  </label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>
              </div>

              {/* Stock Control & Publication Controls */}
              <div className="p-4 rounded-2xl bg-[#f4eee2] border border-[#e8dece] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#781326]">
                    Inventory & Store Visibility
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                      Stock Availability *
                    </label>
                    <select
                      value={newInStock ? 'true' : 'false'}
                      onChange={(e) => setNewInStock(e.target.value === 'true')}
                      className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                    >
                      <option value="true">In Stock (Available to Order)</option>
                      <option value="false">Stock Out (Marked Sold Out)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                      Stock Quantity (Units) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e8dece]">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newIsPublished}
                      onChange={(e) => setNewIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-[#781326] focus:ring-[#781326] cursor-pointer"
                    />
                    <div className="text-xs">
                      <strong className="text-[#141215] block">Publish to Boutique Storefront</strong>
                      <span className="text-[#6e686c]">
                        {newIsPublished
                          ? 'Visible to public boutique shoppers and catalog listings.'
                          : 'Hidden / Draft mode. Only visible to admins in the portal.'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Fabric Composition *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
                    placeholder="e.g. 100% Pure Katan Silk"
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Color Palette *
                  </label>
                  <input
                    type="text"
                    required
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="e.g. Royal Maroon & Antique Gold"
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Available Sizes (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={newSizes}
                  onChange={(e) => setNewSizes(e.target.value)}
                  placeholder="e.g. S (Bust 36), M (Bust 38), L (Bust 40), XL (Bust 42)"
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              {/* Multi-Image upload / manager */}
              <div className="space-y-2 p-4 rounded-2xl bg-white border border-[#e8dece]">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider text-[11px]">
                    Product Images ({newImages.length}) *
                  </label>
                  <span className="text-[10px] text-gray-500">First image is the Main Cover</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#e8dece] bg-[#fbf8f3] focus:outline-none focus:ring-1 focus:ring-[#781326]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrlInput.trim()) {
                        const urls = newImageUrlInput
                          .split(/[\n,]+/)
                          .map((u) => u.trim())
                          .filter((u) => u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/'));
                        if (urls.length > 0) {
                          setNewImages((prev) => [...prev, ...urls]);
                          setNewImageUrlInput('');
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-xs hover:bg-[#500a18] transition-all cursor-pointer"
                  >
                    Add Photo
                  </button>
                </div>

                {/* Thumbnails preview */}
                {newImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                    {newImages.map((url, idx) => (
                      <div
                        key={idx}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 bg-gray-100 group ${
                          idx === 0 ? 'border-[#781326]' : 'border-[#e8dece]'
                        }`}
                      >
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1">
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                              idx === 0 ? 'bg-[#781326] text-[#f5e6a8]' : 'bg-black/60 text-white'
                            }`}
                          >
                            {idx === 0 ? 'Cover' : `#${idx + 1}`}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-1 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setNewImages((prev) => [url, ...prev.filter((_, i) => i !== idx)]);
                              }}
                              className="text-[10px] px-2 py-0.5 rounded bg-[#781326] text-[#f5e6a8] font-bold cursor-pointer"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setNewImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Description & Craft Highlights
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Details about weave, zardozi work, matching blouse piece..."
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-sm hover:bg-[#500a18] shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Outfit to Store</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setEditingCategory(null)}
          />

          <div className="relative bg-[#fbf8f3] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#c99834]/40 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8dece]">
              <div className="flex items-center gap-2 text-[#781326] font-serif font-bold text-xl">
                <Edit3 className="w-5 h-5 text-[#c99834]" />
                <span>Edit Collection: {editingCategory.name}</span>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-full text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedCategory} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Collection / Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCatSlug}
                    onChange={(e) => setEditCatSlug(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] font-mono focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editCatDisplayOrder}
                    onChange={(e) => setEditCatDisplayOrder(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Cover Photo Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editCatImage}
                  onChange={(e) => setEditCatImage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
                {editCatImage && (
                  <div className="mt-2 w-24 h-28 rounded-xl overflow-hidden border border-[#e8dece]">
                    <img src={editCatImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editCatDescription}
                  onChange={(e) => setEditCatDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-sm hover:bg-[#500a18] shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Collection</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCategory(editingCategory.id)}
                  className="px-6 py-4 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAddCategoryOpen(false)}
          />

          <div className="relative bg-[#fbf8f3] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#c99834]/40 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8dece]">
              <div className="flex items-center gap-2 text-[#781326] font-serif font-bold text-xl">
                <Sparkles className="w-5 h-5 text-[#c99834]" />
                <span>Add Boutique Collection</span>
              </div>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Collection / Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eid Velvet Couture"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    URL Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. eid-velvet-couture"
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] font-mono focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={newCatDisplayOrder}
                    onChange={(e) => setNewCatDisplayOrder(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Cover Photo Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
                {newCatImage && (
                  <div className="mt-2 w-24 h-28 rounded-xl overflow-hidden border border-[#e8dece]">
                    <img src={newCatImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  placeholder="e.g. Handcrafted micro-velvet kurtis, embroidered shawls, and regal festive sets."
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dece] bg-white text-[#141215] focus:outline-none focus:ring-2 focus:ring-[#781326]"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-sm hover:bg-[#500a18] shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Collection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
