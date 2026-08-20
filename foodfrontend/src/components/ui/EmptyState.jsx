import { motion } from 'framer-motion';
import I from '../icons';
import { cn } from '../../utils/helpers';
import Button from './Button';

const icons = {
  search: I.Search,
  data: I.Clipboard,
  upload: I.CloudUpload,
  error: I.Exclamation,
};

export const EmptyState = ({
  icon = 'data',
  title,
  description,
  action,
  actionLabel,
  onAction,
  className = '',
  iconClassName = '',
}) => {
  const Icon = icons[icon] || icons.data;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className={cn('relative mb-6', iconClassName)}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 blur-2xl rounded-full scale-150" />
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-500/10 dark:to-secondary-500/10 flex items-center justify-center border border-slate-100 dark:border-slate-700">
          <Icon className="w-12 h-12 text-primary-500" />
        </div>
      </div>
      {title && (
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
          {description}
        </p>
      )}
      {action && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel || 'Get Started'}
        </Button>
      )}
    </motion.div>
  );
};

export const ErrorState = ({
  title = 'Oops! Something went wrong',
  message = 'We couldn\'t load the data you requested. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-danger-500/20 to-accent-500/20 blur-2xl rounded-full scale-150" />
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-danger-50 to-accent-50 dark:from-danger-500/10 dark:to-accent-500/10 flex items-center justify-center border border-danger-100 dark:border-danger-500/20">
          <HiOutlineExclamationTriangle className="w-12 h-12 text-danger-500" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
