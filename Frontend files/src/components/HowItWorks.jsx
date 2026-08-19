import React from 'react';
import { Upload, Scan, Cpu, ClipboardCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Upload / Enter Food Details',
      description: 'Add a photo plus category, temperature, humidity and storage duration.',
      icon: Upload
    },
    {
      step: 'Step 2',
      title: 'Analyze Food',
      description: 'Inputs are normalised into the same feature schema as the training dataset.',
      icon: Scan
    },
    {
      step: 'Step 3',
      title: 'AI Predicts Freshness',
      description: 'The model returns freshness score, spoilage probability and shelf life.',
      icon: Cpu
    },
    {
      step: 'Step 4',
      title: 'Get Recommendations',
      description: 'Receive storage, rotation and consumption guidance to cut waste.',
      icon: ClipboardCheck
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-[#f6faf6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-2 max-w-2xl">
            Four steps from produce to prediction — designed to plug straight into a FastAPI + XGBoost service.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-emerald-100/70 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold text-gray-700 tracking-wide uppercase">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-gray-900 leading-snug">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
