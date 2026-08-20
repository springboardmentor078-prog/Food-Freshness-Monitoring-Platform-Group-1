import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import I, { GoogleIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/helpers';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'demo@fresheye.ai', password: 'demo1234', remember: true });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!validateEmail(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 chars';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      toast.success('Welcome back! 👋');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      toast.error(err.response?.data?.detail || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await login({ email: 'demo@fresheye.ai', password: 'demo1234' });
      toast.success('Signed in as Demo User');
      setTimeout(() => navigate('/dashboard'), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
      <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-br from-primary-400/20 via-secondary-500/15 to-accent-500/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div animate={{ y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute bottom-[-20%] left-[-10%] w-[35rem] h-[35rem] bg-gradient-to-br from-accent-400/15 via-primary-500/10 to-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Info side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex flex-col gap-10"
        >
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-500 blur-lg opacity-50 rounded-2xl" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/30">
                <I.Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-black text-2xl text-slate-800 dark:text-white leading-none">FreshEye</h1>
              <span className="text-[10px] text-primary-500 font-black tracking-widest">AI FRESHNESS PLATFORM</span>
            </div>
          </Link>

          <div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-5">
              Welcome back to{' '}
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">smarter kitchens.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              Sign in to access your predictions, history, personalized storage tips, and AI insights.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: I.Bolt, title: 'Instant Analysis', desc: 'Get freshness results in under 2 seconds.', color: 'from-accent-400 to-accent-600 shadow-accent-500/30' },
              { icon: I.Shield, title: 'Secure & Private', desc: 'Your food photos are never shared or stored.', color: 'from-success-400 to-success-600 shadow-success-500/30' },
              { icon: I.Chart, title: 'Track & Save', desc: 'Reduce food waste by up to 68% in 30 days.', color: 'from-secondary-400 to-secondary-600 shadow-secondary-500/30' },
            ].map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + 0.1 * f.title.length }}
                className="flex items-start gap-4 p-4 rounded-3xl bg-white/60 dark:bg-slate-800/40 backdrop-blur border border-slate-100 dark:border-slate-700/50"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg shrink-0`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-800 dark:text-white">{f.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-6 -space-x-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg">
                {['A','M','R','J','S'][i]}
              </div>
            ))}
            <div className="ml-6">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <I.Star key={i} className="w-4 h-4 text-accent-400 fill-accent-400" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Loved by 150,000+ users</p>
            </div>
          </div>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="glass-card p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="mb-8 text-center lg:text-left">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Sign In</h3>
                <p className="text-slate-500 dark:text-slate-400">Enter your details to continue</p>
              </div>

              <button
                onClick={() => toast.info('Google OAuth coming soon! Try Demo login instead.')}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300 dark:hover:border-primary-500/50 hover:shadow-lg transition-all group mb-6"
              >
                <GoogleIcon className="w-5 h-5" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Continue with Google</span>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">or with email</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 block uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <I.Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input pl-12"
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-danger-500 mt-1.5 font-semibold">{errors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block uppercase tracking-wider">Password</label>
                    <Link to="#" className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <I.Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input pl-12 pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                    >
                      {showPw ? <I.EyeSlash className="w-5 h-5" /> : <I.Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-danger-500 mt-1.5 font-semibold">{errors.password}</p>}
                </div>

                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={form.remember}
                      onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                      className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Remember me for 30 days</span>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && <I.ArrowRight className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleDemo}
                  disabled={loading}
                  className="btn btn-secondary w-full"
                >
                  <I.Cpu className="w-5 h-5" />
                  Try Demo Account
                </button>
              </form>

              <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-primary-500 hover:text-primary-600 transition-colors">Create one</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
