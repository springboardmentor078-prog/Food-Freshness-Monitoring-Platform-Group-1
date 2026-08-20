import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import I, { GoogleIcon } from '../components/icons';
const HiOutlineUser = I.User;
const HiOutlineMail = I.Mail;
const HiOutlineLockClosed = I.Lock;
const HiEye = I.Eye;
const HiEyeOff = I.EyeSlash;
const HiSparkles = I.Sparkles;
const HiOutlineShieldCheck = I.Shield;
const HiOutlineArrowRight = I.ArrowRight;
const HiOutlineCheck = I.Check;
const FcGoogle = GoogleIcon;
import { useAuth } from '../context/AuthContext';
import { validateEmail, checkPasswordStrength } from '../utils/helpers';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', terms: false });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = checkPasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!validateEmail(form.email)) e.email = 'Please enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.terms) e.terms = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('🎉 Account created! Welcome to FreshEye AI');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-15" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-secondary-400/20 via-primary-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary-400/20 via-accent-500/10 to-transparent rounded-full blur-3xl translate-y-1/2" />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-5 gap-12 items-center">
        {/* Left - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block lg:col-span-2"
        >
          <div className="relative py-8">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-[1.1] mb-5">
              Start your <br />
              <span className="gradient-text">waste-free journey</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Join thousands saving money, food, and the planet with AI-powered freshness intelligence.
            </p>

            <div className="space-y-4">
              {[
                t => <>Save <b className="text-primary-600 dark:text-primary-400">up to $500/year</b> on groceries</>,
                t => <>AI detects <b className="text-secondary-600 dark:text-secondary-400">subtle spoilage signs</b></>,
                t => <>Personal <b className="text-accent-600 dark:text-accent-400">storage recommendations</b></>,
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-200/60 dark:border-slate-700/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success-400 to-success-600 flex items-center justify-center shadow-md shadow-success-500/20 shrink-0">
                    <HiOutlineCheck className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t()}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-700/50">
              <div className="flex -space-x-3">
                {[
                  { c: 'from-primary-500 to-secondary-600', a: 'AJ' },
                  { c: 'from-accent-500 to-primary-600', a: 'SK' },
                  { c: 'from-secondary-500 to-danger-600', a: 'MP' },
                  { c: 'from-success-500 to-primary-600', a: 'EW' },
                ].map((a, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${a.c} border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-xs font-black shadow-md`}>
                    {a.a}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-600 dark:text-slate-300 shadow-md">
                  +150K
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">150,000+ users already saving food every day</p>
            </div>
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-3 w-full"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/15 via-secondary-500/15 to-accent-500/15 rounded-[3rem] blur-3xl opacity-60" />
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/50 dark:border-slate-700/50">
              <div className="text-center mb-8">
                <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-br from-secondary-500 via-primary-500 to-accent-500 items-center justify-center mb-5 shadow-xl shadow-secondary-500/30">
                  <HiSparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create Account</h2>
                <p className="text-slate-500 dark:text-slate-400">Start your 14-day free trial</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="input-label">Full Name</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Alex Johnson"
                      className={`input-field pl-12 ${errors.name ? 'border-danger-500 focus:ring-danger-500/30' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="mt-1.5 text-sm text-danger-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="input-label">Email Address</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`input-field pl-12 ${errors.email ? 'border-danger-500 focus:ring-danger-500/30' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-sm text-danger-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="input-label">Password</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className={`input-field pl-12 pr-12 ${errors.password ? 'border-danger-500 focus:ring-danger-500/30' : ''}`}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      {showPass ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <div key={n} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${n <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${strength.color.replace('bg-', 'text-').replace('-500', '-600')}`}>
                          {strength.label}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{Math.round(strength.percentage)}% complete</span>
                      </div>
                    </div>
                  )}
                  {errors.password && <p className="mt-1.5 text-sm text-danger-500">{errors.password}</p>}
                </div>

                <div>
                  <label className="input-label">Confirm Password</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={`input-field pl-12 pr-12 ${errors.confirmPassword ? 'border-danger-500 focus:ring-danger-500/30' : ''}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      {showConfirm ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-sm text-danger-500">{errors.confirmPassword}</p>}
                </div>

                <div className={`pt-1 ${errors.terms ? '' : 'pb-1'}`}>
                  <label className="flex items-start cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={form.terms}
                      onChange={handleChange}
                      className="w-5 h-5 mt-0.5 rounded-lg border-slate-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm text-slate-600 dark:text-slate-400">
                      I agree to the <a href="#" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                  {errors.terms && <p className="mt-1.5 text-sm text-danger-500 pl-8">{errors.terms}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-secondary-500 via-primary-500 to-accent-500 hover:from-secondary-600 hover:via-primary-600 hover:to-accent-600 text-white font-bold text-base shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    ) : (
                      <>
                        Create Account
                        <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Or sign up with</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              <button
                type="button"
                onClick={() => toast.info('Google OAuth coming soon!')}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-500/50 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all group"
              >
                <FcGoogle className="w-6 h-6" />
                <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Continue with Google</span>
              </button>

              <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  Sign in instead →
                </Link>
              </p>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <HiOutlineShieldCheck className="w-3.5 h-3.5 text-success-500" />
                Your data is encrypted & never shared. Cancel anytime.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
