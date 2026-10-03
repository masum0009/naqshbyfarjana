'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  Truck,
  MessageCircle,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
} from 'lucide-react';
import { FacebookIcon } from '@/components/Icons';
import { BRAND_INFO } from '@/lib/products-data';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/types';

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to load from localStorage first or fetch from API
    try {
      const saved = localStorage.getItem(`order_${resolvedParams.orderId}`);
      if (saved) {
        setOrder(JSON.parse(saved));
        setLoading(false);
        return;
      }
    } catch (e) {
      // Safe ignore
    }

    // Otherwise fetch via API
    fetch(`/api/track?query=${encodeURIComponent(resolvedParams.orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [resolvedParams.orderId]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const cleanNumber = BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappConfirmLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Assalamu Alaikum NAQSH by Farjana! 🌸\nI have placed order *#${resolvedParams.orderId}* on your website.\nCustomer Name: ${
      order?.customer_name || 'Customer'
    }\nTotal: ৳${order?.total_amount?.toLocaleString('en-BD') || '0'}\n\nPlease confirm my parcel.`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Celebration Card */}
      <div className="text-center p-8 sm:p-12 rounded-3xl bg-white border border-[#e8dece] shadow-xl space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0b4e39] font-serif bg-green-50 px-3 py-1 rounded-full">
            Order Successfully Placed!
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215]">
            Shukran / Thank You for Ordering!
          </h1>
          <p className="text-xs sm:text-sm text-[#6e686c] max-w-md mx-auto">
            Your bespoke outfit from <strong className="text-[#781326]">NAQSH by Farjana</strong> has been registered into our boutique dispatch queue.
          </p>
        </div>

        {/* Order Number Highlight */}
        <div className="p-4 rounded-2xl bg-[#fbf8f3] border border-[#c99834]/40 max-w-md mx-auto">
          <p className="text-[11px] font-bold text-[#8e858a] uppercase tracking-wider">
            Your Order Tracking ID
          </p>
          <p className="font-mono text-2xl font-extrabold text-[#781326] mt-0.5">
            {resolvedParams.orderId}
          </p>
          <p className="text-[11px] text-[#7d757a] mt-1">
            Please save this ID or take a screenshot for reference.
          </p>
        </div>

        {/* Social Confirmation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={whatsappConfirmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#25d366] text-white font-bold text-xs hover:bg-[#1eb956] shadow-md transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Notify Farjana on WhatsApp</span>
          </a>

          <a
            href={BRAND_INFO.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#1877f2] text-white font-bold text-xs hover:bg-[#166fe5] shadow-md transition-all flex items-center gap-2"
          >
            <FacebookIcon className="w-4 h-4" />
            <span>Confirm on Facebook Page</span>
          </a>

          <button
            onClick={handlePrint}
            className="px-6 py-3 rounded-xl bg-gray-100 text-[#383336] font-bold text-xs hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoice Details Card */}
      {order && (
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#e8dece] shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#141215]">
                Order Details
              </h2>
              <p className="text-xs text-[#8e858a]">
                Placed on: {new Date(order.created_at || Date.now()).toLocaleDateString('en-BD', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#781326]/10 text-[#781326] uppercase">
                Payment: {order.payment_method.toUpperCase()}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 uppercase">
                Status: {order.order_status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#fbf8f3] text-xs">
            <div>
              <h3 className="font-bold text-[#141215] uppercase tracking-wider text-[11px] mb-1">
                Recipient Details
              </h3>
              <p className="font-semibold text-sm text-[#781326]">{order.customer_name}</p>
              <p className="text-[#554e53] flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3 text-[#c99834]" />
                {order.customer_phone}
              </p>
              {order.customer_email && (
                <p className="text-[#554e53]">{order.customer_email}</p>
              )}
            </div>

            <div>
              <h3 className="font-bold text-[#141215] uppercase tracking-wider text-[11px] mb-1">
                Delivery Destination
              </h3>
              <p className="text-[#383336] leading-relaxed flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#c99834] shrink-0 mt-0.5" />
                <span>
                  {order.delivery_address}, {order.city}
                </span>
              </p>
              {order.trx_id && (
                <p className="mt-2 text-[#0b4e39] font-mono font-bold text-[11px]">
                  Payment TrxID: {order.trx_id}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#141215]">
              Ordered Outfits
            </h3>
            <div className="divide-y divide-gray-100 border rounded-2xl overflow-hidden border-[#e8dece]">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    {item.product_image && (
                      <div className="w-12 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <img
                          src={item.product_image}
                          alt={item.product_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[#141215]">{item.product_title}</p>
                      <p className="text-[#7d757a] text-[11px]">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-[#141215]">
                    {formatPrice(item.total_price || item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation */}
          <div className="p-4 rounded-2xl bg-[#fbf8f3] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#6e686c]">
              <span>Subtotal:</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#6e686c]">
              <span>Delivery Fee:</span>
              <span>{formatPrice(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between text-base font-serif font-bold text-[#781326] pt-2 border-t border-gray-200">
              <span>Total Payable:</span>
              <span className="text-lg text-[#c99834]">{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-center pt-4">
            <Link
              href={`/track?query=${encodeURIComponent(resolvedParams.orderId)}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#781326] hover:underline"
            >
              <span>Track Live Delivery Progress →</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
