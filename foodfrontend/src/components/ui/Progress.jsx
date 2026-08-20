import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'primary',
  showLabel = false,
  animated = true,
  size = 'md',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  const percentage = Math.min((displayValue / max) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayValue(value), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const colors = {
    primary: 'bg-gradient-to-r from-primary-400 to-primary-600',
    secondary: 'bg-gradient-to-r from-secondary-400 to-secondary-600',
    accent: 'bg-gradient-to-r from-accent-400 to-accent-600',
    danger: 'bg-gradient-to-r from-danger-400 to-danger-600',
    success: 'bg-gradient-to-r from-success-400 to-success-600',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Progress</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={cn('h-full rounded-full', colors[color])}
        />
      </div>
    </div>
  );
};

export const CircularProgress = ({
  value = 75,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#10B981',
  label,
  sublabel,
  className = '',
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((animatedValue / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 200);
    return () => clearTimeout(timer);
  }, [value]);

  const id = `grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold bg-gradient-to-b from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          {Math.round(percentage)}%
        </span>
        {label && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</span>}
        {sublabel && <span className="text-[10px] text-slate-400 dark:text-slate-500">{sublabel}</span>}
      </div>
    </div>
  );
};

export const GaugeChart = ({
  value = 70,
  max = 100,
  size = 200,
  label = 'Freshness',
  colorRanges = [
    { start: 0, end: 33, color: '#EF4444' },
    { start: 33, end: 66, color: '#F59E0B' },
    { start: 66, end: 100, color: '#10B981' },
  ],
  className = '',
}) => {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  const percentage = Math.min((animated / max) * 100, 100);
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (pct) => {
    for (const range of colorRanges) {
      if (pct >= range.start && pct <= range.end) return range.color;
    }
    return colorRanges[colorRanges.length - 1].color;
  };
  const color = getColor(percentage);

  return (
    <div className={cn('relative flex items-center justify-center', className)} style={{ width: size, height: size * 0.7 }}>
      <svg width={size} height={size * 0.7} className="overflow-visible">
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <path
          d={`M ${strokeWidth / 2} ${size * 0.65} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size * 0.65}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="dark:stroke-slate-700"
        />
        <motion.path
          d={`M ${strokeWidth / 2} ${size * 0.65} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size * 0.65}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="absolute bottom-0 flex flex-col items-center pb-2">
        <motion.span
          key={Math.round(percentage)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-black"
          style={{ color, textShadow: `0 0 30px ${color}30` }}
        >
          {Math.round(percentage)}
        </motion.span>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 -mt-1">{label}</span>
      </div>
    </div>
  );
};
