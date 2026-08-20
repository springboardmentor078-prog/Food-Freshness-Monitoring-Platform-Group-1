import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import I from '../icons';
const HiOutlineEye = I.Eye;
const HiOutlineTrash = I.Trash;
const HiOutlineClock = I.Clock;
import { cn, getStatusColor, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../ui/Badge';
import { CircularProgress } from '../ui/Progress';

export const PredictionCard = ({ prediction, onView, onDelete, compact = false, className = '' }) => {
  const colors = getStatusColor(prediction.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', damping: 20 }}
      className={cn(
        'card overflow-hidden group relative',
        className
      )}
    >
      <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', colors.gradient)} />

      <div className="relative">
        <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
          <img
            src={prediction.image}
            alt={prediction.food}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <StatusBadge status={prediction.status} />
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-white text-xs font-medium opacity-80 mb-1">Detected Food</p>
            <h3 className="text-white font-black text-xl tracking-tight drop-shadow-lg">{prediction.food}</h3>
          </div>
        </div>

        <div className="p-5">
          {!compact && (
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="flex items-center justify-center">
                <CircularProgress
                  value={prediction.confidence}
                  label="Confidence"
                  size={70}
                  strokeWidth={6}
                  color={colors.hex}
                />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Freshness</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.freshness}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={cn('h-full rounded-full bg-gradient-to-r', colors.gradient)}
                      />
                    </div>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{prediction.freshness}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Shelf-Life</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                    <HiOutlineClock className={colors.text} />
                    {prediction.shelfLife === 0 ? 'Expired' : `${prediction.shelfLife} days left`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {compact && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Confidence</p>
                <p className="font-black text-2xl text-slate-800 dark:text-white">{prediction.confidence}%</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Date</p>
                <p className="font-semibold text-sm text-slate-600 dark:text-slate-400">{formatDate(prediction.date)}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
            {onView && (
              <button
                onClick={() => onView(prediction)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
              >
                <HiOutlineEye className="w-4 h-4" />
                View
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(prediction)}
                className="p-2.5 rounded-xl bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400 font-semibold hover:bg-danger-100 dark:hover:bg-danger-500/20 transition-colors"
                aria-label="Delete"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionCard;
