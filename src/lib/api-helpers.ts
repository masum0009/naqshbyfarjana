import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_PRODUCTS, CATEGORIES } from './products-data';
import { Order, OrderStatus, Product, Category } from '@/types';

function mapSupabaseCategory(c: any): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image_url || c.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    item_count: c.item_count,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseCategory);
      }
    } catch (e) {
      console.warn('Supabase fetchCategories warning:', e);
    }
  }
  return CATEGORIES;
}

function mapSupabaseProduct(p: any): Product {
  return {
    id: p.id,
    title: p.title || '',
    slug: p.slug || '',
    description: p.description || '',
    price: Number(p.price || 0),
    original_price: p.original_price ? Number(p.original_price) : undefined,
    category:
      p.category ||
      CATEGORIES.find((c) => c.slug === p.category_slug)?.name ||
      'Royal Sarees',
    category_slug: p.category_slug || 'sarees',
    fabric: p.fabric || '',
    color: p.color || '',
    sizes: Array.isArray(p.sizes)
      ? p.sizes
      : typeof p.sizes === 'string'
      ? JSON.parse(p.sizes || '[]')
      : ['Free Size'],
    images: Array.isArray(p.images)
      ? p.images
      : typeof p.images === 'string'
      ? JSON.parse(p.images || '[]')
      : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'],
    in_stock: p.in_stock !== undefined ? Boolean(p.in_stock) : true,
    stock_count: p.stock_count !== undefined ? Number(p.stock_count) : 10,
    is_featured: Boolean(p.is_featured),
    is_bestseller: Boolean(p.is_bestseller),
    is_new_arrival: Boolean(p.is_new_arrival),
    sku: p.sku || `NQ-${Math.floor(1000 + Math.random() * 9000)}`,
    details: Array.isArray(p.details)
      ? p.details
      : typeof p.details === 'string'
      ? JSON.parse(p.details || '[]')
      : [],
    care_instructions: Array.isArray(p.care_instructions)
      ? p.care_instructions
      : typeof p.care_instructions === 'string'
      ? JSON.parse(p.care_instructions || '[]')
      : [],
    created_at: p.created_at,
  };
}

function updateLocalProductsCache(product: Product, action: 'add' | 'update' | 'delete') {
  if (typeof window === 'undefined') return;
  try {
    let list: Product[] = [];
    const saved = localStorage.getItem('naqsh_custom_products');
    if (saved) {
      list = JSON.parse(saved);
    } else {
      list = [...INITIAL_PRODUCTS];
    }

    if (action === 'add') {
      list = [product, ...list.filter((p) => p.id !== product.id && p.slug !== product.slug)];
    } else if (action === 'update') {
      list = list.map((p) => (p.id === product.id || p.slug === product.slug ? product : p));
    } else if (action === 'delete') {
      list = list.filter((p) => p.id !== product.id);
    }

    localStorage.setItem('naqsh_custom_products', JSON.stringify(list));
  } catch (e) {
    console.warn('Error updating local products cache:', e);
  }
}

export async function fetchProducts(): Promise<Product[]> {
  // 1. Fetch live from Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapSupabaseProduct);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('naqsh_custom_products', JSON.stringify(mapped));
          } catch (e) {}
        }
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetchProducts warning:', e);
    }
  }

  // 2. Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('naqsh_custom_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
  }

  // 3. Fallback to INITIAL_PRODUCTS
  return INITIAL_PRODUCTS;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return mapSupabaseProduct(data);
      }
    } catch (e) {
      console.warn('Supabase fetchProductBySlug warning:', e);
    }
  }

  const all = await fetchProducts();
  return all.find((p) => p.slug === slug) || null;
}

export async function saveProduct(productPayload: Partial<Product>): Promise<{ success: boolean; data?: Product }> {
  const selectedCategoryObj = CATEGORIES.find((c) => c.slug === productPayload.category_slug);

  const cleanProduct = {
    title: productPayload.title || '',
    slug:
      productPayload.slug ||
      productPayload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
      `prod-${Date.now()}`,
    description: productPayload.description || 'Bespoke handloom artisan piece curated by Farjana.',
    price: Number(productPayload.price || 0),
    original_price: productPayload.original_price ? Number(productPayload.original_price) : null,
    category_slug: productPayload.category_slug || 'sarees',
    fabric: productPayload.fabric || '',
    color: productPayload.color || '',
    sizes: productPayload.sizes || ['Free Size'],
    images: productPayload.images || [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    ],
    in_stock: productPayload.in_stock !== undefined ? Boolean(productPayload.in_stock) : true,
    stock_count: productPayload.stock_count !== undefined ? Number(productPayload.stock_count) : 10,
    is_featured: Boolean(productPayload.is_featured),
    is_bestseller: Boolean(productPayload.is_bestseller),
    is_new_arrival: Boolean(productPayload.is_new_arrival),
    sku: productPayload.sku || `NQ-${Math.floor(1000 + Math.random() * 9000)}`,
    details: productPayload.details || [],
    care_instructions: productPayload.care_instructions || [],
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([cleanProduct])
        .select()
        .single();

      if (!error && data) {
        const full = mapSupabaseProduct(data);
        updateLocalProductsCache(full, 'add');
        return { success: true, data: full };
      } else if (error) {
        console.error('Supabase saveProduct error:', error);
      }
    } catch (e) {
      console.warn('Supabase saveProduct exception:', e);
    }
  }

  const localProd: Product = {
    ...cleanProduct,
    original_price: productPayload.original_price ? Number(productPayload.original_price) : undefined,
    id: `prod-${Date.now()}`,
    category: selectedCategoryObj?.name || 'Royal Sarees',
  };
  updateLocalProductsCache(localProd, 'add');
  return { success: true, data: localProd };
}

export async function updateProduct(product: Product): Promise<{ success: boolean; data?: Product }> {
  const cleanPayload = {
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    original_price: product.original_price ? Number(product.original_price) : null,
    category_slug: product.category_slug,
    fabric: product.fabric,
    color: product.color,
    sizes: product.sizes,
    images: product.images,
    in_stock: product.in_stock,
    stock_count: Number(product.stock_count),
    is_featured: product.is_featured,
    is_bestseller: product.is_bestseller,
    is_new_arrival: product.is_new_arrival,
    sku: product.sku,
    details: product.details,
    care_instructions: product.care_instructions,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(cleanPayload)
        .eq('id', product.id)
        .select()
        .single();

      if (!error && data) {
        const full = mapSupabaseProduct(data);
        updateLocalProductsCache(full, 'update');
        return { success: true, data: full };
      } else if (error) {
        console.error('Supabase updateProduct error:', error);
      }
    } catch (e) {
      console.warn('Supabase updateProduct exception:', e);
    }
  }

  updateLocalProductsCache(product, 'update');
  return { success: true, data: product };
}

export async function deleteProduct(productId: string): Promise<{ success: boolean }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) {
        console.error('Supabase deleteProduct error:', error);
      }
    } catch (e) {
      console.warn('Supabase deleteProduct exception:', e);
    }
  }

  updateLocalProductsCache({ id: productId } as any, 'delete');
  return { success: true };
}

export async function fetchOrders(): Promise<Order[]> {
  let supabaseOrders: Order[] = [];
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        supabaseOrders = data;
      }
    } catch (e) {
      console.warn('Supabase fetchOrders error:', e);
    }
  }

  const localOrders: Order[] = [];
  if (typeof window !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('order_')) {
        try {
          const parsed = JSON.parse(localStorage.getItem(key) || '{}');
          if (parsed.order_number) localOrders.push(parsed);
        } catch (e) {}
      }
    }
  }

  const combined = [...supabaseOrders];
  localOrders.forEach((lo) => {
    if (!combined.some((co) => co.order_number === lo.order_number)) {
      combined.push(lo);
    }
  });

  return combined.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function updateOrderStatus(orderNumber: string, status: OrderStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('order_number', orderNumber);
    } catch (e) {
      console.warn('Supabase updateOrderStatus error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(`order_${orderNumber}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.order_status = status;
        localStorage.setItem(`order_${orderNumber}`, JSON.stringify(parsed));
      }
    } catch (e) {}
  }

  return true;
}

export async function submitOrder(order: any): Promise<{ success: boolean; order_number: string }> {
  // 1. Always save to localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`order_${order.order_number}`, JSON.stringify(order));
    } catch (e) {}
  }

  // 2. If Supabase is configured, sync to database
  if (isSupabaseConfigured && supabase) {
    try {
      const { items, ...orderHeader } = order;
      const { data: createdOrder, error: orderErr } = await supabase
        .from('orders')
        .insert([orderHeader])
        .select()
        .single();

      if (!orderErr && createdOrder && items && items.length > 0) {
        const orderItems = items.map((it: any) => ({
          ...it,
          order_id: createdOrder.id,
        }));
        await supabase.from('order_items').insert(orderItems);
      }
    } catch (e) {
      console.warn('Supabase sync warning:', e);
    }
  }

  return { success: true, order_number: order.order_number };
}

export async function trackOrder(query: string): Promise<Order | null> {
  // 1. Search in Supabase first for real-time live status
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .or(`order_number.eq.${query},customer_phone.eq.${query},trx_id.eq.${query}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase query error:', e);
    }
  }

  // 2. Check localStorage fallback
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(`order_${query}`);
      if (saved) return JSON.parse(saved);

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('order_')) {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (
            item.order_number === query ||
            item.customer_phone === query ||
            item.trx_id === query
          ) {
            return item;
          }
        }
      }
    } catch (e) {}
  }

  return null;
}
