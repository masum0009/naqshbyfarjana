import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingSocials from '@/components/FloatingSocials';
import { BRAND_INFO } from '@/lib/products-data';

export const metadata: Metadata = {
  title: `${BRAND_INFO.name} | Luxury Handloom Sarees & Bespoke 3-Piece Boutique`,
  description: BRAND_INFO.description,
  keywords: [
    'NAQSH by Farjana',
    'Dhakai Jamdani Saree',
    'Muslin Saree Bangladesh',
    'Designer 3 Piece',
    'Salwar Suit Dhaka',
    'Bridal Lehenga Bangladesh',
    'Farjana Boutique',
    'Handloom Ethnic Wear',
    'bKash Cash on Delivery Shopping',
  ],
  openGraph: {
    title: `${BRAND_INFO.name} | Timeless Elegance & Bespoke Artisanal Fashion`,
    description: BRAND_INFO.description,
    url: 'https://naqshbyfarjana.com',
    siteName: BRAND_INFO.name,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'NAQSH by Farjana Luxury Collection',
      },
    ],
    locale: 'en_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#fbf8f3] text-[#141215] selection:bg-[#781326] selection:text-[#f5e6a8]">
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingSocials />
        </CartProvider>
      </body>
    </html>
  );
}
