import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import I from '../components/icons';
const HiOutlineUser = I.User;
const HiOutlineMail = I.Mail;
const HiOutlinePhone = I.Phone;
const HiOutlineLocationMarker = I.Pin;
const HiOutlineCalendar = I.Calendar;
const HiOutlineCog = I.Cog;
const HiOutlineSparkles = I.Sparkles;
const HiOutlineChartBar = I.Chart;
const HiOutlineSave = I.Save;
const HiOutlineLockClosed = I.Lock;
const HiEye = I.Eye;
const HiEyeOff = I.EyeSlash;
const HiOutlineBadgeCheck = I.CheckCircle;
const HiOutlineStar = I.Star;
const HiOutlineInboxStack = I.Inbox;
const HiOutlineShieldCheck = I.Shield;
const HiOutlinePencil = I.Pencil;
import Button from '../components/ui/Button';
import { Input, Textarea, Toggle } from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { CardSkeleton, Skeleton } from '../components/ui/Skeleton';
import { CircularProgress } from '../components/ui/Progress';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLazyApi } from '../hooks/useApi';
import { checkPasswordStrength } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { data, load, loading } = useLazyApi(userService.getProfile);
  const [saving, setSaving] = useState(false);
  const [passSaving, setPassSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', bio: '' });
  const [passwords, setPasswords] = useState({ current: '', newPassword: '', confirmPassword: '' });
  const [notif, setNotif] = useState({ email: true, push: true, weeklyReport: true, alerts: true, marketing: false });
  const [prefs, setPrefs] = useState({ language: 'English', units: 'metric', defaultView: 'dashboard' });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (data) {
      setForm({ name: data.name, email: data.email, phone: data.phone, location: data.location, bio: data.bio });
      setNotif(data.notifications);
      setPrefs(data.preferences);
    }
  }, [data]);

  const passwordStrength = checkPasswordStrength(passwords.newPassword);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await userService.updateProfile(form);
      updateUser({ name: form.name, email: form.email });
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error('Failed to update profile');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPassSaving(true);
    try {
      await userService.changePassword(passwords);
      setPasswords({ current: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (e) { toast.error(e.message); }
    finally { setPassSaving(false); }
  };

  if (loading || !data) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <CardSkeleton lines={5} />
        <div className="lg:col-span-2 space-y-6">
          <CardSkeleton lines={6} /><CardSkeleton lines={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 p-8 md:p-10 shadow-xl shadow-primary-500/25"
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-yellow-300/40 blur-2xl rounded-full scale-150" />
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-white via-yellow-200 to-white text-primary-600 flex items-center justify-center font-black text-3xl md:text-4xl shadow-2xl border-4 border-white/40">
                {data.avatar}
              </div>
              <button className="absolute -bottom-1 -right-1 w-9 h-9 rounded-2xl bg-white text-primary-600 flex items-center justify-center shadow-xl border-2 border-white hover:scale-110 transition-transform">
                <HiOutlinePencil className="w-4 h-4" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-black text-white leading-none">{data.name}</h1>
                <Badge variant="info" size="sm">
                  <HiOutlineBadgeCheck className="w-3 h-3" />
                  {data.role}
                </Badge>
              </div>
              <p className="text-white/80 mb-3 text-base">{data.email}</p>
              <div className="flex items-center gap-3 text-white/75 text-sm">
                <span className="flex items-center gap-1"><HiOutlineCalendar className="w-4 h-4" /> Member since {data.joined}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 min-w-[320px]">
            {[
              { l: 'Analyses', v: data.usage?.predictionsThisMonth || 147, i: HiOutlineInboxStack },
              { l: 'Saved ($)', v: data.usage?.savings || 342, i: HiOutlineStar },
              { l: 'Day Streak', v: data.usage?.streak || 23, i: HiOutlineSparkles },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
                <s.i className="w-5 h-5 text-yellow-200 mx-auto mb-1.5" />
                <p className="text-2xl font-black text-white leading-none">{s.v}</p>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-5 flex items-center gap-2">
              <HiOutlineCog className="w-5 h-5 text-secondary-500" />
              Account Overview
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Premium Annual</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Monthly usage</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{data.usage?.predictionsThisMonth || 147} / 500</p>
                </div>
                <CircularProgress
                  value={((data.usage?.predictionsThisMonth || 147) / 500) * 100}
                  label="Remaining"
                  sublabel={`${500 - (data.usage?.predictionsThisMonth || 147)} left`}
                  size={140}
                  strokeWidth={12}
                  color="#10B981"
                  className="mx-auto"
                />
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5 border border-primary-100 dark:border-primary-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <HiOutlineShieldCheck className="w-5 h-5 text-primary-500" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">SOC 2 & GDPR</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Your data is encrypted at rest and in transit with 256-bit AES.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <HiOutlineUser className="w-5 h-5 text-primary-500" />
                Personal Information
              </h3>
              <Button variant="primary" loading={saving} onClick={handleSave} icon={<HiOutlineSave className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Input label="Full Name" icon={<HiOutlineUser className="w-4 h-4" />} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" type="email" icon={<HiOutlineMail className="w-4 h-4" />} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <Input label="Phone" icon={<HiOutlinePhone className="w-4 h-4" />} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <Input label="Location" icon={<HiOutlineLocationMarker className="w-4 h-4" />} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              <div className="md:col-span-2">
                <Textarea label="Short Bio" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell us a little about yourself..." />
              </div>
            </div>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 md:p-8"
          >
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <HiOutlineLockClosed className="w-5 h-5 text-secondary-500" />
              Change Password
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Current Password"
                type={showCurrentPass ? 'text' : 'password'}
                icon={<HiOutlineLockClosed className="w-4 h-4" />}
                iconPosition="left"
                value={passwords.current}
                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                inputClassName="pr-12"
              >
              </Input>
              <div className="relative">
                <label className="input-label">Current Password *</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                    className="input-field pl-12 pr-12"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrentPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="input-label">New Password *</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="input-field pl-12 pr-12"
                    placeholder="Create strong password"
                  />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNewPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                {passwords.newPassword && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${n <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
                      <span className="text-[10px] text-slate-400">{passwordStrength.feedback.length} requirements left</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="input-label">Confirm New Password *</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="input-field pl-12"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="secondary" loading={passSaving} onClick={handleChangePassword}>
                Update Password
              </Button>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card p-6 md:p-8"
          >
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
              <HiOutlineChartBar className="w-5 h-5 text-accent-500" />
              Notification Preferences
            </h3>
            <div className="space-y-5">
              {[
                { k: 'email', l: 'Email Notifications', d: 'Receive analysis updates via email' },
                { k: 'push', l: 'Push Notifications', d: 'Browser push for real-time alerts' },
                { k: 'weeklyReport', l: 'Weekly Reports', d: 'Summary of savings & waste every Monday' },
                { k: 'alerts', l: 'Spoilage Alerts', d: 'Immediate warnings for at-risk items' },
                { k: 'marketing', l: 'Product Updates', d: 'Occasional news and tips (rare)' },
              ].map(n => (
                <div key={n.k} className="p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <Toggle
                    label={n.l}
                    description={n.d}
                    checked={notif[n.k]}
                    onChange={(v) => {
                      const newN = { ...notif, [n.k]: v };
                      setNotif(newN);
                      userService.updatePreferences({ notifications: newN });
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
