import React from 'react';
import { ShieldCheck, Gauge, TrendingUp, Cpu, Thermometer, Boxes } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      title: 'Freshness Detection',
      description: 'Classify produce across five freshness states from Fresh to Spoiled.',
      icon: ShieldCheck
    },
    {
      title: 'Spoilage Risk',
      description: 'Probability scoring that flags batches before they become waste.',
      icon: Gauge
    },
    {
      title: 'Shelf-Life Prediction',
      description: 'Day-by-day freshness decline curves and predicted expiry windows.',
      icon: TrendingUp
    },
    {
      title: 'Freshness Score',
      description: 'Weighted score from visual condition, storage, shelf life and product age.',
      icon: Cpu
    },
    {
      title: 'Storage Recommendations',
      description: 'Temperature, humidity and packaging guidance per category.',
      icon: Thermometer
    },
    {
      title: 'Inventory Monitoring',
      description: 'Track batches, expiry dates and quality health in one dashboard.',
      icon: Boxes
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Features
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-2 max-w-2xl">
            Everything a quality team needs to keep produce fresh and inventory moving.
          </p>
        </div>

        {/* 6 Features 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const IconComp = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-emerald-100/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <IconComp className="w-5 h-5" />
                </div>
                
                <h3 className="text-lg font-extrabold text-gray-900">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
