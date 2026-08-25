export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', trend }) {
  const colorMap = {
    primary: {
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/20',
      icon: 'text-primary-400',
      value: 'text-primary-400',
      glow: 'shadow-primary-500/5',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
      value: 'text-emerald-400',
      glow: 'shadow-emerald-500/5',
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      icon: 'text-yellow-400',
      value: 'text-yellow-400',
      glow: 'shadow-yellow-500/5',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      icon: 'text-orange-400',
      value: 'text-orange-400',
      glow: 'shadow-orange-500/5',
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: 'text-red-400',
      value: 'text-red-400',
      glow: 'shadow-red-500/5',
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      icon: 'text-indigo-400',
      value: 'text-indigo-400',
      glow: 'shadow-indigo-500/5',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className={`glass-card-hover p-5 ${c.glow}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-dark-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
          {subtitle && (
            <p className="text-dark-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`${c.bg} ${c.border} border p-2.5 rounded-xl`}>
            <Icon className={`w-5 h-5 ${c.icon}`} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-dark-500 text-xs">vs last week</span>
        </div>
      )}
    </div>
  );
}
