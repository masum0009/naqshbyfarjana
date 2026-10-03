import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, getAdminSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      order_number,
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      city,
      delivery_zone,
      delivery_fee,
      payment_method,
      payment_status,
      sender_number,
      trx_id,
      subtotal,
      discount,
      total_amount,
      order_status,
      notes,
      items,
    } = body;

    // Strict validation
    if (!order_number || !customer_name || !customer_phone || !delivery_address || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required order fields (name, phone, address, items).' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      const client = getAdminSupabaseClient() || supabase;

      // 1. Insert order
      const { data: orderData, error: orderError } = await client
        .from('orders')
        .insert([
          {
            order_number,
            customer_name,
            customer_phone,
            customer_email,
            delivery_address,
            city: city || 'Dhaka',
            delivery_zone: delivery_zone || 'inside_dhaka',
            delivery_fee: Number(delivery_fee || 80),
            payment_method: payment_method || 'cod',
            payment_status: payment_status || 'pending',
            sender_number,
            trx_id,
            subtotal: Number(subtotal),
            discount: Number(discount || 0),
            total_amount: Number(total_amount),
            order_status: order_status || 'pending',
            notes,
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Supabase Order Insert Error:', orderError);
        return NextResponse.json({ error: orderError.message }, { status: 500 });
      }

      // 2. Insert order items
      if (orderData?.id && items?.length) {
        const orderItemsPayload = items.map((it: any) => ({
          order_id: orderData.id,
          product_id: it.product_id,
          product_title: it.product_title,
          product_image: it.product_image,
          size: it.size,
          color: it.color,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total_price: it.total_price,
        }));

        const { error: itemsError } = await client
          .from('order_items')
          .insert(orderItemsPayload);

        if (itemsError) {
          console.error('Supabase Order Items Insert Error:', itemsError);
        }
      }

      return NextResponse.json({
        success: true,
        order: orderData,
      });
    }

    // Fallback when Supabase is running in local mode before env configuration
    return NextResponse.json({
      success: true,
      message: 'Order recorded successfully (local mode).',
      order: body,
    });
  } catch (err: any) {
    console.error('API Orders Route Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
