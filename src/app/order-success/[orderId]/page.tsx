import React from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export function generateStaticParams() {
  return [{ orderId: 'demo' }];
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = await params;
  return <OrderSuccessClient orderId={resolvedParams.orderId} />;
}
