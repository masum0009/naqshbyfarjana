import React from 'react';
import { INITIAL_PRODUCTS } from '@/lib/products-data';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
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
