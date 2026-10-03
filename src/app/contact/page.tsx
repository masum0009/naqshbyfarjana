'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { FacebookIcon } from '@/components/Icons';
import { BRAND_INFO } from '@/lib/products-data';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#c99834] uppercase tracking-widest font-serif">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#141215]">
          Contact NAQSH by Farjana
        </h1>
        <p className="text-xs sm:text-sm text-[#6e686c]">
          We would love to assist you with order inquiries, bridal appointments, and boutique styling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Studio */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-[#e8dece] shadow-xs space-y-6">
            <h2 className="font-serif font-bold text-lg text-[#141215] pb-3 border-b border-gray-100">
              Dhaka Studio & Support
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#c99834] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141215] block">Studio Address:</strong>
                  <p className="text-[#6e686c] mt-0.5">{BRAND_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#c99834] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141215] block">Hotline & Customer Care:</strong>
                  <p className="text-[#6e686c] mt-0.5">{BRAND_INFO.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#c99834] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141215] block">Email:</strong>
                  <p className="text-[#6e686c] mt-0.5">{BRAND_INFO.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#c99834] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#141215] block">Operating Hours:</strong>
                  <p className="text-[#6e686c] mt-0.5">Saturday – Thursday: 10:00 AM – 9:00 PM</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <span className="text-[11px] font-bold text-[#8e858a] uppercase block">
                Instant Chat Channels:
              </span>
              <div className="flex flex-col gap-2">
                <a
                  href={BRAND_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1877f2] text-white text-xs font-bold shadow-xs hover:bg-[#166fe5] transition-colors"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span>Facebook Page (@NAQSH.by.Farjana)</span>
                </a>
                <a
                  href={`https://wa.me/${BRAND_INFO.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25d366] text-white text-xs font-bold shadow-xs hover:bg-[#1eb956] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Direct ({BRAND_INFO.whatsappDisplay})</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8dece] shadow-md space-y-6">
            <h2 className="font-serif font-bold text-xl text-[#141215]">
              Send a Message to Farjana
            </h2>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-green-50 text-center space-y-3 text-green-800">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <h3 className="font-serif font-bold text-lg">Message Sent Successfully!</h3>
                <p className="text-xs text-green-700">
                  Thank you! Farjana or our senior stylist will get back to you via phone or WhatsApp shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="017xxxxxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Order Inquiry / Bridal Appointment"
                      className="w-full px-4 py-3 rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#3d383b] uppercase tracking-wider mb-1.5">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us which outfit you are interested in or what custom sizing you need..."
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dece] focus:outline-none focus:ring-2 focus:ring-[#781326] bg-[#fbf8f3]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#781326] text-[#f5e6a8] font-bold text-xs hover:bg-[#500a18] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
