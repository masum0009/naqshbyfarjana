import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, getAdminSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const client = getAdminSupabaseClient() || supabase;
      const { data, error } = await client
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ orders: data || [] });
    }

    return NextResponse.json({ orders: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { order_number, order_status, payment_status } = await request.json();

    if (!order_number) {
      return NextResponse.json({ error: 'Order number required' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const client = getAdminSupabaseClient() || supabase;
      const updates: any = {};
      if (order_status) updates.order_status = order_status;
      if (payment_status) updates.payment_status = payment_status;

      const { data, error } = await client
        .from('orders')
        .update(updates)
        .eq('order_number', order_number)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, order: data });
    }

    return NextResponse.json({ success: true, message: 'Updated locally' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
