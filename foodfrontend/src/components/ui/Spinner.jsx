import { cn } from '../../utils/helpers';

export const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-20 h-20 border-4',
  };

  const colors = {
    primary: 'border-primary-500 border-transparent',
    secondary: 'border-secondary-500 border-transparent',
    white: 'border-white border-transparent',
  };

  return (
    <div
      role="status"
      className={cn(
        'rounded-full border-t-current border-r-current animate-spin',
        sizes[size],
        colors[color],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LoadingOverlay = ({ text = 'Loading...', children }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary-500 blur-2xl opacity-20 animate-pulse" />
        <Spinner size="xl" color="primary" />
      </div>
      <p className="mt-6 text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">{text}</p>
      {children}
    </div>
  );
};

export const PulseRing = ({ color = 'primary', size = 'md' }) => {
  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    danger: 'bg-danger-500',
  };
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };
  return (
    <span className="relative inline-flex">
      <span className={cn('rounded-full opacity-75 absolute inline-flex h-full w-full animate-ping', colors[color], sizes[size])} />
      <span className={cn('relative rounded-full inline-flex', colors[color], sizes[size])} />
    </span>
  );
};

export default Spinner;
