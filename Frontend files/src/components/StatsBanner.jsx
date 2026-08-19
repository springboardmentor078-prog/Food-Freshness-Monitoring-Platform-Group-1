import React from 'react';

export default function StatsBanner() {
  const stats = [
    { value: '20+', label: 'Food Categories' },
    { value: '7,500+', label: 'Training Samples' },
    { value: '98%', label: 'AI Freshness Analysis' },
    { value: '7 days', label: 'Shelf-Life Prediction' },
  ];

  return (
    <section id="analytics" className="py-12 bg-[#f6faf6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-sm border border-emerald-100/60 hover:shadow-md hover:border-emerald-200 transition-all duration-200 group"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight group-hover:scale-105 transition-transform duration-200">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-500 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
