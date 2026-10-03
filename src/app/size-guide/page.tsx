import React from 'react';
import Link from 'next/link';
import { Ruler, Sparkles, MessageCircle } from 'lucide-react';
import { BRAND_INFO } from '@/lib/products-data';

export default function SizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#c99834] uppercase tracking-widest font-serif">
          Tailoring & Measurements
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215]">
          Boutique Size Guide
        </h1>
        <p className="text-xs sm:text-sm text-[#6e686c]">
          Standard Bangladesh sizing chart for 3-Piece Salwar Suits, Kurtis, and Sarees.
        </p>
      </div>

      {/* 3-Piece & Kurti Size Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-6">
        <h2 className="font-serif font-bold text-lg text-[#141215] flex items-center gap-2">
          <Ruler className="w-5 h-5 text-[#c99834]" />
          <span>Ready-to-Wear Kameez & Kurti Sizing (Inches)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fbf8f3] text-[#781326] uppercase font-bold text-[11px] border-b border-[#e8dece]">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Bust</th>
                <th className="py-3 px-4">Waist</th>
                <th className="py-3 px-4">Hip</th>
                <th className="py-3 px-4">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[#3d383b]">
              <tr>
                <td className="py-3 px-4 font-bold text-[#141215]">Small (S)</td>
                <td className="py-3 px-4">36"</td>
                <td className="py-3 px-4">32"</td>
                <td className="py-3 px-4">38"</td>
                <td className="py-3 px-4">42" - 44"</td>
              </tr>
              <tr className="bg-[#fbf8f3]/50">
                <td className="py-3 px-4 font-bold text-[#141215]">Medium (M)</td>
                <td className="py-3 px-4">38"</td>
                <td className="py-3 px-4">34"</td>
                <td className="py-3 px-4">40"</td>
                <td className="py-3 px-4">44"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#141215]">Large (L)</td>
                <td className="py-3 px-4">40"</td>
                <td className="py-3 px-4">36"</td>
                <td className="py-3 px-4">42"</td>
                <td className="py-3 px-4">44" - 46"</td>
              </tr>
              <tr className="bg-[#fbf8f3]/50">
                <td className="py-3 px-4 font-bold text-[#141215]">X-Large (XL)</td>
                <td className="py-3 px-4">42"</td>
                <td className="py-3 px-4">38"</td>
                <td className="py-3 px-4">44"</td>
                <td className="py-3 px-4">46"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#141215]">XX-Large (XXL)</td>
                <td className="py-3 px-4">44"</td>
                <td className="py-3 px-4">40"</td>
                <td className="py-3 px-4">46"</td>
                <td className="py-3 px-4">46"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Saree & Shawl Dimensions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-4">
        <h2 className="font-serif font-bold text-lg text-[#141215]">
          Saree & Shawl Dimensions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#554e53]">
          <div className="p-4 rounded-2xl bg-[#fbf8f3] border border-[#e8dece]">
            <h4 className="font-bold text-[#781326] text-sm mb-1">Standard Royal Sarees</h4>
            <p>Length: <strong>6.5 Yards (approx 5.5 meters)</strong> including 80cm unstitched matching/contrast blouse piece.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#fbf8f3] border border-[#e8dece]">
            <h4 className="font-bold text-[#781326] text-sm mb-1">Velvet & Silk Shawls</h4>
            <p>Dimensions: <strong>2.5 Yards Length x 45 Inches Width</strong> with complete edge embroidery & lining.</p>
          </div>
        </div>
      </div>

      {/* Custom Tailoring Assistance Banner */}
      <div className="p-6 rounded-3xl bg-[#600c1c] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-base text-[#f5e6a8]">
            Need Custom Tailoring or Alterations?
          </h3>
          <p className="text-xs text-[#e8dece] mt-0.5">
            Share your custom bust and waist measurements directly with Farjana on WhatsApp.
          </p>
        </div>
        <a
          href={`https://wa.me/${BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[#25d366] text-white text-xs font-bold shrink-0 flex items-center gap-1.5"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Measurements</span>
        </a>
      </div>
    </div>
  );
}
