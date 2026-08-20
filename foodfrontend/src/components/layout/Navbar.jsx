import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import I from '../icons';
import { cn } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { FOOD_TYPES } from '../../constants';

const notifications = [
  { id: 1, title: 'New AI Model Update', description: 'FreshNet v3.2 is now 2.3% more accurate!', time: '5m ago', type: 'info', unread: true },
  { id: 2, title: 'Weekly Report Ready', description: 'Your food waste reduced by 18% this week.', time: '1h ago', type: 'success', unread: true },
  { id: 3, title: 'Spoilage Alert', description: '3 items in your list are about to expire.', time: '3h ago', type: 'warning', unread: true },
  { id: 4, title: 'Milestone Reached', description: 'You have saved 500 lbs of food!', time: '1d ago', type: 'success', unread: false },
];

const Navbar = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const { user, isDark, toggleTheme, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const pathnames = location.pathname.split('/').filter(Boolean);
  const breadcrumbMap = {
    dashboard: 'Dashboard', upload: 'Upload', prediction: 'Prediction',
    history: 'History', recommendations: 'Recommendations', profile: 'Profile', settings: 'Settings'
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const searchResults = searchQuery.length > 0
    ? FOOD_TYPES.filter(f => f.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8)
    : [];

  const unreadCount = notifications.filter(n => n.unread).length;
  const sidebarMargin = isSidebarCollapsed ? { marginLeft: '5rem' } : { marginLeft: '17rem' };

  return (
    <>
      <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/70" style={sidebarMargin}>
        <div className="h-full flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open sidebar"
            >
              <I.Menu className="w-6 h-6" />
            </button>

            <div>
              {pathnames.length > 0 ? (
                <nav className="hidden sm:flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Home</Link>
                  {pathnames.map((name, idx) => {
                    const routeTo = `/${pathnames.slice(0, idx + 1).join('/')}`;
                    const isLast = idx === pathnames.length - 1;
                    return (
                      <div key={name} className="flex items-center gap-1">
                        <I.ChevRight className="w-3 h-3" />
                        {isLast ? (
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{breadcrumbMap[name] || name}</span>
                        ) : (
                          <Link to={routeTo} className="hover:text-primary-500 transition-colors">{breadcrumbMap[name] || name}</Link>
                        )}
                      </div>
                    );
                  })}
                </nav>
              ) : null}
              <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-1">
                {breadcrumbMap[pathnames[pathnames.length - 1]] || 'Welcome Back'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-primary-300 dark:hover:border-primary-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all group"
            >
              <I.Search className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
              <span className="hidden md:inline text-sm text-slate-500 dark:text-slate-400">Search foods...</span>
              <span className="hidden lg:inline ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 text-slate-500">⌘K</span>
            </button>

            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-2xl text-slate-500 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group overflow-hidden"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <I.Sun className="w-5 h-5" /> : <I.Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-2xl text-slate-500 hover:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Notifications"
              >
                <I.Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-danger-400 to-danger-600 flex items-center justify-center text-[9px] font-bold text-white shadow-md animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                  >
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200">Notifications</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400">{unreadCount} New</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                      {notifications.map(n => (
                        <div key={n.id} className={cn('p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer', n.unread && 'bg-primary-50/40 dark:bg-primary-500/5')}>
                          <div className="flex gap-3">
                            <div className={cn(
                              'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0',
                              n.type === 'info' && 'bg-secondary-100 dark:bg-secondary-500/20 text-secondary-600',
                              n.type === 'success' && 'bg-success-100 dark:bg-success-500/20 text-success-600',
                              n.type === 'warning' && 'bg-accent-100 dark:bg-accent-500/20 text-accent-600'
                            )}>
                              <I.Bell className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{n.title}</p>
                                {n.unread && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.description}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700">
                      <button className="w-full py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-xl transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-500 blur-md opacity-50 rounded-2xl group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {user?.avatar || 'U'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success-500 border-2 border-white dark:border-slate-900" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{user?.role || 'Member'}</p>
                </div>
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                  >
                    <div className="p-5 bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                          {user?.avatar || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{user?.name || 'User'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400">{user?.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button onClick={() => { navigate('/profile'); setShowProfile(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-left">
                        <I.User className="w-5 h-5" />
                        <span className="text-sm font-semibold">My Profile</span>
                      </button>
                      <button onClick={() => { navigate('/settings'); setShowProfile(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-left">
                        <I.Cog className="w-5 h-5" />
                        <span className="text-sm font-semibold">Settings</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-left">
                        <I.RectangleStack className="w-5 h-5" />
                        <span className="text-sm font-semibold">Subscription</span>
                      </button>
                    </div>
                    <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors text-left">
                        <I.Logout className="w-5 h-5" />
                        <span className="text-sm font-semibold">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                <I.Search className="w-6 h-6 text-primary-500 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search foods, predictions, history..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-lg font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="max-h-96 overflow-y-auto p-2">
                  <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Foods</p>
                  {searchResults.map(food => (
                    <button
                      key={food}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); navigate('/upload'); }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-500/20 dark:to-secondary-500/20 flex items-center justify-center text-lg">🍎</div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{food}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Analyze {food} freshness</p>
                      </div>
                      <I.ChevRight className="w-5 h-5 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No results for "{searchQuery}"</div>
              )}
              <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                <span>Press ESC to close</span>
                <span>⌘K to open</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
