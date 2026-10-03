import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, getAdminSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const client = getAdminSupabaseClient() || supabase;
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ products: data || [] });
    }

    return NextResponse.json({ products: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.price || !body.sku) {
      return NextResponse.json({ error: 'Title, price, and SKU are required' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const client = getAdminSupabaseClient() || supabase;
      const { data, error } = await client
        .from('products')
        .insert([body])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, product: data });
    }

    return NextResponse.json({ success: true, message: 'Saved locally', product: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const client = getAdminSupabaseClient() || supabase;
      const { data, error } = await client
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, product: data });
    }

    return NextResponse.json({ success: true, message: 'Updated locally' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      const client = getAdminSupabaseClient() || supabase;
      const { error } = await client.from('products').delete().eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Deleted from Supabase' });
    }

    return NextResponse.json({ success: true, message: 'Deleted locally' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
