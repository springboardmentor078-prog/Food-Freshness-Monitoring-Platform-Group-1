import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import I from '../icons';
import { cn } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const navItems = [
  { to: '/dashboard', icon: I.Home, label: 'Dashboard' },
  { to: '/upload', icon: I.Upload, label: 'Upload Image' },
  { to: '/prediction', icon: I.Chart, label: 'Prediction Result' },
  { to: '/history', icon: I.Clock, label: 'History' },
  { to: '/recommendations', icon: I.Bulb, label: 'Recommendations' },
  { to: '/profile', icon: I.User, label: 'Profile' },
  { to: '/settings', icon: I.Cog, label: 'Settings' },
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const sidebarVariants = {
    expanded: { width: '17rem' },
    collapsed: { width: '5rem' },
  };

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed left-0 top-0 h-screen z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
    >
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center w-full')}>
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-500 blur-lg opacity-40 rounded-2xl" />
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <I.Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-black text-slate-800 dark:text-white text-lg leading-none">FreshEye</span>
              <span className="text-[10px] text-primary-500 font-bold tracking-wider">AI POWERED</span>
            </motion.div>
          )}
        </div>
      </div>

      <button
        onClick={onToggle}
        className={cn(
          'absolute top-[52px] -translate-y-1/2 z-10 p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary-500 hover:border-primary-300 dark:hover:border-primary-500/50 shadow-sm transition-all',
          'right-[-12px]'
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <I.ChevRight2 className="w-4 h-4" /> : <I.ChevLeft2 className="w-4 h-4" />}
      </button>

      <nav className="flex-1 px-3 py-5 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-4 mb-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Menu
            </p>
          )}
          {navItems.map((item, idx) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'sidebar-link group relative',
                isActive && 'sidebar-link-active',
                isCollapsed && 'justify-center px-0'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-400 to-secondary-500 rounded-r-full"
                    />
                  )}
                  <item.icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-primary-500')} />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {!isCollapsed && user && (
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5 border border-primary-100 dark:border-primary-500/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-md shadow-accent-500/20">
                <I.Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Pro Plan</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.role}</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              You've analyzed 147 items this month!
            </p>
            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-2">
              <div className="h-full rounded-full bg-gradient-to-r from-primary-400 via-secondary-500 to-accent-500 w-[62%]" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right">147 / 500 analyses</p>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className={cn(
            'sidebar-link w-full text-left text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 hover:text-danger-700 dark:hover:text-danger-300',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <I.Logout className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
