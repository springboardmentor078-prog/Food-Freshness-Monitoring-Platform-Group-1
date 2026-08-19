import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Lightbulb, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  Activity,
  Layers,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

export default function ResultDashboard({ result, uploadedImagePreview, onReset }) {
  if (!result || !result.results) return null;

  const { results, recommendations } = result;

  const isFresh = results.freshness_status?.toLowerCase() === 'fresh';
  const isSpoiled = results.freshness_status?.toLowerCase() === 'spoiled';

  // Determine status color scheme
  const statusBadgeBg = isFresh 
    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
    : isSpoiled 
    ? 'bg-red-50 text-red-700 border-red-300' 
    : 'bg-amber-50 text-amber-700 border-amber-300';

  const statusTextColor = isFresh ? 'text-emerald-600' : isSpoiled ? 'text-red-600' : 'text-amber-600';
  const statusIcon = isFresh ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />;

  // Display Image: base64 high resolution detection output if present, or fallback preview
  const displayImage = results.highlighted_image_base64 
    ? (results.highlighted_image_base64.startsWith('data:') 
        ? results.highlighted_image_base64 
        : `data:image/jpeg;base64,${results.highlighted_image_base64}`)
    : uploadedImagePreview;

  return (
    <section id="result-dashboard" className="py-12 bg-emerald-50/40 border-y border-emerald-100/80 transition-all duration-500 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-emerald-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> AI Detection Completed
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Freshness & Shelf-Life Report
            </h2>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 text-sm font-bold border border-gray-200 shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span>Analyze Another Item</span>
          </button>
        </div>

        {/* Dashboard Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 1. Visuals Column (4 cols on lg) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={results.food_name || 'Analyzed produce item'}
                  className="w-full h-64 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-50 text-gray-400">
                  <span>No image available</span>
                </div>
              )}
              
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Computer Vision Bounding Box</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
                {results.food_category || 'Produce Category'}
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                {results.food_name || 'Food Item'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Scanned via FreshSense AI Neural Model v2.4
              </p>
            </div>
          </div>

          {/* 2. Metrics Column (4 cols on lg) - 3 distinct stat cards */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Stat Card 1: Freshness Status */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Freshness Status
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold border ${statusBadgeBg}`}>
                  {statusIcon}
                  <span>{results.freshness_status}</span>
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className={`text-3xl font-black ${statusTextColor}`}>
                  {results.freshness_status}
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-medium block">Confidence</span>
                  <span className="text-lg font-bold text-gray-800">
                    {results.confidence_score !== undefined ? `${results.confidence_score}%` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Confidence progress bar */}
              <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isFresh ? 'bg-emerald-500' : isSpoiled ? 'bg-red-500' : 'bg-amber-500'}`} 
                  style={{ width: `${Math.min(100, results.confidence_score || 95)}%` }}
                ></div>
              </div>
            </div>

            {/* Stat Card 2: Spoilage Risk */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Spoilage & Surface Risk
                </span>
                <div className="p-2 rounded-full bg-red-50 text-red-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black text-gray-900">
                  {results.surface_damage_percentage !== undefined ? `${results.surface_damage_percentage}%` : '0%'}
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  Surface Decay Score
                </span>
              </div>

              {/* Surface damage visual indicator */}
              <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full" 
                  style={{ width: `${Math.min(100, Math.max(5, results.surface_damage_percentage || 0))}%` }}
                ></div>
              </div>
            </div>

            {/* Stat Card 3: Shelf Life */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Estimated Shelf Life
                </span>
                <div className="p-2 rounded-full bg-emerald-50 text-emerald-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black text-emerald-700">
                  {results.remaining_shelf_life_days} <span className="text-lg font-bold text-gray-600">Days</span>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Optimal Window
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Based on continuous atmospheric decay curves under current temperature & humidity.
              </p>
            </div>

          </div>

          {/* 3. Smart Storage Guide Column (4 cols on lg) - Soft Blue Tinted Card */}
          <div className="lg:col-span-4 bg-gradient-to-br from-blue-50/90 via-sky-50/60 to-indigo-50/40 rounded-3xl p-6 sm:p-7 shadow-md border border-blue-200/70 space-y-6">
            
            {/* Guide Header */}
            <div className="flex items-center gap-3 border-b border-blue-200/60 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-950">Smart Storage Guide</h3>
                <p className="text-xs text-blue-700/80">AI Recommended Preservation Actions</p>
              </div>
            </div>

            {/* Recommended Action */}
            <div className="bg-white/80 rounded-2xl p-4 border border-blue-100 shadow-sm">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1">
                Recommended Action
              </span>
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {recommendations?.recommended_action || 'Store properly in a cool, dry place.'}
              </p>
            </div>

            {/* Storage Location */}
            <div className="bg-white/80 rounded-2xl p-4 border border-blue-100 shadow-sm">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Ideal Storage Location
              </span>
              <p className="text-sm font-extrabold text-blue-950">
                {recommendations?.ideal_storage_location || 'Refrigerator (2°C - 4°C)'}
              </p>
            </div>

            {/* Handling Tips bulleted list */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 block mb-2.5">
                Handling & Preservation Tips
              </span>
              
              <ul className="space-y-2.5">
                {recommendations?.handling_tips && recommendations.handling_tips.length > 0 ? (
                  recommendations.handling_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 bg-white/60 p-2.5 rounded-xl border border-blue-100/70">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-normal font-medium">{tip}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-600">Keep produce in sealed breathable containers.</li>
                )}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
