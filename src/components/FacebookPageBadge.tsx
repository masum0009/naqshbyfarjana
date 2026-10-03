import React from 'react';
import { MessageCircle, Heart, Star, CheckCircle2 } from 'lucide-react';
import { FacebookIcon } from '@/components/Icons';
import { BRAND_INFO } from '@/lib/products-data';

export default function FacebookPageBadge() {
  return (
    <section className="py-12 bg-[#600c1c] text-white relative overflow-hidden border-y border-[#c99834]/40">
      {/* Subtle background glow */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#c99834]/15 blur-3xl" />
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-black/30 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left info */}
          <div className="text-center lg:text-left space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#f5e6a8] text-xs font-semibold backdrop-blur-xs">
              <FacebookIcon className="w-3.5 h-3.5 text-[#1877f2]" />
              <span>Official Facebook Boutique</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Connect with <span className="text-[#f5e6a8]">NAQSH by Farjana</span> on Facebook
            </h3>

            <p className="text-xs sm:text-sm text-[#f4eee2]/90 leading-relaxed font-light">
              Follow our page for daily live videos, new fabric arrivals, customer reviews, styling tips, and private pre-order inquiries directly with designer Farjana.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-[#f5e6a8]">
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#c99834]" /> Verified Boutique
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Star className="w-4 h-4 fill-[#c99834] text-[#c99834]" /> 5.0 Star Rated Collection
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> Loved by 50,000+ Queens
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href={BRAND_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <FacebookIcon className="w-5 h-5" />
              <span>Visit Facebook Page</span>
            </a>

            <a
              href={BRAND_INFO.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-[#600c1c] hover:bg-[#fbf8f3] font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-[#0084ff]" />
              <span>Send Message</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
