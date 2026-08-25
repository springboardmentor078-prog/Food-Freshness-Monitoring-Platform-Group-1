import { useEffect, useState } from 'react';

const STATUS_BADGES = {
  'Fresh': { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300' },
  'Spoiled': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-300' },
  'Rotten': { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-300' },
};

const REC_STYLES = {
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '💡', text: 'text-blue-300' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '⚠️', text: 'text-amber-300' },
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🚨', text: 'text-red-300' },
};

export default function PredictionResult({ prediction }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const status = prediction?.status || prediction?.freshness_label || 'Fresh';
  const shelfLife = prediction?.shelf_life || (prediction?.remaining_shelf_life ? `${prediction.remaining_shelf_life} Days` : '5-7 Days');
  
  // --- FIXED: backend sends 'rot_percentage' directly as a number (e.g., 11.62), no multiplication needed ---
  const rotPercentage = prediction?.rot_percentage !== undefined ? prediction.rot_percentage : 0;
  
  const score = prediction?.freshness_score || 85;
  const annotatedImage = prediction?.annotated_image || (prediction?.annotated_image_url ? `/uploads/${prediction.annotated_image_url}` : null);
  const recommendations = prediction?.recommendations || [];
  const statusConfig = STATUS_BADGES[status] || STATUS_BADGES['Fresh'];

  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="space-y-6">
      {/* Primary Result Banner */}
      <div className={`glass-card p-6 border ${statusConfig.border} ${statusConfig.bg}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-dark-400 font-semibold">Inspection Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig.badge}`}>
                {status}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Estimated Shelf Life: <span className={statusConfig.text}>{shelfLife}</span>
            </h2>
            <p className="text-dark-300 text-xs mt-1">
              Rot Surface Area: <span className="font-semibold text-white">{rotPercentage}%</span>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-4xl font-extrabold text-white">
              {animatedScore}<span className="text-sm text-dark-400">/100</span>
            </div>
            <span className="text-dark-400 text-[10px] uppercase tracking-wider">Freshness Score</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Status</p>
          <p className={`text-lg font-bold ${statusConfig.text} truncate`}>{status}</p>
          <p className="text-dark-500 text-[11px]">Inspection result</p>
        </div>

        <div className="glass-card p-4 text-center">
          <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Shelf Life</p>
          <p className="text-xl font-bold text-blue-400">{shelfLife}</p>
          <p className="text-dark-500 text-[11px]">Remaining time</p>
        </div>

        <div className="glass-card p-4 text-center">
          <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Rot Area</p>
          <p className={`text-xl font-bold ${rotPercentage > 15 ? 'text-red-400' : rotPercentage > 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {rotPercentage}%
          </p>
          <p className="text-dark-500 text-[11px]">Rot percentage</p>
        </div>

        <div className="glass-card p-4 text-center">
          <p className="text-dark-400 text-xs uppercase tracking-wider mb-1">Fruit Detected</p>
          <p className="text-xl font-bold text-indigo-400 truncate">{prediction?.predicted_class || 'Fruit'}</p>
          <p className="text-dark-500 text-[11px]">YOLOv8n object</p>
        </div>
      </div>

      {/* Annotated Inspection Image */}
      {annotatedImage && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <span>📸</span> Annotated Fruit Inspection Image
            </h3>
            <span className="text-dark-400 text-xs">
              <span className="text-emerald-400 font-semibold">Green Box</span> = Fruit • <span className="text-red-400 font-semibold">Red Contours</span> = Rot Spots
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-dark-950 border border-dark-700/50 flex justify-center">
            <img
              src={annotatedImage}
              alt="Annotated fruit inspection"
              className="max-h-96 w-auto object-contain rounded-xl"
            />
          </div>
          <p className="text-dark-400 text-xs mt-2 text-center">
            Fruit bounding box (Green) & Adaptive Contrast Rot Contours (Red).
          </p>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold text-sm mb-3">💡 AI Recommendations</h3>
          <div className="space-y-2">
            {recommendations.map((rec, i) => {
              const style = REC_STYLES[rec.type] || REC_STYLES.info;
              return (
                <div key={i} className={`p-3 rounded-xl border ${style.border} ${style.bg}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">{style.icon}</span>
                    <div>
                      <p className={`text-sm font-medium ${style.text}`}>{rec.title}</p>
                      <p className="text-dark-300 text-xs mt-0.5 leading-relaxed">{rec.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Model Info */}
      <div className="text-center">
        <p className="text-dark-500 text-xs">
          Model: {prediction?.model_version || 'yolov8n_heuristic_gamble_v1'}
        </p>
      </div>
    </div>
  );
}