import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import I from '../components/icons';
import { features, testimonials, statsLanding } from '../data/mockData';
import Footer from '../components/layout/Footer';

const featureIconList = [I.ViewfinderCircle, I.Cpu, I.Calendar, I.Bolt, I.Thermo, I.Chart];
const featureColorList = ['primary', 'secondary', 'success', 'accent', 'danger', 'primary'];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const Landing = () => {
  return (
    <div className="relative">
      <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-10 pb-24">
        <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 right-[10%] w-80 h-80 bg-gradient-to-br from-primary-400/25 to-secondary-500/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-32 left-[5%] w-96 h-96 bg-gradient-to-br from-accent-400/20 to-primary-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={stagger} initial="hidden" animate="show" className="relative">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 mb-7">
                <div className="flex -space-x-1.5">
                  {['🥑','🍓','🥬'].map((e,i)=>(
                    <span key={i} className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-primary-100 dark:border-slate-700 flex items-center justify-center text-[10px]">{e}</span>
                  ))}
                </div>
                <span className="text-xs font-bold text-primary-700 dark:text-primary-400 tracking-tight">Trusted by 12,000+ kitchens</span>
                <I.ChevRight className="w-3.5 h-3.5 text-primary-500" />
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-6">
                AI Powered
                <span className="block mt-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                  Food Freshness
                </span>
                <span className="block mt-1">Intelligence</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mb-9 leading-relaxed">
                Upload a photo — FreshEye detects spoilage, estimates shelf-life, and gives smart storage tips. Reduce food waste by up to <strong className="text-slate-800 dark:text-slate-200">68%</strong> with instant computer vision.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-10">
                <Link to="/register" className="btn btn-primary btn-lg shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40">
                  Get Started Free
                  <I.ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="btn btn-ghost btn-lg">
                  Login
                  <I.ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/upload" className="btn btn-secondary btn-lg">
                  <I.CloudUpload className="w-5 h-5" />
                  Upload a Sample
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {[
                  { icon: I.Shield, text: 'SOC 2 Type II Secure' },
                  { icon: I.Link, text: 'GDPR Compliant' },
                  { icon: I.Globe, text: '96.8% Accuracy' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-primary-500" />
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-20"
                >
                  <div className="relative rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                          <I.Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">FreshEye Analysis</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Real-time Inference</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-success-100 dark:bg-success-500/15 text-success-700 dark:text-success-400 text-[10px] font-black">
                        FRESH
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-3 mb-5">
                      <div className="col-span-3 rounded-2xl overflow-hidden aspect-square relative">
                        <img
                          src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20strawberries%20in%20hand%20closeup%20food%20photography&image_size=square"
                          alt="AI Scan"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-secondary-500/20" />
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md flex items-center gap-1.5">
                          <span className="relative w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-[9px] font-bold text-white">SCANNING</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex flex-col gap-3">
                        {[
                          { label: 'Confidence', val: 96, color: 'from-primary-400 to-primary-600' },
                          { label: 'Freshness', val: 92, color: 'from-success-400 to-success-600' },
                        ].map(m => (
                          <div key={m.label} className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{m.label}</p>
                            <p className="font-black text-2xl text-slate-800 dark:text-white mb-2">{m.val}%</p>
                            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.val}%` }}
                                transition={{ duration: 1.5, delay: 0.8 }}
                                className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-500/10 rounded-xl p-3 text-center">
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Food</p>
                        <p className="font-bold text-sm text-slate-800 dark:text-white mt-0.5">Strawberry</p>
                      </div>
                      <div className="bg-gradient-to-br from-secondary-50 to-transparent dark:from-secondary-500/10 rounded-xl p-3 text-center">
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Shelf-Life</p>
                        <p className="font-bold text-sm text-slate-800 dark:text-white mt-0.5">5 Days</p>
                      </div>
                      <div className="bg-gradient-to-br from-accent-50 to-transparent dark:from-accent-500/10 rounded-xl p-3 text-center">
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Spoilage</p>
                        <p className="font-bold text-sm text-slate-800 dark:text-white mt-0.5">8%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -20, 0], x: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-8 -left-10 z-30 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success-400 to-success-600 flex items-center justify-center shadow-lg shadow-success-500/30">
                      <I.CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Waste Reduced</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white leading-none">- 68%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], x: [0, 8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-6 -right-6 z-30 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-4 border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 -rotate-90">
                        <circle cx="24" cy="24" r="20" stroke="#e2e8f0" strokeWidth="4" fill="none" className="dark:stroke-slate-700" />
                        <motion.circle
                          initial={{ strokeDashoffset: 126 }}
                          animate={{ strokeDashoffset: 20 }}
                          transition={{ duration: 2, delay: 1 }}
                          cx="24" cy="24" r="20" stroke="#10B981" strokeWidth="4" fill="none"
                          strokeDasharray="126" strokeLinecap="round" className="drop-shadow-md"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-black text-primary-600 dark:text-primary-400">96%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Model Acc.</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">AI Model v3.2</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {statsLanding.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <div className="inline-flex items-baseline gap-1">
                  <p className="text-4xl md:text-5xl font-black bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                </div>
                <p className="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400 mt-2">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/5 via-secondary-500/5 to-accent-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-50 dark:bg-secondary-500/10 border border-secondary-100 dark:border-secondary-500/20 mb-5">
              <I.Bolt className="w-4 h-4 text-secondary-500" />
              <span className="text-xs font-black text-secondary-700 dark:text-secondary-400 uppercase tracking-wider">Features</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-5">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">fight waste.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              From instant spoilage detection to smart storage planning — FreshEye is a complete AI toolkit for homes, grocery, and restaurants.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const IconComp = featureIconList[idx % featureIconList.length];
              const color = featureColorList[idx % featureColorList.length];
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="card p-7 group"
                >
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all',
                    color === 'primary' && 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/30',
                    color === 'secondary' && 'bg-gradient-to-br from-secondary-400 to-secondary-600 shadow-secondary-500/30',
                    color === 'success' && 'bg-gradient-to-br from-success-400 to-success-600 shadow-success-500/30',
                    color === 'accent' && 'bg-gradient-to-br from-accent-400 to-accent-600 shadow-accent-500/30',
                    color === 'danger' && 'bg-gradient-to-br from-danger-400 to-danger-600 shadow-danger-500/30',
                  )}>
                    <IconComp className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-primary-500 text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    Learn more <I.ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-20">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 dark:bg-accent-500/10 border border-accent-100 dark:border-accent-500/20 mb-5">
              <I.FingerPrint className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-black text-accent-700 dark:text-accent-400 uppercase tracking-wider">How it works</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              Three steps to{' '}
              <span className="bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent">zero guesswork.</span>
            </motion.h2>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary-300 via-secondary-400 to-accent-400 dark:from-primary-600/50 dark:via-secondary-600/50 dark:to-accent-600/50 rounded-full opacity-50" />
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-3 gap-8 relative">
              {[
                { step: '01', title: 'Upload Photo', desc: 'Snap or upload any food item. Drag & drop support with instant previews.', icon: I.Photo, color: 'primary' },
                { step: '02', title: 'AI Analysis', desc: 'FreshNet scans visual characteristics, texture patterns, and color gradients in under 2 seconds.', icon: I.Cpu, color: 'secondary' },
                { step: '03', title: 'Get Results', desc: 'Freshness score, shelf-life, health risk, and storage tips — delivered instantly.', icon: I.CheckCircle, color: 'accent' },
              ].map((s, i) => (
                <motion.div key={s.step} variants={fadeUp} className="relative">
                  <div className="relative z-10 card p-8 h-full">
                    <div className="flex items-center justify-between mb-7">
                      <div className={cn(
                        'w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg',
                        s.color === 'primary' && 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/30',
                        s.color === 'secondary' && 'bg-gradient-to-br from-secondary-400 to-secondary-600 shadow-secondary-500/30',
                        s.color === 'accent' && 'bg-gradient-to-br from-accent-400 to-accent-600 shadow-accent-500/30'
                      )}>
                        <s.icon className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-5xl font-black text-slate-100 dark:text-slate-800">{s.step}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">{s.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-secondary-500/10 to-transparent rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-20 max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 mb-5">
              <I.Heart className="w-4 h-4 text-success-500" />
              <span className="text-xs font-black text-success-700 dark:text-success-400 uppercase tracking-wider">Loved by teams</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              Real kitchens.{' '}
              <span className="bg-gradient-to-r from-success-500 to-primary-500 bg-clip-text text-transparent">Real savings.</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp} whileHover={{ y: -4 }} className="card p-6 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <I.Star key={i} className="w-4 h-4 text-accent-400 fill-accent-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 flex items-center justify-center text-white font-black">
                    {t.avatar || t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-16 text-center bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-500 shadow-2xl shadow-primary-500/30"
          >
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-7">
                <I.Sparkles className="w-4 h-4 text-white" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Start in 30 seconds</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6">
                Ready to cut your food waste in half?
              </h2>
              <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
                No credit card. Free forever plan. Join 12,000+ homes and restaurants using AI to save ingredients, money, and the planet.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/register" className="group relative px-7 py-4 rounded-2xl bg-white text-primary-700 font-black text-base shadow-2xl hover:shadow-3xl hover:-translate-y-0.5 transition-all">
                  Start Free Trial
                  <span className="inline-flex items-center gap-1.5 ml-2">
                    <I.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link to="/login" className="px-7 py-4 rounded-2xl bg-white/10 backdrop-blur-md text-white font-black text-base border border-white/20 hover:bg-white/20 transition-all">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function cn(...args) { return args.filter(Boolean).join(' '); }

export default Landing;
