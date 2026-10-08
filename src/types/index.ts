export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  category_slug: string;
  fabric: string;
  color: string;
  sizes: string[];
  images: string[];
  in_stock: boolean;
  stock_count: number;
  is_published?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  sku: string;
  tags?: string[];
  details?: string[];
  care_instructions?: string[];
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  item_count?: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'verified' | 'failed';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_title: string;
  product_image: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  city: string;
  delivery_zone: 'inside_dhaka' | 'dhaka_suburbs' | 'outside_dhaka';
  delivery_fee: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  sender_number?: string;
  trx_id?: string;
  subtotal: number;
  discount: number;
  total_amount: number;
  order_status: OrderStatus;
  notes?: string;
  items: OrderItem[];
  created_at: string;
}

export interface DeliveryZoneOption {
  id: 'inside_dhaka' | 'dhaka_suburbs' | 'outside_dhaka';
  name: string;
  fee: number;
  estimated_days: string;
}
