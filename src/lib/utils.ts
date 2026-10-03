import { BRAND_INFO } from './products-data';
import { CartItem, Product } from '@/types';

export function formatPrice(amount: number): string {
  return `৳${Number(amount || 0).toLocaleString('en-BD')}`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `NQ-${timestamp}${random}`;
}

export function buildWhatsAppOrderLink(item: {
  title: string;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  url?: string;
}): string {
  const cleanNumber = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, '');
  const text = encodeURIComponent(
    `Assalamu Alaikum NAQSH by Farjana! 🌸\nI would like to inquire/order:\n\n*Item:* ${item.title}\n*SKU:* ${item.sku}\n*Size:* ${item.size || 'Standard'}\n*Price:* ৳${item.price.toLocaleString('en-BD')}\n\nPlease confirm availability!`
  );
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

export function buildCartWhatsAppOrderLink(
  items: CartItem[],
  total: number,
  customerName?: string
): string {
  const cleanNumber = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, '');
  const itemsList = items
    .map(
      (it, idx) =>
        `${idx + 1}. ${it.product.title} (${it.selectedSize}) x ${it.quantity} = ৳${(
          it.product.price * it.quantity
        ).toLocaleString('en-BD')}`
    )
    .join('\n');

  const text = encodeURIComponent(
    `Assalamu Alaikum NAQSH by Farjana! 🌸\nI would like to place an order from your website.\n\n*Customer:* ${customerName || 'Valued Customer'}\n*Items:*\n${itemsList}\n\n*Total Amount:* ৳${total.toLocaleString('en-BD')}\n\nPlease let me know the delivery details.`
  );
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

export function buildMessengerOrderLink(product?: Product): string {
  // Direct Facebook Messenger chat with NAQSH.by.Farjana
  return BRAND_INFO.messengerUrl;
}
