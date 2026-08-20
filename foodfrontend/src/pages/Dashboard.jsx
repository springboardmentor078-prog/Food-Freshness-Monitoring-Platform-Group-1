import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import I from '../components/icons';
const HiOutlineChartBar = I.Chart;
const HiOutlineSparkles = I.Sparkles;
const HiOutlineUpload = I.Upload;
const HiOutlineClock = I.Clock;
const HiOutlineCube = I.Cube;
const HiOutlineStar = I.Star;
const HiOutlineCalendar = I.Calendar;
const HiOutlineLightBulb = I.Bulb;
const HiOutlineChevronRight = I.ChevRight;
const HiOutlineArrowTrendingUp = I.ArrowUp;
const HiOutlineArrowTrendingDown = I.ArrowDown;
const HiOutlineInboxStack = I.Inbox;
const HiOutlineEye = I.Eye;
const HiOutlineCamera = I.Camera;
const HiOutlineCheckCircle = I.CheckCircle;
const HiOutlineExclamation = I.Exclamation;
const HiOutlineXCircle = I.XCircle;
const HiOutlineInformationCircle = I.InfoCircle;
import StatsCard from '../components/cards/StatsCard';
import PredictionCard from '../components/cards/PredictionCard';
import { PieChartCard, BarChartCard, AreaChartCard, LineChartCard } from '../components/charts/Charts';
import { CircularProgress, ProgressBar } from '../components/ui/Progress';
import Badge, { StatusBadge } from '../components/ui/Badge';
import { CardSkeleton, ChartSkeleton, Skeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useLazyApi } from '../hooks/useApi';
import { dashboardService, predictionService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getStatusColor, formatDate } from '../utils/helpers';
import { predictionsData } from '../data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: stats, load: loadStats, loading: statsLoading } = useLazyApi(dashboardService.getStats);
  const { data: weekly, load: loadWeekly, loading: weeklyLoading } = useLazyApi(dashboardService.getWeeklyData);
  const { data: distribution, load: loadDistribution, loading: distLoading } = useLazyApi(dashboardService.getFreshnessDistribution);
  const { data: shelfLife, load: loadShelfLife, loading: shelfLoading } = useLazyApi(dashboardService.getShelfLifeData);
  const { data: accuracy, load: loadAccuracy, loading: accLoading } = useLazyApi(dashboardService.getAccuracyTrend);
  const { data: tip, load: loadTip, loading: tipLoading } = useLazyApi(dashboardService.getDailyTip);
  const { data: recentPredictions, load: loadRecent, loading: recentLoading } = useLazyApi(dashboardService.getRecentPredictions);
  const { data: activity, load: loadActivity, loading: actLoading } = useLazyApi(dashboardService.getRecentActivity);

  useEffect(() => {
    loadStats();
    loadWeekly();
    loadDistribution();
    loadShelfLife();
    loadAccuracy();
    loadTip();
    loadRecent();
    loadActivity();
  }, []);

  const statCards = stats && [
    { title: 'Total Predictions', value: stats.totalPredictions, icon: HiOutlineChartBar, change: 12.5, changeType: 'increase', color: 'primary', suffix: '+', progress: 78 },
    { title: 'Fresh Foods', value: stats.freshFoods, icon: HiOutlineCheckCircle, change: 8.3, changeType: 'increase', color: 'success', suffix: '', progress: 85 },
    { title: 'Spoiled Foods', value: stats.spoiledFoods, icon: HiOutlineXCircle, change: 4.2, changeType: 'decrease', color: 'danger', suffix: '', progress: 22 },
    { title: 'Avg Freshness', value: stats.averageFreshness, icon: HiOutlineStar, change: 2.1, changeType: 'increase', color: 'secondary', suffix: '%', progress: stats.averageFreshness, decimals: 1 },
    { title: 'Avg Shelf-Life', value: stats.avgShelfLife, icon: HiOutlineCalendar, change: 5.6, changeType: 'increase', color: 'accent', suffix: ' days', progress: 65, decimals: 1 },
    { title: 'Inventory Items', value: stats.inventoryCount, icon: HiOutlineCube, change: 9.8, changeType: 'increase', color: 'primary', suffix: '', progress: 72 },
  ];

  const activityIcon = (type) => {
    switch (type) {
      case 'prediction': return HiOutlineEye;
      case 'upload': return HiOutlineUpload;
      default: return HiOutlineInformationCircle;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 p-8 md:p-10 shadow-xl shadow-primary-500/25"
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 mb-4">
              <HiSparkles className="w-4 h-4 text-yellow-200" />
              <span className="text-xs font-bold text-white/90">Welcome back, {user?.role}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight">
              Good to see you, <span className="text-yellow-200">{user?.name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-lg">
              You've analyzed <b className="text-yellow-200">147 items</b> this month and saved approximately <b className="text-yellow-200">$342</b> on groceries. Keep it going! 🎉
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Button
              variant="ghost"
              className="!bg-white !text-primary-700 hover:!bg-white/90 !shadow-lg !shadow-black/10"
              icon={<HiOutlineCamera className="w-5 h-5" />}
              onClick={() => navigate('/upload')}
            >
              Analyze New Item
            </Button>
            <Button
              variant="secondary"
              className="!bg-white/15 !backdrop-blur-md !border !border-white/25 !text-white hover:!bg-white/25"
              icon={<HiOutlineInboxStack className="w-5 h-5" />}
              onClick={() => navigate('/history')}
            >
              View Full History
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div>
        {statsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} lines={1} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {statCards?.map((s, i) => (
              <StatsCard key={i} {...s} />
            ))}
          </div>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {weeklyLoading ? (
          <ChartSkeleton className="lg:col-span-2" />
        ) : (
          <AreaChartCard
            className="lg:col-span-2"
            title="Weekly Analysis Activity"
            subtitle="Predictions made over the last 7 days"
            data={weekly || []}
            dataKeys={[
              { key: 'predictions', name: 'Total', color: '#2563EB' },
              { key: 'fresh', name: 'Fresh', color: '#10B981' },
              { key: 'spoiled', name: 'Spoiled', color: '#EF4444' },
            ]}
            height={340}
          />
        )}
        {distLoading ? (
          <ChartSkeleton />
        ) : (
          <PieChartCard
            title="Freshness Distribution"
            subtitle="Overall inventory health"
            data={distribution || []}
            height={340}
          />
        )}
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Tip Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-primary-500/5 to-secondary-500/5" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-accent-400/20 to-primary-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30">
                  <HiOutlineLightBulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 leading-none">Daily AI Tip</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Smart suggestion</p>
                </div>
              </div>
              <Badge variant="warning" size="sm">New</Badge>
            </div>
            {tipLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 text-sm">
                💡 {tip}
              </p>
            )}
            <button onClick={() => navigate('/recommendations')} className="text-sm font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:gap-2 transition-all">
              View all recommendations <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-lg shadow-secondary-500/30">
                <HiOutlineClock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 leading-none">Recent Activity</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Latest events</p>
              </div>
            </div>
            <Badge variant="primary" size="sm">Live</Badge>
          </div>
          <div className="space-y-3">
            {actLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                </div>
              ))
            ) : (
              activity?.map((a, i) => {
                const Icon = activityIcon(a.type);
                const c = getStatusColor(a.status);
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.bgLight}`}>
                      <Icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {a.type === 'prediction' ? `Analyzed: ${a.food}` : a.food}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-500">{a.time}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Accuracy Chart */}
        {accLoading ? (
          <ChartSkeleton />
        ) : (
          <LineChartCard
            title="Model Accuracy"
            subtitle="FreshNet performance over time"
            data={accuracy || []}
            dataKeys={[{ key: 'accuracy', name: 'Accuracy %', color: '#10B981' }]}
            height={320}
          />
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {shelfLoading ? (
          <ChartSkeleton />
        ) : (
          <BarChartCard
            title="Shelf-Life Distribution"
            subtitle="Days remaining across all items"
            data={shelfLife?.map(s => ({ ...s, value: s.count })) || []}
            dataKeys={[{ key: 'count', name: 'Items', color: '#F59E0B' }]}
            height={340}
          />
        )}

        {/* Inventory Health Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Inventory Health</h3>
            <Badge variant="success">Excellent</Badge>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <CircularProgress
              value={stats?.averageFreshness || 78.5}
              label="Overall Health"
              sublabel="Across inventory"
              size={180}
              strokeWidth={14}
              color="#10B981"
            />
            <div className="flex-1 w-full space-y-5">
              {[
                { label: 'Fresh Items', value: stats?.freshFoods || 682, pct: 55, color: 'success', icon: HiOutlineCheckCircle, t: 'fresh' },
                { label: 'Moderate Items', value: stats ? Math.round(stats.totalPredictions * 0.33) : 409, pct: 33, color: 'accent', icon: HiOutlineExclamation, t: 'moderate' },
                { label: 'Spoiled Items', value: stats?.spoiledFoods || 156, pct: 12, color: 'danger', icon: HiOutlineXCircle, t: 'spoiled' },
              ].map((m, i) => {
                const colors = getStatusColor(m.t);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <m.icon className={`w-4 h-4 ${colors.text}`} />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{m.label}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{m.value} items</span>
                    </div>
                    <ProgressBar value={m.pct} color={m.color} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Predictions */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">Recent Predictions</h2>
            <p className="text-slate-500 dark:text-slate-400">Latest analysis results from your inventory</p>
          </div>
          <Button
            variant="outline"
            icon={<HiOutlineChevronRight className="w-5 h-5" />}
            iconPosition="right"
            onClick={() => navigate('/history')}
          >
            View All
          </Button>
        </div>
        {recentLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} lines={2} />)}
          </div>
        ) : recentPredictions?.length === 0 ? (
          <EmptyState
            icon="upload"
            title="No predictions yet"
            description="Start by uploading your first food image to analyze freshness."
            action
            actionLabel="Upload First Image"
            onAction={() => navigate('/upload')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {(recentPredictions || predictionsData.slice(0, 5)).map((p, i) => (
              <PredictionCard
                key={p.id}
                prediction={p}
                compact
                onView={() => navigate(`/prediction?id=${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
