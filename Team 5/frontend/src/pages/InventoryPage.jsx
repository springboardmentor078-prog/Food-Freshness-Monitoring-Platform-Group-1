import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodItemsAPI } from '../api/axios';
import FreshnessCard from '../components/FreshnessCard';
import { Plus, Search, Filter, X, Loader2, Pencil, ScanLine } from 'lucide-react';

const CATEGORIES = [
  'Fruits', 'Vegetables', 'Dairy Products', 'Meat & Poultry',
  'Seafood', 'Bakery Products', 'Packaged Foods', 'Beverages',
];

const STORAGE_TYPES = ['fridge', 'counter', 'pantry', 'cold_room'];

const EMPTY_FORM = {
  name: '', category: 'Fruits',
  purchase_date: new Date().toISOString().split('T')[0],
  quantity: 1, storage_type: 'fridge', temperature: 4, humidity: 90,
};

export default function InventoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);  // null = create mode, object = edit mode
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => { loadItems(); }, [filterCategory, filterStatus]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;
      const res = await foodItemsAPI.list(params);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ ...EMPTY_FORM });
    setError('');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      category: item.category,
      purchase_date: item.purchase_date,
      quantity: item.quantity,
      storage_type: item.storage_type,
      temperature: item.temperature ?? 4,
      humidity: item.humidity ?? 90,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        await foodItemsAPI.update(editItem.id, form);
      } else {
        await foodItemsAPI.create(form);
      }
      setShowModal(false);
      setEditItem(null);
      setForm({ ...EMPTY_FORM });
      loadItems();
    } catch (err) {
      setError(err.response?.data?.detail || (editItem ? 'Failed to update item' : 'Failed to create item'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this food item and all associated images/predictions?')) return;
    try {
      await foodItemsAPI.delete(id);
      loadItems();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Filter items by search
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Summary stats
  const freshCount = items.filter(i => i.status === 'Fresh' || i.status === 'Good').length;
  const alertCount = items.filter(i => i.status === 'Near Spoilage' || i.status === 'Spoiled').length;

  return (
    <div className="content-area space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Food Inventory</h1>
          <p className="text-dark-400 text-sm mt-1">
            {items.length} items tracked
            {freshCount > 0 && <span className="text-emerald-400"> • {freshCount} fresh</span>}
            {alertCount > 0 && <span className="text-orange-400"> • {alertCount} need attention</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/scan')} className="btn-secondary flex items-center gap-2 text-sm">
            <ScanLine className="w-4 h-4" /> Scan
          </button>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Food Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="glass-input pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="glass-input w-auto min-w-[160px]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="glass-input w-auto min-w-[160px]"
        >
          <option value="">All Statuses</option>
          {['Fresh', 'Good', 'Acceptable', 'Near Spoilage', 'Spoiled'].map(s =>
            <option key={s} value={s} className="bg-dark-900">{s}</option>
          )}
        </select>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="relative group">
              <FreshnessCard
                item={item}
                onClick={() => navigate(`/scan?itemId=${item.id}`)}
              />
              {/* Edit / Delete overlay buttons */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button
                  onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                  className="p-1.5 rounded-lg bg-dark-900/80 text-dark-500 hover:text-primary-400 hover:bg-primary-500/10"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  className="p-1.5 rounded-lg bg-dark-900/80 text-dark-500 hover:text-red-400 hover:bg-red-500/10"
                  title="Delete"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Filter className="w-10 h-10 text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400">
            {items.length === 0 ? 'No food items yet. Add your first item!' : 'No items match your filters.'}
          </p>
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editItem ? 'Edit Food Item' : 'Add Food Item'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} className="text-dark-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-dark-300 text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text" value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="glass-input" placeholder="e.g. Red Apple" required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="glass-input"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-1.5">Storage</label>
                  <select
                    value={form.storage_type}
                    onChange={(e) => setForm({...form, storage_type: e.target.value})}
                    className="glass-input"
                  >
                    {STORAGE_TYPES.map(s => (
                      <option key={s} value={s} className="bg-dark-900 capitalize">{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-1.5">Purchase Date</label>
                  <input
                    type="date" value={form.purchase_date}
                    onChange={(e) => setForm({...form, purchase_date: e.target.value})}
                    className="glass-input" required
                  />
                </div>
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-1.5">Quantity</label>
                  <input
                    type="number" value={form.quantity} min="0.1" step="0.1"
                    onChange={(e) => setForm({...form, quantity: parseFloat(e.target.value)})}
                    className="glass-input" required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-1.5">Temperature (°C)</label>
                  <input
                    type="number" value={form.temperature} step="0.1"
                    onChange={(e) => setForm({...form, temperature: parseFloat(e.target.value)})}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-dark-300 text-sm font-medium mb-1.5">Humidity (%)</label>
                  <input
                    type="number" value={form.humidity} min="0" max="100"
                    onChange={(e) => setForm({...form, humidity: parseFloat(e.target.value)})}
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditItem(null); }} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    : (editItem ? 'Update Item' : 'Add Item')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
