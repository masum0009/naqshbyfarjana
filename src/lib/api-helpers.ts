import { supabase, isSupabaseConfigured } from './supabase';
import { Order, OrderStatus, Product } from '@/types';

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
  // 1. Check localStorage first
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

  // 2. Search in Supabase
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

  return null;
}
