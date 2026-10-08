import React from 'react';
import { fetchProducts } from '@/lib/api-helpers';
import { INITIAL_PRODUCTS } from '@/lib/products-data';
import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  try {
    const products = await fetchProducts();
    if (products && products.length > 0) {
      return products.map((p) => ({
        slug: p.slug,
      }));
    }
  } catch (e) {
    console.warn('generateStaticParams warning:', e);
  }

  return INITIAL_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <ProductDetailClient slug={resolvedParams.slug} />;
}
