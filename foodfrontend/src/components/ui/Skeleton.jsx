import { cn } from '../../utils/helpers';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800',
        className
      )}
      {...props}
    />
  );
};

export const CardSkeleton = ({ lines = 3, className = '' }) => (
  <div className={cn('card p-6', className)}>
    <div className="flex items-start gap-4">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
    <div className="mt-5 space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" style={{ width: `${80 + Math.random() * 20}%` }} />
      ))}
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <div className="card overflow-hidden">
    <div className="p-4 border-b border-slate-100 dark:border-slate-700">
      <Skeleton className="h-6 w-48" />
    </div>
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
      {Array.from({ length: rows }).map((_, ri) => (
        <div key={ri} className="p-4 flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          {Array.from({ length: cols }).map((_, ci) => (
            <Skeleton
              key={ci}
              className="h-4 flex-1"
              style={{ flex: 1 + Math.random() * 2 }}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = ({ className = '' }) => (
  <div className={cn('card p-6', className)}>
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      <div className="h-52 flex items-end gap-3 pt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${40 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
