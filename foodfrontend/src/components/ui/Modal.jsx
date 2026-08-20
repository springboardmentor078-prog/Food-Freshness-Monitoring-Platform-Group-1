import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import I from '../icons';
const IoClose = I.X;
import { cn } from '../../utils/helpers';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose?.();
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95vw] max-h-[90vh]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'pointer-events-auto w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden',
                sizes[size],
                className
              )}
            >
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{title}</h3>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    <IoClose className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">{children}</div>
              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={cn(
          'mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center',
          variant === 'danger' ? 'bg-danger-100 dark:bg-danger-500/20' : 'bg-warning-100 dark:bg-accent-500/20'
        )}>
          <svg className={cn(
            'w-8 h-8',
            variant === 'danger' ? 'text-danger-600' : 'text-accent-600'
          )} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm?.(); onClose?.(); }}
            disabled={loading}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50',
              variant === 'danger'
                ? 'bg-gradient-to-r from-danger-500 to-danger-600 hover:shadow-lg hover:shadow-danger-500/25'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:shadow-lg hover:shadow-primary-500/25'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;
