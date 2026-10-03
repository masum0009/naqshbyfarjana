'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  AlertCircle,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { BRAND_INFO } from '@/lib/products-data';
import { formatPrice } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleTrackSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);

    try {
      // Check local storage first
      const local = localStorage.getItem(`order_${queryToSearch.trim()}`);
      if (local) {
        setOrder(JSON.parse(local));
        setLoading(false);
        return;
      }

      // Query API
      const res = await fetch(`/api/track?query=${encodeURIComponent(queryToSearch.trim())}`);
      const data = await res.json();

      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setNotFound(true);
      }
    } catch (e) {
      console.error(e);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleTrackSearch(initialQuery);
    }
  }, [initialQuery]);

  const stages: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'pending', label: 'Order Placed', desc: 'Order received in boutique system' },
    { key: 'confirmed', label: 'Confirmed & Prepared', desc: 'Fabric verified & tailored' },
    { key: 'processing', label: 'Quality Check & Packing', desc: 'Luxury sealed packaging' },
    { key: 'shipped', label: 'In Transit / Courier', desc: 'Handed to SteadFast / Pathao' },
    { key: 'delivered', label: 'Delivered', desc: 'Parcel safely received' },
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStageIndex = order ? getStageIndex(order.order_status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#781326]/10 text-[#781326] text-xs font-bold uppercase tracking-wider mb-2">
          <Truck className="w-3.5 h-3.5 text-[#c99834]" />
          <span>Real-Time Tracking</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215]">
          Track Your Outfit
        </h1>
        <p className="text-xs sm:text-sm text-[#6e686c] mt-1">
          Enter your Order Number (e.g. <strong className="text-[#781326]">NQ-849201</strong>) or Mobile Phone to check live dispatch status.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTrackSearch(searchQuery);
        }}
        className="max-w-xl mx-auto mb-12"
      >
        <div className="flex gap-2 p-2 bg-white rounded-2xl border border-[#d9af4f] shadow-md">
          <input
            type="text"
            placeholder="Order ID (e.g. NQ-1234) or Phone (017...)"
            required
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl focus:outline-none bg-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-xs hover:bg-[#500a18] transition-all flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </div>
      </form>

      {/* Not Found state */}
      {notFound && (
        <div className="p-8 rounded-3xl bg-white border border-[#e8dece] text-center space-y-3 max-w-xl mx-auto shadow-sm">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#141215]">
            No Order Found for "{searchQuery}"
          </h3>
          <p className="text-xs text-[#7d757a]">
            Please double-check your Order Number or phone number. If you placed the order via Facebook Messenger, you can reach out directly to Farjana.
          </p>
          <a
            href={BRAND_INFO.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877f2] text-white text-xs font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask Farjana on Messenger</span>
          </a>
        </div>
      )}

      {/* Order Tracking Progress Display */}
      {order && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Status Header */}
          <div className="p-6 rounded-3xl bg-white border border-[#e8dece] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#8e858a] tracking-wider">
                Order Tracking Summary
              </span>
              <h2 className="font-mono text-2xl font-extrabold text-[#781326] mt-0.5">
                {order.order_number}
              </h2>
              <p className="text-xs text-[#6e686c] mt-0.5">
                Recipient: <strong className="text-[#141215]">{order.customer_name}</strong> • Phone: {order.customer_phone}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  order.order_status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.order_status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-[#781326]/10 text-[#781326]'
                }`}
              >
                Status: {order.order_status}
              </span>
              <span className="text-[11px] text-[#8e858a]">
                Placed on: {new Date(order.created_at).toLocaleDateString('en-BD')}
              </span>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8dece] shadow-md">
            <h3 className="font-serif font-bold text-base text-[#141215] mb-6">
              Live Dispatch Timeline
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-[#e8dece] ml-4">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.key} className="relative">
                    {/* Circle icon marker */}
                    <div
                      className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'bg-[#781326] text-[#f5e6a8] border-[#c99834] scale-110 shadow-md ring-4 ring-[#781326]/10'
                          : isPassed
                          ? 'bg-[#0b4e39] text-white border-[#0b4e39]'
                          : 'bg-white text-gray-300 border-gray-300'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          isCurrent
                            ? 'text-[#781326]'
                            : isPassed
                            ? 'text-[#141215]'
                            : 'text-gray-400'
                        }`}
                      >
                        {stage.label}
                      </h4>
                      <p className="text-[11px] text-[#7d757a] mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Outfits Breakdown */}
          <div className="p-6 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#141215]">
              Items in This Shipment
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.product_image && (
                      <div className="w-10 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        <img
                          src={item.product_image}
                          alt={item.product_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[#141215]">{item.product_title}</p>
                      <p className="text-[#8e858a] text-[11px]">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#781326]">
                    {formatPrice(item.total_price || item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="font-medium text-[#6e686c]">Total Amount:</span>
              <span className="font-bold text-sm text-[#c99834]">
                {formatPrice(order.total_amount)} ({order.payment_method.toUpperCase()})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading order tracker...</div>}>
      <TrackContent />
    </Suspense>
  );
}
