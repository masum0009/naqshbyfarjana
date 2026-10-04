-- ==============================================================================
-- NAQSH by Farjana - Database Schema for Supabase PostgreSQL
-- ==============================================================================

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_slug VARCHAR(255) NOT NULL,
    fabric VARCHAR(255),
    color VARCHAR(100),
    sizes TEXT[] DEFAULT ARRAY['Free Size'],
    images TEXT[] NOT NULL,
    in_stock BOOLEAN DEFAULT true NOT NULL,
    stock_count INT DEFAULT 10 NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_bestseller BOOLEAN DEFAULT false NOT NULL,
    is_new_arrival BOOLEAN DEFAULT false NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    details TEXT[],
    care_instructions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(64) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    delivery_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    delivery_zone VARCHAR(50) NOT NULL, -- inside_dhaka, outside_dhaka
    delivery_fee NUMERIC(10, 2) DEFAULT 70.00 NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- cod, bkash, nagad
    payment_status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, verified, failed
    sender_number VARCHAR(50),
    trx_id VARCHAR(100),
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- pending, confirmed, processing, shipped, delivered, cancelled
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    product_image TEXT,
    size VARCHAR(100) NOT NULL,
    color VARCHAR(100),
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
-- Categories & Products: Public Read-Only for website visitors
CREATE POLICY "Public categories are viewable by everyone." 
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Public products are viewable by everyone." 
    ON public.products FOR SELECT USING (true);

-- Orders: Public can insert their new order, but cannot list all other customers' orders
CREATE POLICY "Public can insert orders." 
    ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view their own order by order_number." 
    ON public.orders FOR SELECT USING (true);

CREATE POLICY "Public can insert order items." 
    ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view order items." 
    ON public.order_items FOR SELECT USING (true);

-- Admin / Service Role has full control
CREATE POLICY "Service role full access on categories" 
    ON public.categories FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access on products" 
    ON public.products FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access on orders" 
    ON public.orders FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access on order_items" 
    ON public.order_items FOR ALL TO service_role USING (true);

-- ==============================================================================
-- 9. Sample Seed Data for NAQSH by Farjana
-- ==============================================================================

INSERT INTO public.categories (id, name, slug, description, image_url, display_order)
VALUES
    ('c0000001-0000-0000-0000-000000000001', 'Royal Sarees', 'sarees', 'Handwoven Dhakai Jamdani, Pure Muslin, Katan Silk & Organza masterworks.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 1),
    ('c0000002-0000-0000-0000-000000000002', 'Designer 3-Piece Sets', 'three-piece-sets', 'Heavy embroidered organza, georgette, and linen cotton luxury salwar suits.', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', 2),
    ('c0000003-0000-0000-0000-000000000003', 'Bridal & Festive Couture', 'bridal-festive', 'Heavily zardozi embellished bridal lehengas, ghararas, and evening attire.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', 3),
    ('c0000004-0000-0000-0000-000000000004', 'Kurtis & Tunics', 'kurtis', 'Chic contemporary kurtis with delicate cutwork, chikankari and thread motifs.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', 4),
    ('c0000005-0000-0000-0000-000000000005', 'Luxury Shawls & Dupattas', 'shawls-dupattas', 'Hand-embroidered velvet shawls and organza gotta-patti statement dupattas.', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (
    title, slug, description, price, original_price, category_id, category_slug, 
    fabric, color, sizes, images, in_stock, stock_count, is_featured, is_bestseller, is_new_arrival, sku, details, care_instructions
) VALUES 
(
    'Heritage Crimson Dhakai Jamdani Saree',
    'heritage-crimson-dhakai-jamdani-saree',
    'Masterpiece 84-count pure cotton Dhakai Jamdani hand-woven by national heritage weavers in Rupganj. Embellished with all-over intricate gold zari floral jaal and traditional paisley (kalka) pallu. Breathable, featherlight, and timeless.',
    14500.00,
    16800.00,
    'c0000001-0000-0000-0000-000000000001',
    'sarees',
    'Pure Dhakai Cotton & Resham Zari',
    'Royal Crimson & Gold',
    ARRAY['Free Size (6.5 Yards with Blouse Piece)'],
    ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80'],
    true,
    6,
    true,
    true,
    true,
    'NQ-SR-0101',
    ARRAY['Authentic Bangladeshi Handloom Craft', 'Includes unstitched matching running blouse piece (80cm)', '100% Hand-woven motif detailing'],
    ARRAY['Strictly Dry Clean Only', 'Store wrapped in pure cotton muslin cloth']
),
(
    'Noor-E-Jahan Emerald Embroidered 3-Piece Suit',
    'noor-e-jahan-emerald-embroidered-3-piece-suit',
    'Luxurious deep emerald raw silk long kameez featuring heavy zardozi neckline, tilla threadwork, and cutwork borders. Paired with straight silk trousers and an ethereal organza dupatta with gold scalloped borders.',
    8950.00,
    10500.00,
    'c0000002-0000-0000-0000-000000000002',
    'three-piece-sets',
    'Raw Silk Kameez & Trousers, Pure Organza Dupatta',
    'Emerald Forest Green',
    ARRAY['S (Bust 36)', 'M (Bust 38)', 'L (Bust 40)', 'XL (Bust 42)', 'XXL (Bust 44)'],
    ARRAY['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80'],
    true,
    12,
    true,
    true,
    false,
    'NQ-3P-0204',
    ARRAY['Complete 3-Piece Ready-to-wear set', 'Fine micro-thread embroidery and stone highlights', 'Pure inner lining attached'],
    ARRAY['Dry Clean Recommended', 'Iron on low heat']
)
ON CONFLICT (slug) DO NOTHING;
