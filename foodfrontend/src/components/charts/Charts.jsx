import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, AreaChart, Area, LineChart, Line
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const chartColors = {
  primary: '#10B981',
  secondary: '#2563EB',
  accent: '#F59E0B',
  danger: '#EF4444',
  success: '#22C55E',
};

const CustomTooltip = ({ active, payload, label }) => {
  const { isDark } = useAuth();
  if (active && payload && payload.length) {
    return (
      <div className={`px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-xl ${
        isDark ? 'bg-slate-800/95 border-slate-700 text-slate-200' : 'bg-white/95 border-slate-100 text-slate-800'
      }`}>
        {label && <p className="font-bold text-sm mb-1">{label}</p>}
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            <span className="font-medium">{entry.name || entry.dataKey}:</span>
            <span className="font-bold">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const LegendItem = ({ value, color }) => {
  const { isDark } = useAuth();
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
      <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{value}</span>
    </div>
  );
};

export const PieChartCard = ({ data, title, subtitle, height = 280 }) => {
  const { isDark } = useAuth();
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          {title && <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div style={{ height }} className="mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color || Object.values(chartColors)[i % 5]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
        {data.map((d, i) => (
          <LegendItem key={i} value={`${d.name} (${d.value})`} color={d.color || Object.values(chartColors)[i % 5]} />
        ))}
      </div>
    </div>
  );
};

export const BarChartCard = ({ data, title, subtitle, dataKeys = [{ key: 'value', name: 'Value', color: chartColors.primary }], height = 300 }) => {
  const { isDark } = useAuth();
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          {title && <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex gap-3 flex-wrap">
          {dataKeys.map((dk, i) => (
            <LegendItem key={i} value={dk.name} color={dk.color} />
          ))}
        </div>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
            {dataKeys.map((dk, i) => (
              <Bar key={i} dataKey={dk.key} name={dk.name} fill={dk.color} radius={[8, 8, 0, 0]} animationDuration={1000} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const AreaChartCard = ({ data, title, subtitle, dataKeys = [{ key: 'value', name: 'Value', color: chartColors.primary }], height = 300 }) => {
  const { isDark } = useAuth();
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          {title && <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex gap-3 flex-wrap">
          {dataKeys.map((dk, i) => (
            <LegendItem key={i} value={dk.name} color={dk.color} />
          ))}
        </div>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {dataKeys.map((dk, i) => (
                <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={dk.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={dk.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((dk, i) => (
              <Area
                key={i}
                type="monotone"
                dataKey={dk.key}
                name={dk.name}
                stroke={dk.color}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#gradient-${i})`}
                animationDuration={1000}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const LineChartCard = ({ data, title, subtitle, dataKeys = [{ key: 'value', name: 'Value', color: chartColors.secondary }], height = 280 }) => {
  const { isDark } = useAuth();
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          {title && <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex gap-3 flex-wrap">
          {dataKeys.map((dk, i) => (
            <LegendItem key={i} value={dk.name} color={dk.color} />
          ))}
        </div>
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {dataKeys.map((dk, i) => (
                <linearGradient key={i} id={`line-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={dk.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={dk.color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip content={<CustomTooltip />} />
            {dataKeys.map((dk, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={dk.key}
                name={dk.name}
                stroke={`url(#line-grad-${i})`}
                strokeWidth={3}
                dot={{ r: 5, fill: dk.color, strokeWidth: 2, stroke: isDark ? '#0f172a' : '#ffffff' }}
                activeDot={{ r: 8 }}
                animationDuration={1200}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
