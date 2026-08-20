import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import I from '../components/icons';
const HiOutlineHome = I.Home;
const HiOutlineArrowLeft = I.ArrowLeft;
const HiOutlineSparkles = I.Sparkles;
const HiOutlineSearch = I.Search;
const HiOutlineQuestionMarkCircle = I.Question;
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-15" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary-400/20 via-secondary-500/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-accent-400/20 via-primary-500/10 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* 404 Text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 12, duration: 0.8 }}
          className="relative inline-block mb-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 blur-3xl opacity-25 rounded-full scale-125" />
          <h1 className="relative font-black text-[180px] md:text-[240px] leading-none bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent select-none">
            404
          </h1>
          {/* Floating icons */}
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -top-4 -left-10 md:-left-20 w-14 h-14 md:w-20 md:h-20 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-700"
          >
            <HiOutlineQuestionMarkCircle className="w-7 h-7 md:w-10 md:h-10 text-secondary-500" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-4 -right-10 md:-right-16 w-12 h-12 md:w-16 md:h-16 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-700"
          >
            <HiOutlineSparkles className="w-6 h-6 md:w-8 md:h-8 text-accent-500" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/2 -right-2 md:-right-6 w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-success-500 shadow-lg flex items-center justify-center"
          >
            <HiOutlineSearch className="w-5 h-5 md:w-7 md:h-7 text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            Page <span className="gradient-text">Not Found</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Oops! The page you're looking for has wandered off. It might have been moved, deleted, or perhaps never existed in this dimension.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <Button
              variant="primary"
              size="lg"
              icon={<HiOutlineHome className="w-5 h-5" />}
              onClick={() => { window.location.href = '/dashboard'; }}
              className="w-full sm:w-auto !py-4"
            >
              Back to Dashboard
            </Button>
            <Link to="/">
              <Button
                variant="outline"
                size="lg"
                icon={<HiOutlineArrowLeft className="w-5 h-5" />}
                className="w-full sm:w-auto !py-4"
              >
                Go to Homepage
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 rounded-[2rem] blur-xl opacity-50" />
          <div className="relative bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 text-left">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HiOutlineSparkles className="w-4 h-4 text-accent-500" />
              Try These Instead
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { l: 'Dashboard', i: HiOutlineHome, to: '/dashboard' },
                { l: 'Upload Image', i: HiOutlineSparkles, to: '/upload' },
                { l: 'View History', i: HiOutlineSearch, to: '/history' },
                { l: 'Smart Tips', i: HiOutlineQuestionMarkCircle, to: '/recommendations' },
              ].map((s, i) => (
                <Link key={i} to={s.to}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all h-full"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center mb-3">
                      <s.i className="w-5 h-5 text-primary-500" />
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{s.l}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
