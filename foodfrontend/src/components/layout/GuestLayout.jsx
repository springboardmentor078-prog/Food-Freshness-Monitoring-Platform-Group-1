import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import I from '../icons';
const HiSparkles = I.Sparkles;
const HiOutlineSun = I.Sun;
const HiOutlineMoon = I.Moon;
import { useAuth } from '../../context/AuthContext';

const GuestLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (!mounted) return null;

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-500 blur-lg opacity-40 rounded-2xl" />
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <HiSparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <span className="font-black text-slate-800 dark:text-white text-lg">FreshEye</span>
              <p className="text-[10px] text-primary-500 font-bold tracking-wider -mt-0.5">AI POWERED</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl text-slate-500 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label={isDark ? 'Light mode' : 'Dark mode'}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {isAuthPage ? (
              <Link
                to={location.pathname === '/login' ? '/register' : '/login'}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {location.pathname === '/login' ? 'Create Account' : 'Sign In'}
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default GuestLayout;
