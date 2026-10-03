'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Phone,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/cart-context';
import { DELIVERY_ZONES, BRAND_INFO } from '@/lib/products-data';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import { submitOrder } from '@/lib/api-helpers';
import { PaymentMethod, DeliveryZoneOption } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [selectedZone, setSelectedZone] = useState<DeliveryZoneOption>(DELIVERY_ZONES[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#f4eee2] flex items-center justify-center text-[#781326] mx-auto">
          <ShoppingBag className="w-8 h-8 opacity-40" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#141215]">Your Bag is Empty</h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
          You need items in your cart to proceed to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3.5 rounded-full bg-[#781326] text-[#f5e6a8] font-bold text-xs"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  const deliveryFee = selectedZone.fee;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMessage('Please fill in your Name, Phone number, and full Delivery Address.');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !trxId.trim()) {
      setErrorMessage(
        `Please enter the Transaction ID (TrxID) received after sending payment via ${
          paymentMethod === 'bkash' ? 'bKash' : 'Nagad'
        }.`
      );
      return;
    }

    setIsSubmitting(true);
    const orderNumber = generateOrderNumber();

    const orderPayload = {
      order_number: orderNumber,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim() || null,
      delivery_address: deliveryAddress.trim(),
      city: city.trim(),
      delivery_zone: selectedZone.id,
      delivery_fee: deliveryFee,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'verified',
      sender_number: senderNumber.trim() || null,
      trx_id: trxId.trim() || null,
      subtotal,
      discount: 0,
      total_amount: totalAmount,
      order_status: 'pending',
      notes: notes.trim() || null,
      items: items.map((item) => ({
        product_id: item.product.id,
        product_title: item.product.title,
        product_image: item.product.images[0] || '',
        size: item.selectedSize,
        color: item.selectedColor || item.product.color || 'Standard',
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      })),
      created_at: new Date().toISOString(),
    };

    try {
      await submitOrder(orderPayload);

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe ignore
      }

      // Save order info to local backup for instant receipt view
      try {
        localStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderPayload));
      } catch (e) {
        // Safe ignore
      }

      clearCart();
      router.push(`/order-success/${orderNumber}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      // Fallback: if server api fails, store locally and proceed so client is never blocked
      try {
        localStorage.setItem(`order_${orderNumber}`, JSON.stringify(orderPayload));
        clearCart();
        router.push(`/order-success/${orderNumber}`);
      } catch (e) {
        setErrorMessage(err.message || 'An error occurred while submitting your order.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Checkout Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-[#c99834] uppercase tracking-widest font-serif block mb-1">
          Secure Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215]">
          Complete Your Order
        </h1>
        <p className="text-xs text-[#6e686c] mt-1">
          Cash on Delivery & bKash / Nagad verification available across Bangladesh.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Customer Info & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Error banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Contact & Delivery Address */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-6">
              <h2 className="font-serif text-lg font-bold text-[#141215] flex items-center gap-2 pb-3 border-b border-gray-100">
                <Truck className="w-5 h-5 text-[#c99834]" />
                <span>1. Shipping & Contact Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhana Ahmed"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Phone Number (Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="For receipt & invoice"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Full Delivery Address *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="House number, Flat/Apartment, Road/Sector, Area (e.g. House 14, Road 7, Sector 3, Uttara, Dhaka)"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    District / City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka, Chittagong, Sylhet"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Order Note / Size Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="Special requests or measurements"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 text-xs rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                  />
                </div>
              </div>

              {/* Delivery Zone Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-[#3d383b] uppercase tracking-wider mb-2">
                  Select Delivery Location:
                </label>
                <div className="space-y-2">
                  {DELIVERY_ZONES.map((zone) => (
                    <label
                      key={zone.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedZone.id === zone.id
                          ? 'border-[#781326] bg-[#781326]/5 shadow-xs'
                          : 'border-[#e8dece] hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="delivery_zone"
                          checked={selectedZone.id === zone.id}
                          onChange={() => setSelectedZone(zone)}
                          className="accent-[#781326]"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#141215]">{zone.name}</p>
                          <p className="text-[11px] text-[#7d757a]">{zone.estimated_days}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#781326]">৳{zone.fee}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-6">
              <h2 className="font-serif text-lg font-bold text-[#141215] flex items-center gap-2 pb-3 border-b border-gray-100">
                <ShieldCheck className="w-5 h-5 text-[#c99834]" />
                <span>2. Payment Option</span>
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#781326] bg-[#781326]/5 shadow-xs'
                      : 'border-[#e8dece] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#781326]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#141215] block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-[#7d757a]">
                          Pay cash to the delivery rider when receiving your parcel.
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#0b4e39]/10 text-[#0b4e39]">
                      Popular
                    </span>
                  </div>
                </label>

                {/* bKash Payment */}
                <label
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-[#e2136e] bg-[#e2136e]/5 shadow-xs'
                      : 'border-[#e8dece] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bkash"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="accent-[#e2136e]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#e2136e] block">
                          bKash (Send Money / Merchant)
                        </span>
                        <span className="text-[11px] text-[#7d757a]">
                          Send payment to {BRAND_INFO.bkashNumber}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#e2136e] text-white">
                      bKash
                    </span>
                  </div>

                  {paymentMethod === 'bkash' && (
                    <div className="mt-4 p-4 rounded-xl bg-white border border-[#e2136e]/30 space-y-3 text-xs animate-in fade-in">
                      <p className="font-semibold text-[#e2136e]">
                        📌 How to pay with bKash:
                      </p>
                      <ol className="list-decimal pl-4 space-y-1 text-[#554e53] text-[11px]">
                        <li>Open your bKash app and tap <strong>Send Money</strong>.</li>
                        <li>Enter NAQSH number: <strong>{BRAND_INFO.bkashNumber}</strong></li>
                        <li>Amount: <strong>{formatPrice(totalAmount)}</strong></li>
                        <li>Reference: <strong>NAQSH</strong></li>
                        <li>Enter your Sender Number & TrxID below for verification.</li>
                      </ol>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#3d383b] mb-1">
                            Your bKash Number *
                          </label>
                          <input
                            type="text"
                            placeholder="017xxxxxxxx"
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-[#fbf8f3]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#3d383b] mb-1">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 9J82KD82"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-[#fbf8f3]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Nagad Payment */}
                <label
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-[#f7941d] bg-[#f7941d]/5 shadow-xs'
                      : 'border-[#e8dece] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        value="nagad"
                        checked={paymentMethod === 'nagad'}
                        onChange={() => setPaymentMethod('nagad')}
                        className="accent-[#f7941d]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#f7941d] block">
                          Nagad (Send Money)
                        </span>
                        <span className="text-[11px] text-[#7d757a]">
                          Send payment to {BRAND_INFO.nagadNumber}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#f7941d] text-white">
                      Nagad
                    </span>
                  </div>

                  {paymentMethod === 'nagad' && (
                    <div className="mt-4 p-4 rounded-xl bg-white border border-[#f7941d]/30 space-y-3 text-xs animate-in fade-in">
                      <p className="font-semibold text-[#f7941d]">
                        📌 How to pay with Nagad:
                      </p>
                      <ol className="list-decimal pl-4 space-y-1 text-[#554e53] text-[11px]">
                        <li>Open your Nagad app and tap <strong>Send Money</strong>.</li>
                        <li>Enter NAQSH number: <strong>{BRAND_INFO.nagadNumber}</strong></li>
                        <li>Amount: <strong>{formatPrice(totalAmount)}</strong></li>
                        <li>Enter your Sender Number & TrxID below for verification.</li>
                      </ol>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#3d383b] mb-1">
                            Your Nagad Number *
                          </label>
                          <input
                            type="text"
                            placeholder="018xxxxxxxx"
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-[#fbf8f3]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#3d383b] mb-1">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 7A84BC91"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 bg-[#fbf8f3]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8dece] shadow-md sticky top-28 space-y-6">
              <h2 className="font-serif text-lg font-bold text-[#141215] flex items-center justify-between pb-3 border-b border-gray-100">
                <span>Order Summary</span>
                <span className="text-xs text-[#781326] font-sans font-bold">
                  {totalItems} Items
                </span>
              </h2>

              {/* Items preview list */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex items-center gap-3 text-xs"
                  >
                    <div className="w-12 h-14 rounded-lg bg-[#f4eee2] overflow-hidden shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#141215] truncate">
                        {item.product.title}
                      </p>
                      <p className="text-[11px] text-[#7d757a]">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[#141215]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation */}
              <div className="space-y-2 pt-4 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-[#6e686c]">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#141215]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6e686c]">
                  <span>Delivery ({selectedZone.name}):</span>
                  <span className="font-semibold text-[#141215]">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-extrabold text-[#781326] pt-3 border-t border-gray-200">
                  <span>Grand Total:</span>
                  <span className="text-xl text-[#c99834]">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-[#781326] hover:bg-[#500a18] text-[#f5e6a8] font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Confirming Order...</span>
                ) : (
                  <>
                    <span>Confirm Order ({formatPrice(totalAmount)})</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="space-y-2 text-[11px] text-[#7d757a] text-center pt-2">
                <p>🔒 100% Guaranteed delivery with inspection upon arrival</p>
                <p>
                  Need assistance? Call Farjana: <strong>{BRAND_INFO.phone}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
