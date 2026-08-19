import React from 'react';
import { Bell, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import AnalysisCard from './AnalysisCard';

export default function HeroSection({ apiUrl, user, onRequireAuth, onAnalysisSuccess, onError, loading, setLoading }) {
  
  const scrollToForm = (e) => {
    e.preventDefault();
    const el = document.getElementById('hero-card');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStats = (e) => {
    e.preventDefault();
    const el = document.getElementById('analytics');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-16 md:pb-24 bg-fresh-gradient overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-green-50/20 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-medium shadow-sm backdrop-blur-md">
              <Bell className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>AI-powered food freshness and shelf-life monitoring</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.12]">
              Know Your Food.{' '}
              <span className="block text-emerald-600 font-black mt-1">
                Reduce Your Waste.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
              Use AI-powered freshness analysis to monitor food quality, estimate shelf life, detect spoilage risk, and receive intelligent storage recommendations.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 transition-all duration-150"
              >
                <span>Analyze Food</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={scrollToStats}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-bold text-sm sm:text-base border border-gray-200 hover:border-emerald-300 shadow-sm transition-all duration-150"
              >
                <span>Explore Dashboard</span>
              </button>
            </div>

            {/* Key Value Props */}
            <div className="pt-6 border-t border-emerald-100/60 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">98% Model Accuracy</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Instant AI Scan</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-700">Smart Storage Tips</span>
              </div>
            </div>

          </div>

          {/* Right Side: Analysis Card */}
          <div className="lg:col-span-6 flex justify-center">
            <AnalysisCard
              apiUrl={apiUrl}
              user={user}
              onRequireAuth={onRequireAuth}
              onAnalysisSuccess={onAnalysisSuccess}
              onError={onError}
              loading={loading}
              setLoading={setLoading}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
