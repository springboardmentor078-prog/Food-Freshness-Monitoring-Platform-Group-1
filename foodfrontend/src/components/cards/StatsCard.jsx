import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn, formatNumber } from '../../utils/helpers';
import { CircularProgress } from '../ui/Progress';

const useCountUp = (target, duration = 1500, start = 0) => {
  const [value, setValue] = useState(start);
  useEffect(() => {
    let startTime = null;
    let rafId;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + (target - start) * eased);
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start]);
  return value;
};

const colorSchemes = {
  primary: {
    bg: 'from-primary-500/10 via-primary-500/5 to-transparent',
    icon: 'bg-primary-500 text-white shadow-lg shadow-primary-500/30',
    ring: 'ring-primary-500/10',
    text: 'text-primary-500',
    stroke: '#10B981',
  },
  secondary: {
    bg: 'from-secondary-500/10 via-secondary-500/5 to-transparent',
    icon: 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/30',
    ring: 'ring-secondary-500/10',
    text: 'text-secondary-500',
    stroke: '#2563EB',
  },
  accent: {
    bg: 'from-accent-500/10 via-accent-500/5 to-transparent',
    icon: 'bg-accent-500 text-white shadow-lg shadow-accent-500/30',
    ring: 'ring-accent-500/10',
    text: 'text-accent-500',
    stroke: '#F59E0B',
  },
  danger: {
    bg: 'from-danger-500/10 via-danger-500/5 to-transparent',
    icon: 'bg-danger-500 text-white shadow-lg shadow-danger-500/30',
    ring: 'ring-danger-500/10',
    text: 'text-danger-500',
    stroke: '#EF4444',
  },
  success: {
    bg: 'from-success-500/10 via-success-500/5 to-transparent',
    icon: 'bg-success-500 text-white shadow-lg shadow-success-500/30',
    ring: 'ring-success-500/10',
    text: 'text-success-500',
    stroke: '#22C55E',
  },
};

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'increase',
  color = 'primary',
  suffix = '',
  prefix = '',
  decimals = 0,
  progress,
  className = '',
}) => {
  const colors = colorSchemes[color] || colorSchemes.primary;
  const displayValue = useCountUp(value, 1600);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'card p-6 relative overflow-hidden group',
        className
      )}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-40 group-hover:opacity-70 transition-opacity', colors.bg)} />
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-60 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">{title}</p>
            <div className="flex items-baseline gap-1">
              {prefix && <span className={cn('text-2xl font-bold', colors.text)}>{prefix}</span>}
              <span className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                {typeof value === 'number' ? formatNumber(Number(displayValue.toFixed(decimals))) : value}
              </span>
              {suffix && <span className={cn('text-lg font-bold', colors.text)}>{suffix}</span>}
            </div>
          </div>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            className={cn('w-12 h-12 rounded-2xl flex items-center justify-center relative', colors.icon)}
          >
            {Icon && <Icon className="w-6 h-6" />}
            <div className={cn('absolute inset-0 rounded-2xl ring-8 opacity-0 group-hover:opacity-100 transition-opacity', colors.ring)} />
          </motion.div>
        </div>

        <div className="flex items-center justify-between mt-5">
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold',
              changeType === 'increase'
                ? 'bg-success-50 dark:bg-success-500/15 text-success-700 dark:text-success-400'
                : 'bg-danger-50 dark:bg-danger-500/15 text-danger-700 dark:text-danger-400'
            )}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d={changeType === 'increase' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
              </svg>
              {change}% vs last week
            </div>
          )}
          {progress !== undefined && (
            <div className="ml-auto">
              <CircularProgress
                value={progress}
                size={40}
                strokeWidth={4}
                color={colors.stroke}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
