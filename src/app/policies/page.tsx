import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Phone, HelpCircle } from 'lucide-react';
import { BRAND_INFO } from '@/lib/products-data';

export default function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#c99834] uppercase tracking-widest font-serif">
          Customer Service
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215]">
          Delivery, Payment & Exchange Policies
        </h1>
        <p className="text-xs sm:text-sm text-[#6e686c]">
          Transparent, reliable, and hassle-free shopping across Bangladesh.
        </p>
      </div>

      <div className="space-y-8">
        {/* Shipping & Delivery */}
        <div className="p-8 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-[#781326]">
            <Truck className="w-6 h-6 text-[#c99834]" />
            <h2 className="font-serif font-bold text-lg text-[#141215]">
              1. Delivery Timeline & Shipping Fees
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#554e53] leading-relaxed">
            <p>
              We deliver to all 64 districts in Bangladesh via premier courier partners (SteadFast Courier, Pathao Courier, and RedX).
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Inside Dhaka City:</strong> ৳80 delivery charge (Delivery within 24 to 48 hours).
              </li>
              <li>
                <strong>Dhaka Suburbs (Savar, Gazipur, Narayanganj, Keraniganj):</strong> ৳120 delivery charge (Delivery within 2 to 3 days).
              </li>
              <li>
                <strong>Outside Dhaka (All Over Bangladesh):</strong> ৳150 delivery charge (Delivery within 3 to 5 business days).
              </li>
            </ul>
            <p className="text-[#0b4e39] font-semibold bg-green-50 p-3 rounded-xl">
              ✨ Free Nationwide Delivery is automatically applied on any order above ৳3,000!
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-8 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-[#781326]">
            <ShieldCheck className="w-6 h-6 text-[#c99834]" />
            <h2 className="font-serif font-bold text-lg text-[#141215]">
              2. Payment Options
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#554e53] leading-relaxed">
            <p>We accept the following trusted payment methods:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Cash on Delivery (COD):</strong> Pay in cash directly to the delivery rider after inspecting the sealed packaging.
              </li>
              <li>
                <strong>bKash:</strong> Send Money to our official boutique number: <code className="font-bold text-[#e2136e]">{BRAND_INFO.bkashNumber}</code>.
              </li>
              <li>
                <strong>Nagad:</strong> Send Money to our official boutique number: <code className="font-bold text-[#f7941d]">{BRAND_INFO.nagadNumber}</code>.
              </li>
            </ul>
          </div>
        </div>

        {/* Size Exchange & Returns */}
        <div className="p-8 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-4">
          <div className="flex items-center gap-3 text-[#781326]">
            <RotateCcw className="w-6 h-6 text-[#c99834]" />
            <h2 className="font-serif font-bold text-lg text-[#141215]">
              3. 3-Day Size Exchange Policy
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-[#554e53] leading-relaxed">
            <p>
              We want you to feel utterly regal in your outfit! If the size does not fit you perfectly, you may request an exchange within <strong>3 days</strong> of receiving your parcel.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Items must be in original unworn condition with tags intact.</li>
              <li>Sarees and customized stitched items are eligible for alteration support at our Dhaka studio.</li>
              <li>To initiate an exchange, simply WhatsApp us at <strong>{BRAND_INFO.phone}</strong> or message us on Facebook.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
