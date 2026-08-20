import { motion } from 'framer-motion';
import { cn, getStatusColor } from '../../utils/helpers';

const Badge = ({
  children,
  variant = 'info',
  size = 'md',
  className = '',
  icon,
}) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    primary: 'bg-primary-50 dark:bg-primary-500/15 text-primary-700 dark:text-primary-400',
    secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'badge',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </motion.span>
  );
};

export const StatusBadge = ({ status, children, className = '' }) => {
  const colors = getStatusColor(status);
  return (
    <span className={cn('badge', colors.bgLight, colors.text, className)}>
      <span className={cn('w-2 h-2 rounded-full', colors.bg)} />
      {children || status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default Badge;
