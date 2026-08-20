import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import I from '../components/icons';
const HiOutlineSearch = I.Search;
const HiOutlineFilter = I.Filter;
const HiOutlineSortAscending = I.SortAsc;
const HiOutlineSortDescending = I.SortDesc;
const HiOutlineEye = I.Eye;
const HiOutlineTrash = I.Trash;
const HiOutlineDownload = I.Download;
const HiOutlineUpload = I.Upload;
const HiOutlineChevronLeft = I.ChevLeft;
const HiOutlineChevronRight = I.ChevRight;
const HiOutlineSparkles = I.Sparkles;
const HiOutlineClock = I.Clock;
import Button from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import Badge, { StatusBadge } from '../components/ui/Badge';
import { Skeleton, TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/Modal';
import { CircularProgress } from '../components/ui/Progress';
import { predictionService } from '../services/api';
import { useLazyApi } from '../hooks/useApi';
import { getStatusColor, formatDate } from '../utils/helpers';
import { PREDICTION_HISTORY } from '../constants';

const History = () => {
  const navigate = useNavigate();
  const { data, load, loading } = useLazyApi(predictionService.getHistory);
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState(null);

  useEffect(() => {
    load({ search, filter, sortBy, sortOrder, page, perPage });
  }, [search, filter, sortBy, sortOrder, page, perPage]);

  useEffect(() => {
    if (data) setPredictions(data.predictions || []);
  }, [data]);

  const filtered = useMemo(() => {
    let result = [...predictions];
    if (search) result = result.filter(p => p.food.toLowerCase().includes(search.toLowerCase()));
    if (filter !== 'all') result = result.filter(p => p.status === filter);
    result.sort((a, b) => {
      let av = a[sortBy] || '', bv = b[sortBy] || '';
      if (sortBy === 'date') { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
      if (typeof av === 'string') return sortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortOrder === 'asc' ? av - bv : bv - av;
    });
    return result;
  }, [predictions, search, filter, sortBy, sortOrder]);

  const paginated = useMemo(() =>
    filtered.slice((page - 1) * perPage, page * perPage),
  [filtered, page, perPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const handleDelete = async () => {
    if (!deleteDialog) return;
    await predictionService.delete(deleteDialog.id);
    setPredictions(prev => prev.filter(p => p.id !== deleteDialog.id));
    toast.success('Prediction deleted');
    setDeleteDialog(null);
  };

  const stats = [
    { l: 'Total Analyzed', v: predictions.length, c: 'primary' },
    { l: 'Fresh Items', v: predictions.filter(p => p.status === 'fresh').length, c: 'success' },
    { l: 'Moderate Items', v: predictions.filter(p => p.status === 'moderate').length, c: 'accent' },
    { l: 'Spoiled Items', v: predictions.filter(p => p.status === 'spoiled').length, c: 'danger' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-accent-600 via-primary-600 to-secondary-600 p-8 md:p-10 shadow-xl shadow-primary-500/25"
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 mb-4">
              <HiOutlineClock className="w-4 h-4 text-yellow-200" />
              <span className="text-xs font-bold text-white/90">Full Audit Trail</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Prediction History</h1>
            <p className="text-white/80 max-w-xl">
              Browse and manage every freshness analysis you've ever performed. Search, filter, and export insights.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="ghost" className="!bg-white/15 !backdrop-blur-md !border !border-white/20 !text-white hover:!bg-white/25" icon={<HiOutlineDownload className="w-5 h-5" />}>
              Export CSV
            </Button>
            <Button variant="ghost" className="!bg-white !text-primary-700 hover:!bg-white/90 !shadow-lg" icon={<HiOutlineUpload className="w-5 h-5" />} onClick={() => navigate('/upload')}>
              New Analysis
            </Button>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const c = s.c;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              >
                <p className="text-white/70 text-[11px] font-bold uppercase tracking-wider mb-1">{s.l}</p>
                <p className="text-white text-3xl font-black">{s.v}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5 md:p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by food name..."
              className="input-field pl-12 !py-3"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <Select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="!w-44"
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Fresh Only', value: 'fresh' },
                { label: 'Moderate', value: 'moderate' },
                { label: 'Spoiled', value: 'spoiled' },
              ]}
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="!w-40"
              options={[
                { label: 'Date', value: 'date' },
                { label: 'Food', value: 'food' },
                { label: 'Confidence', value: 'confidence' },
                { label: 'Freshness', value: 'freshness' },
                { label: 'Shelf Life', value: 'shelfLife' },
              ]}
            />
            <button
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              className="px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary-400 hover:text-primary-500 transition-colors flex items-center gap-2 font-semibold text-sm text-slate-600 dark:text-slate-400"
            >
              {sortOrder === 'asc' ? <HiOutlineSortAscending className="w-4 h-4" /> : <HiOutlineSortDescending className="w-4 h-4" />}
              {sortOrder.toUpperCase()}
            </button>
            <Select
              value={perPage.toString()}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="!w-28"
              options={['10', '25', '50', '100'].map(n => ({ label: `${n} / page`, value: n }))}
            />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {loading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon="search"
            title={search || filter !== 'all' ? 'No matching predictions' : 'No predictions yet'}
            description={search || filter !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Start by analyzing your first food item.'}
            action={!search && filter === 'all'}
            actionLabel="Analyze First Image"
            onAction={() => navigate('/upload')}
          />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Food</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prediction</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confidence</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Freshness</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Shelf-Life</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  <AnimatePresence>
                    {paginated.map((p, i) => {
                      const c = getStatusColor(p.status);
                      return (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ delay: i * 0.03 }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-sm group-hover:shadow-md transition-shadow">
                              <img
                                src={p.image || 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mixed%20vegetables&image_size=square'}
                                alt={p.food}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-800 ${c.bg}`} />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 dark:text-slate-200">{p.food}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">#{p.id.toString().padStart(6, '0')}</p>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <CircularProgress value={p.confidence || 85} size={40} strokeWidth={4} color={c.hex} />
                              <span className="font-bold text-slate-800 dark:text-slate-200">{p.confidence || 85}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 max-w-[160px]">
                              <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                <div className={`h-full rounded-full bg-gradient-to-r ${c.gradient}`} style={{ width: `${p.freshness || 70}%` }} />
                              </div>
                              <span className="font-bold text-sm text-slate-800 dark:text-slate-200 w-10 text-right">{p.freshness || 70}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold ${p.shelfLife === 0 ? 'text-danger-600 dark:text-danger-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {p.shelfLife === 0 ? 'Expired' : `${p.shelfLife} days`}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{formatDate(p.date)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => navigate(`/prediction?id=${p.id}`)}
                                className="p-2 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
                                title="View Details"
                              >
                                <HiOutlineEye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteDialog(p)}
                                className="p-2 rounded-xl bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-500/20 transition-colors"
                                title="Delete"
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Showing <b className="text-slate-700 dark:text-slate-300">{Math.min((page - 1) * perPage + 1, filtered.length)}</b> to <b className="text-slate-700 dark:text-slate-300">{Math.min(page * perPage, filtered.length)}</b> of <b className="text-slate-700 dark:text-slate-300">{filtered.length}</b> predictions
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-400 hover:text-primary-500 transition-colors disabled:opacity-50 disabled:hover:border-slate-200 dark:disabled:hover:border-slate-700 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pg;
                    if (totalPages <= 5) pg = i + 1;
                    else if (page <= 3) pg = i + 1;
                    else if (page >= totalPages - 2) pg = totalPages - 4 + i;
                    else pg = page - 2 + i;
                    return (
                      <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`min-w-[40px] h-10 px-3 rounded-xl font-bold text-sm transition-colors ${
                          page === pg
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-500'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-400 hover:text-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <ConfirmDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={handleDelete}
        title="Delete this prediction?"
        message={`You are about to permanently remove the analysis for "${deleteDialog?.food}". This action cannot be undone.`}
        confirmText="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};

export default History;
