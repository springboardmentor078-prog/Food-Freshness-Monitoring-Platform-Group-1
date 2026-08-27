import React from 'react';
import { Leaf, ArrowRight, Heart } from 'lucide-react';

export default function CtaFooter({ onStartAnalysis }) {
  
  const handleScrollToTop = (e) => {
    e.preventDefault();
    if (onStartAnalysis) {
      onStartAnalysis();
    } else {
      const el = document.getElementById('hero-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="about" className="bg-[#f6faf6] pt-12 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wide Green CTA Banner (Matching Screenshot 4) */}
        <div className="bg-emerald-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-emerald-600/20 mb-16 relative overflow-hidden">
          
          {/* Subtle background circles decoration */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-700/50 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Start monitoring your food freshness today.
            </h2>
            <p className="text-emerald-100 text-base sm:text-lg font-medium max-w-xl mx-auto">
              Run an AI analysis in seconds and see freshness, spoilage risk and shelf life in one place.
            </p>
            <div className="pt-4">
              <button
                onClick={handleScrollToTop}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-base shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>Start Analysis</span>
                <ArrowRight className="w-5 h-5 text-emerald-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Main Content (Matching Screenshot 4) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-200/60">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <Leaf className="w-4 h-4 fill-white/20" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                Food<span className="text-emerald-600 font-black">Freshness</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              AI-powered food freshness and shelf-life monitoring for households, retailers and warehouses.
            </p>
          </div>

          {/* Footer Nav Links */}
          <div className="md:col-span-6 flex flex-wrap md:justify-end items-center gap-6 sm:gap-8 text-sm font-bold text-gray-600">
            <a href="#home" onClick={handleScrollToTop} className="hover:text-emerald-600 transition-colors">
              Dashboard
            </a>
            <a href="#hero-card" onClick={handleScrollToTop} className="hover:text-emerald-600 transition-colors">
              Analyze
            </a>
            <a href="#analytics" className="hover:text-emerald-600 transition-colors">
              Analytics
            </a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#about" className="hover:text-emerald-600 transition-colors">
              About
            </a>
            <a href="#login" onClick={(e) => { e.preventDefault(); alert("Enterprise login portal"); }} className="hover:text-emerald-600 transition-colors">
              Login
            </a>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500">
          <p>© {new Date().getFullYear()} FoodFreshness AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with React, Tailwind CSS & XGBoost AI Vision
          </p>
        </div>

      </div>
    </footer>
  );
}
