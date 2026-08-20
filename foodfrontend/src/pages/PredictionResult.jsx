import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import I from '../components/icons';
const HiOutlineArrowLeft = I.ArrowLeft;
const HiOutlineDownload = I.Download;
const HiOutlineShare = I.Share;
const HiOutlineRefresh = I.Refresh;
const HiOutlineSparkles = I.Sparkles;
const HiOutlineClock = I.Clock;
const HiOutlineThermometer = I.Thermo;
const HiOutlineCloud = I.Cloud;
const HiOutlineExclamationTriangle = I.Exclamation;
const HiOutlineCheckCircle = I.CheckCircle;
const HiOutlineInformationCircle = I.InfoCircle;
const HiOutlineChartBar = I.Chart;
const HiOutlineLightBulb = I.Bulb;
const HiOutlineShieldCheck = I.Shield;
const HiOutlineHeart = I.Heart;
const HiOutlineChevronRight = I.ChevRight;
const HiOutlineCamera = I.Camera;
import { StatusBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { CircularProgress, GaugeChart, ProgressBar } from '../components/ui/Progress';
import { LineChartCard, PieChartCard } from '../components/charts/Charts';
import { Skeleton, CardSkeleton } from '../components/ui/Skeleton';
import { predictionService } from '../services/api';
import { useLazyApi } from '../hooks/useApi';
import { getStatusColor, formatDateTime } from '../utils/helpers';
import { predictionsData } from '../data/mockData';
import { ACCURACY_TREND } from '../constants';

const PredictionResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get('id');

  const passedPrediction = location.state?.prediction;
  const [prediction, setPrediction] = useState(passedPrediction);
  const [loading, setLoading] = useState(!passedPrediction);

  const { data: fetched, load } = useLazyApi(predictionService.getById);

  useEffect(() => {
    if (!passedPrediction) {
      if (id) {
        load(id).then(d => setPrediction(d)).finally(() => setLoading(false));
      } else {
        const sample = predictionsData[0];
        setTimeout(() => {
          setPrediction(sample);
          setLoading(false);
        }, 600);
      }
    }
  }, [passedPrediction, id, load]);

  if (loading || !prediction) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-16 w-full rounded-3xl" />
        <div className="grid lg:grid-cols-5 gap-8">
          <CardSkeleton className="lg:col-span-2" lines={3} />
          <div className="lg:col-span-3 space-y-8">
            <CardSkeleton lines={4} />
            <div className="grid sm:grid-cols-2 gap-6">
              <CardSkeleton lines={2} /><CardSkeleton lines={2} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const colors = getStatusColor(prediction.status);
  const riskLevel = prediction.healthRisk || 'Low';
  const riskColors = {
    Low: { bg: 'bg-success-50 dark:bg-success-500/15', text: 'text-success-700 dark:text-success-400', icon: HiOutlineCheckCircle },
    Medium: { bg: 'bg-accent-50 dark:bg-accent-500/15', text: 'text-accent-700 dark:text-accent-400', icon: HiOutlineExclamationTriangle },
    High: { bg: 'bg-danger-50 dark:bg-danger-500/15', text: 'text-danger-700 dark:text-danger-400', icon: HiOutlineExclamationTriangle },
  };
  const rc = riskColors[riskLevel] || riskColors.Low;
  const RiskIcon = rc.icon;

  const healthDistribution = [
    { name: 'Nutritious', value: Math.round(prediction.freshness * 0.6), color: '#10B981' },
    { name: 'Safe to Eat', value: Math.round(prediction.freshness * 0.3), color: '#2563EB' },
    { name: 'At Risk', value: prediction.spoilage, color: '#EF4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} icon={<HiOutlineArrowLeft className="w-5 h-5" />}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Prediction Results</h1>
              <StatusBadge status={prediction.status}>
                {prediction.prediction}
              </StatusBadge>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
              <HiOutlineClock className="w-4 h-4" />
              Analyzed: {formatDateTime(prediction.predictionTime || prediction.date)}
              <span className="text-slate-300 dark:text-slate-700">|</span>
              Model: <span className="font-semibold text-primary-600 dark:text-primary-400">{prediction.modelVersion || 'FreshNet v3.2.1'}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            icon={<HiOutlineShare className="w-5 h-5" />}
            onClick={() => toast.success('Share link copied to clipboard!')}
          >
            Share
          </Button>
          <Button
            variant="outline"
            icon={<HiOutlineDownload className="w-5 h-5" />}
            onClick={() => toast.success('Report download started!')}
          >
            Download Report
          </Button>
          <Button
            variant="primary"
            icon={<HiOutlineRefresh className="w-5 h-5" />}
            onClick={() => navigate('/upload')}
          >
            Analyze Another
          </Button>
        </div>
      </motion.div>

      {/* Hero Result Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`relative overflow-hidden rounded-[2rem] shadow-xl p-8 md:p-10 ${
          prediction.status === 'fresh' ? 'bg-gradient-to-br from-success-600 via-success-500 to-primary-600 shadow-success-500/25' :
          prediction.status === 'moderate' ? 'bg-gradient-to-br from-accent-600 via-accent-500 to-orange-600 shadow-accent-500/25' :
          'bg-gradient-to-br from-danger-600 via-danger-500 to-rose-600 shadow-danger-500/25'
        }`}
      >
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

        <div className="relative grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="flex items-center gap-8">
            <div className="shrink-0">
              <GaugeChart
                value={prediction.freshness}
                label="Freshness"
                size={220}
                colorRanges={[
                  { start: 0, end: 33, color: '#EF4444' },
                  { start: 33, end: 66, color: '#F59E0B' },
                  { start: 66, end: 100, color: '#FFFFFF' },
                ]}
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Detected Food</p>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-none drop-shadow-lg">
                  {prediction.food}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Overall Verdict</p>
                  <p className="font-black text-xl text-white">{prediction.prediction}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { l: 'Confidence Score', v: `${prediction.confidence}%`, sub: 'Model certainty' },
                { l: 'Shelf-Life Left', v: prediction.shelfLife === 0 ? 'Expired' : `${prediction.shelfLife} Days`, sub: 'Recommended use within' },
                { l: 'Spoilage Risk', v: `${prediction.spoilage}%`, sub: 'Current degradation' },
                { l: 'Processing Time', v: '2.1 sec', sub: 'Inference duration' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                >
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">{s.l}</p>
                  <p className="text-white text-2xl font-black leading-none mb-1">{s.v}</p>
                  <p className="text-white/60 text-[11px]">{s.sub}</p>
                </motion.div>
              ))}
            </div>

            <div className={`flex items-start gap-3 p-4 rounded-2xl ${rc.bg} backdrop-blur-md border border-white/20`}>
              <RiskIcon className={`w-6 h-6 ${rc.text} shrink-0 mt-0.5`} />
              <div>
                <p className={`font-black ${rc.text}`}>Health Risk: {riskLevel}</p>
                <p className="text-xs text-white/75 mt-0.5">
                  {prediction.status === 'spoiled'
                    ? 'Do not consume this product. Spoilage bacteria may be present.'
                    : prediction.status === 'moderate'
                    ? 'Inspect thoroughly before consumption. Best if eaten soon.'
                    : 'Safe and ready to enjoy. Optimal nutritional value detected.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Image & Grad-CAM */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center">
                  <HiOutlineCamera className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Uploaded Image</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Original scan input</p>
                </div>
              </div>
              <StatusBadge status={prediction.status} />
            </div>
            <div className="aspect-square bg-slate-50 dark:bg-slate-900/50 relative">
              <img
                src={prediction.image}
                alt={prediction.food}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md flex items-center gap-2 text-xs font-bold text-white">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                CAPTURED
              </div>
            </div>
          </div>

          {/* Grad-CAM */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary-500/10 to-primary-500/10 flex items-center justify-center">
                  <HiOutlineChartBar className="w-5 h-5 text-secondary-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Grad-CAM Heatmap</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Neural attention visualization</p>
                </div>
              </div>
              <Badge variant="info" size="sm">AI Explainability</Badge>
            </div>
            <div className="aspect-square relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
              <img
                src={prediction.image}
                alt="heatmap"
                className="w-full h-full object-cover opacity-60"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 50%, rgba(239, 68, 68, ${prediction.status === 'spoiled' ? 0.55 : prediction.status === 'moderate' ? 0.35 : 0.15}) 0%, rgba(245, 158, 11, ${prediction.status === 'spoiled' ? 0.35 : prediction.status === 'moderate' ? 0.25 : 0.1}) 35%, rgba(16, 185, 129, ${prediction.status === 'fresh' ? 0.35 : prediction.status === 'moderate' ? 0.15 : 0.05}) 70%, transparent 100%)`,
                  mixBlendMode: 'multiply'
                }}
              />
              {/* overlay key points */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: [0.4, 0.8, 0.4] }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 2, repeat: Infinity }}
                    className="absolute rounded-full border-2 border-white/70"
                    style={{
                      width: 20 + Math.random() * 40,
                      height: 20 + Math.random() * 40,
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wider text-center">
              <span className="text-success-600 dark:text-success-400">Fresh Region</span>
              <span className="text-accent-600 dark:text-accent-400">At Risk</span>
              <span className="text-danger-600 dark:text-danger-400">Spoiled Hotspot</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Quick Metrics Grid */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { l: 'Confidence', v: prediction.confidence, u: '%', c: 'primary', icon: HiOutlineShieldCheck },
              { l: 'Freshness', v: prediction.freshness, u: '%', c: 'success', icon: HiOutlineCheckCircle },
              { l: 'Spoilage', v: prediction.spoilage, u: '%', c: 'danger', icon: HiOutlineExclamationTriangle },
              { l: 'Shelf-Life', v: prediction.shelfLife, u: prediction.shelfLife === 1 ? ' Day' : ' Days', c: 'accent', icon: HiOutlineClock },
            ].map((m, i) => {
              const colorMap = {
                primary: { g: 'from-primary-500 to-primary-600', s: 'shadow-primary-500/30', t: '#10B981' },
                success: { g: 'from-success-500 to-success-600', s: 'shadow-success-500/30', t: '#22C55E' },
                danger: { g: 'from-danger-500 to-danger-600', s: 'shadow-danger-500/30', t: '#EF4444' },
                accent: { g: 'from-accent-500 to-accent-600', s: 'shadow-accent-500/30', t: '#F59E0B' },
              };
              const cm = colorMap[m.c];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="card p-5 relative overflow-hidden group"
                >
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity"
                       style={{ background: `linear-gradient(135deg, ${cm.t}, transparent)` }} />
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cm.g} shadow-lg ${cm.s} flex items-center justify-center mb-4`}>
                    <m.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{m.l}</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                    {m.v}<span className="text-lg text-slate-400 dark:text-slate-500 ml-1">{m.u}</span>
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Storage Conditions */}
          <div className="card p-6 md:p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-secondary-500/15 to-primary-500/15 flex items-center justify-center">
                <HiOutlineThermometer className="w-5 h-5 text-secondary-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Storage Conditions</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Environment at time of analysis</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { l: 'Storage', v: prediction.storageConditions?.type || 'Refrigerated', icon: HiOutlineInformationCircle, c: 'primary' },
                { l: 'Temperature', v: `${prediction.storageConditions?.temp ?? 4}°C`, icon: HiOutlineThermometer, c: 'accent' },
                { l: 'Humidity', v: `${prediction.storageConditions?.humidity ?? 80}%`, icon: HiOutlineCloud, c: 'secondary' },
              ].map((s, i) => {
                const c = i === 0 ? 'primary' : i === 1 ? 'accent' : 'secondary';
                return (
                  <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br from-${c}-50 to-transparent dark:from-${c}-500/10 border border-slate-100 dark:border-slate-700/50`}>
                    <s.icon className={`w-6 h-6 text-${c}-500 mb-3`} />
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{s.l}</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white">{s.v}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`relative overflow-hidden card p-6 md:p-7 border-2 ${
              prediction.status === 'fresh' ? 'border-success-200 dark:border-success-500/30 bg-gradient-to-br from-success-500/5 via-white to-transparent dark:via-slate-800' :
              prediction.status === 'moderate' ? 'border-accent-200 dark:border-accent-500/30 bg-gradient-to-br from-accent-500/5 via-white to-transparent dark:via-slate-800' :
              'border-danger-200 dark:border-danger-500/30 bg-gradient-to-br from-danger-500/5 via-white to-transparent dark:via-slate-800'
            }`}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary-400/10 to-secondary-500/10 rounded-full blur-2xl" />
            <div className="relative flex items-start gap-5">
              <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-lg flex items-center justify-center`}
                   style={{ boxShadow: `0 10px 30px ${colors.hex}30` }}>
                <HiOutlineLightBulb className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">AI Recommendation</h3>
                  <Badge variant="primary" size="sm">
                    <HiOutlineSparkles className="w-3 h-3" />
                    FreshNet
                  </Badge>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base mb-5">
                  {prediction.recommendation}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/recommendations')}
                    icon={<HiOutlineChevronRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    See Full Recommendations
                  </Button>
                  <Button variant="ghost" size="sm" icon={<HiOutlineHeart className="w-4 h-4" />}>
                    {prediction.nutrition?.split('.')[0]}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nutrition info */}
          <div className="card p-6 md:p-7">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-success-500/15 to-primary-500/15 flex items-center justify-center">
                  <HiOutlineHeart className="w-5 h-5 text-success-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Nutrition & Health</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Based on detected state</p>
                </div>
              </div>
              <StatusBadge status={prediction.status}>
                {prediction.status === 'fresh' ? 'Peak nutrition' : prediction.status === 'moderate' ? 'Slight degradation' : 'Unsafe'}
              </StatusBadge>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              {prediction.nutrition}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { l: 'Nutritional Value Retained', v: Math.max(prediction.freshness - 5, 10), c: 'success' },
                  { l: 'Taste Quality', v: prediction.freshness, c: 'primary' },
                  { l: 'Textural Integrity', v: prediction.status === 'spoiled' ? 15 : prediction.freshness - 3, c: 'secondary' },
                ].map((b, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{b.l}</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">{b.v}%</span>
                    </div>
                    <ProgressBar value={b.v} color={b.c} size="md" />
                  </div>
                ))}
              </div>
              <div className="h-64">
                <PieChartCard
                  data={healthDistribution}
                  title=""
                  subtitle=""
                  height={260}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Accuracy Chart */}
      <div className="card p-6 md:p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Model Performance Context</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">FreshNet accuracy improvement (last 7 months)</p>
          </div>
          <Badge variant="success">Continuous Learning</Badge>
        </div>
        <div className="h-72">
          <LineChartCard
            data={ACCURACY_TREND}
            title=""
            dataKeys={[{ key: 'accuracy', name: 'Model Accuracy %', color: '#10B981' }]}
            height={288}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
