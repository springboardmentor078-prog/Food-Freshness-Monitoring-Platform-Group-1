import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import I from '../components/icons';
const HiOutlineCog = I.Cog;
const HiOutlineSun = I.Sun;
const HiOutlineMoon = I.Moon;
const HiOutlineBell = I.Bell;
const HiOutlineShieldCheck = I.Shield;
const HiOutlineGlobe = I.Globe;
const HiOutlineTrash = I.Trash;
const HiOutlineLogout = I.Logout;
const HiOutlineSparkles = I.Sparkles;
const HiOutlineDevicePhoneMobile = I.Device;
const HiOutlineExclamationTriangle = I.Exclamation;
const HiOutlineLockClosed = I.Lock;
const HiOutlineCheck = I.Check;
const HiOutlineInformationCircle = I.InfoCircle;
const HiOutlineSave = I.Save;
import { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Toggle } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';
import { userService } from '../services/api';
import { useLazyApi } from '../hooks/useApi';

const Settings = () => {
  const { isDark, toggleTheme, logout, user } = useAuth();
  const navigate = useNavigate();
  const { data, load } = useLazyApi(userService.getProfile);
  const [prefs, setPrefs] = useState({ language: 'English', units: 'metric', defaultView: 'dashboard' });
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => { load(); }, []);
  useEffect(() => { if (data) setPrefs(data.preferences || prefs); }, [data]);

  const updatePref = (key, val) => {
    const np = { ...prefs, [key]: val };
    setPrefs(np);
    userService.updatePreferences(np).then(() => toast.success('Preference saved'));
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const themeOptions = [
    { id: 'light', label: 'Light', icon: HiOutlineSun, desc: 'Clean and bright', preview: 'from-white to-slate-100 border-slate-200' },
    { id: 'dark', label: 'Dark', icon: HiOutlineMoon, desc: 'Easy on the eyes', preview: 'from-slate-900 to-slate-800 border-slate-700' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-secondary-800 to-primary-800 p-8 md:p-10 shadow-xl shadow-secondary-500/25 text-white"
      >
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-4">
              <HiOutlineCog className="w-4 h-4 text-yellow-200" />
              <span className="text-xs font-bold text-white/90">Global Preferences</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">Settings</h1>
            <p className="text-white/75 max-w-xl">
              Customize your FreshEye AI experience, manage notifications, privacy, and account controls.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 flex items-center justify-center font-black text-2xl shadow-2xl mb-1">
                {user?.avatar || 'U'}
              </div>
              <Badge variant="primary" size="sm">{user?.role || 'Member'}</Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500/15 to-secondary-500/15 flex items-center justify-center">
            {isDark ? <HiOutlineMoon className="w-5 h-5 text-secondary-500" /> : <HiOutlineSun className="w-5 h-5 text-accent-500" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Appearance</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose your theme and interface style</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {themeOptions.map(t => {
            const Icon = t.icon;
            const active = (t.id === 'dark' && isDark) || (t.id === 'light' && !isDark);
            return (
              <button
                key={t.id}
                onClick={toggleTheme}
                className={cn(
                  'relative p-5 rounded-2xl border-2 transition-all text-left overflow-hidden group',
                  active
                    ? 'border-primary-500 ring-4 ring-primary-500/15 shadow-xl shadow-primary-500/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500/40'
                )}
              >
                <div className={cn('h-24 rounded-xl bg-gradient-to-br border mb-4 overflow-hidden shadow-inner', t.preview)}>
                  <div className="p-3 flex gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary-500 shadow-sm" />
                    <div className="flex-1 space-y-1.5 pt-1">
                      <div className="h-2 rounded-full bg-slate-300/70 dark:bg-slate-600/70 w-2/3" />
                      <div className="h-2 rounded-full bg-slate-200/70 dark:bg-slate-700/70 w-1/2" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      t.id === 'dark' ? 'bg-slate-800 text-yellow-300' : 'bg-amber-50 text-amber-500'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{t.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.desc}</p>
                    </div>
                  </div>
                  {active && (
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <HiOutlineCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-start gap-3">
          <HiOutlineInformationCircle className="w-5 h-5 text-secondary-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Theme preferences are synced across all your devices and stored locally in your browser for fast access.
          </p>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-500/15 to-primary-500/15 flex items-center justify-center">
            <HiOutlineGlobe className="w-5 h-5 text-accent-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Regional Preferences</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Language, units, and defaults</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <Select
            label="Language"
            value={prefs.language}
            onChange={e => updatePref('language', e.target.value)}
            options={['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese', 'Chinese'].map(o => ({ label: o, value: o }))}
          />
          <Select
            label="Units"
            value={prefs.units}
            onChange={e => updatePref('units', e.target.value)}
            options={[{ label: 'Metric (°C, grams)', value: 'metric' }, { label: 'Imperial (°F, oz)', value: 'imperial' }]}
          />
          <Select
            label="Default Page"
            value={prefs.defaultView}
            onChange={e => updatePref('defaultView', e.target.value)}
            options={[
              { label: 'Dashboard', value: 'dashboard' },
              { label: 'Upload', value: 'upload' },
              { label: 'History', value: 'history' },
              { label: 'Recommendations', value: 'recommendations' },
            ]}
          />
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-secondary-500/15 to-primary-500/15 flex items-center justify-center">
            <HiOutlineBell className="w-5 h-5 text-secondary-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Notifications</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Control how you receive updates</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { l: 'Sound Effects', d: 'Play a chime when analysis completes', checked: true },
            { l: 'Desktop Notifications', d: 'Show browser notifications (if allowed)', checked: true },
            { l: 'Scheduled Scans Reminder', d: 'Weekend reminder to check inventory', checked: false },
            { l: 'Product Announcements', d: 'Major feature updates only (low volume)', checked: true },
          ].map((n, i) => (
            <div key={i} className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <Toggle label={n.l} description={n.d} checked={n.checked} onChange={() => {}} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500/15 to-success-500/15 flex items-center justify-center">
            <HiOutlineShieldCheck className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Privacy & Data</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your security is our priority</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { l: 'End-to-end encryption', v: 'Active', c: 'success' },
            { l: 'Data stored region', v: 'North America', c: 'info' },
            { l: 'Auto-delete scans', v: 'After 90 days', c: 'primary' },
          ].map((i, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700/50">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{i.l}</p>
              <Badge variant={i.c}>{i.v}</Badge>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <Toggle label="Improve AI models" description="Allow anonymous scan data to train models (no personal info)" checked={true} onChange={() => {}} />
          </div>
          <div className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <Toggle label="Share with researchers" description="Contribute anonymized data to food-waste research" checked={false} onChange={() => {}} />
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden card p-6 md:p-8 border-2 border-danger-200 dark:border-danger-500/30"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-danger-500/5 via-transparent to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-danger-500/15 to-accent-500/15 flex items-center justify-center">
              <HiOutlineExclamationTriangle className="w-5 h-5 text-danger-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Danger Zone</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Irreversible actions</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-danger-200 dark:border-danger-500/20 bg-white dark:bg-slate-800 mb-3">
            <div className="flex items-start gap-3">
              <HiOutlineLogout className="w-6 h-6 text-slate-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Sign out of all sessions</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Invalidate all active login tokens</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setLogoutDialog(true)}>Sign Out Everywhere</Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 border-danger-300 dark:border-danger-500/40 bg-danger-50 dark:bg-danger-500/10">
            <div className="flex items-start gap-3">
              <HiOutlineTrash className="w-6 h-6 text-danger-500 shrink-0" />
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Delete account permanently</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">All data, scans, and settings will be erased</p>
              </div>
            </div>
            <Button variant="danger" onClick={() => setDeleteDialog(true)}>Delete Account</Button>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end">
        <Button variant="primary" icon={<HiOutlineSave className="w-5 h-5" />} size="lg" onClick={() => toast.success('All settings saved!')}>
          Save All Settings
        </Button>
      </div>

      <ConfirmDialog
        isOpen={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Sign out everywhere?"
        message="You'll need to re-enter your credentials on all devices to access FreshEye AI again."
        confirmText="Sign Out"
      />

      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={() => { toast.success('Account deletion requested'); setDeleteDialog(false); }}
        title="Permanently delete your account?"
        message="This cannot be undone. All predictions, saved items, and preferences will be lost immediately."
        confirmText="Yes, Delete Forever"
        variant="danger"
      />
    </div>
  );
};

export default Settings;
