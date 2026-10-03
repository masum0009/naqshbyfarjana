import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, getAdminSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('query') || '').trim();

    if (!query) {
      return NextResponse.json({ error: 'Query parameter required.' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const client = getAdminSupabaseClient() || supabase;

      // Query by order_number or phone
      const { data, error } = await client
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .or(`order_number.eq.${query},customer_phone.eq.${query}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json({ order: data });
    }

    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
