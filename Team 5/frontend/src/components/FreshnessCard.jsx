import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  'Fresh': {
    badge: 'badge-fresh',
    color: '#10b981',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    emoji: '🟢',
  },
  'Good': {
    badge: 'badge-good',
    color: '#22c55e',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    emoji: '🟡',
  },
  'Acceptable': {
    badge: 'badge-acceptable',
    color: '#eab308',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    emoji: '🟠',
  },
  'Near Spoilage': {
    badge: 'badge-near-spoilage',
    color: '#f97316',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    emoji: '🔴',
  },
  'Spoiled': {
    badge: 'badge-spoiled',
    color: '#ef4444',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    emoji: '⛔',
  },
};

export default function FreshnessCard({ item, onClick }) {
  const navigate = useNavigate();
  const config = STATUS_CONFIG[item.status] || STATUS_CONFIG['Fresh'];

  return (
    <div
      onClick={onClick}
      className={`glass-card-hover p-5 cursor-pointer border-l-4`}
      style={{ borderLeftColor: config.color }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-base">{item.name}</h3>
          <p className="text-dark-400 text-xs mt-0.5">{item.category}</p>
        </div>
        <span className={config.badge}>{item.status}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex flex-col">
          <span className="text-dark-500">Storage</span>
          <span className="text-dark-300 capitalize">{item.storage_type}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-dark-500">Qty</span>
          <span className="text-dark-300">{item.quantity}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-dark-500">Temperature</span>
          <span className="text-dark-300">{item.temperature ?? '—'}°C</span>
        </div>
        <div className="flex flex-col">
          <span className="text-dark-500">Humidity</span>
          <span className="text-dark-300">{item.humidity ?? '—'}%</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-dark-700/30 flex items-center justify-between">
        <span className="text-dark-500 text-xs">
          Purchased: {new Date(item.purchase_date).toLocaleDateString()}
        </span>
        
        {/* --- FIXED: This now navigates to the history page --- */}
        <span 
          className="text-primary-400 text-xs font-medium hover:text-primary-300 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/history/${item.id}`);
          }}
        >
          View Details →
        </span>
      </div>
    </div>
  );
}