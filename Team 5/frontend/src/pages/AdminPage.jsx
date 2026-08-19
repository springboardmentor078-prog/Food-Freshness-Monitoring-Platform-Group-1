import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { foodItemsAPI } from '../api/axios';
import {
  Users, Package, Image, Activity, Shield, Server, Cpu, Database
} from 'lucide-react';
import StatCard from '../components/StatCard';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const ROLE_COLORS = {
  Consumer: '#6366f1',
  'Retail Manager': '#10b981',
  'Warehouse Operator': '#f59e0b',
  'Food Quality Inspector': '#ec4899',
  Administrator: '#ef4444',
};

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await foodItemsAPI.getAdminStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-area flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Pie chart for users by role
  const rolePieData = stats?.users_by_role
    ? Object.entries(stats.users_by_role).map(([role, count]) => ({
        name: role, value: count, color: ROLE_COLORS[role] || '#64748b',
      }))
    : [];

  // Platform activity data
  const activityData = [
    { name: 'Items', value: stats?.total_items || 0 },
    { name: 'Images', value: stats?.total_images || 0 },
    { name: 'Predictions', value: stats?.total_predictions || 0 },
  ];

  return (
    <div className="content-area space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-7 h-7 text-primary-400" />
          Admin Dashboard
        </h1>
        <p className="text-dark-400 mt-1">Platform-wide monitoring and management</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Food Items"
          value={stats?.total_items || 0}
          icon={Package}
          color="emerald"
        />
        <StatCard
          title="Images Uploaded"
          value={stats?.total_images || 0}
          icon={Image}
          color="yellow"
        />
        <StatCard
          title="AI Predictions"
          value={stats?.total_predictions || 0}
          icon={Activity}
          color="primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role Pie Chart */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Users by Role</h2>
          {rolePieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={rolePieData}
                    cx="50%" cy="50%"
                    innerRadius={45} outerRadius={75}
                    paddingAngle={4} dataKey="value"
                  >
                    {rolePieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b', border: '1px solid #334155',
                      borderRadius: '12px', color: '#e2e8f0'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {rolePieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-dark-300 truncate">{d.name}</span>
                    <span className="text-dark-500 ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-dark-500 text-sm h-48 flex items-center justify-center">
              No user data available.
            </p>
          )}
        </div>

        {/* Platform Activity Bar Chart */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-lg mb-4">Platform Activity</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: '#1e293b', border: '1px solid #334155',
                  borderRadius: '12px', color: '#e2e8f0'
                }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Users by Role — Progress Bars */}
      <div className="glass-card p-6">
        <h2 className="text-white font-semibold text-lg mb-4">Role Distribution</h2>
        {stats?.users_by_role && Object.keys(stats.users_by_role).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(stats.users_by_role).map(([role, count]) => {
              const total = stats.total_users || 1;
              const pct = Math.round((count / total) * 100);
              const color = ROLE_COLORS[role] || '#64748b';
              return (
                <div key={role}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-300">{role}</span>
                    <span className="text-dark-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-dark-500 text-sm">No user data available.</p>
        )}
      </div>

      {/* System Information */}
      <div className="glass-card p-6">
        <h2 className="text-white font-semibold text-lg mb-4">System Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-dark-800/40 border border-dark-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span className="text-dark-500">Platform Version</span>
            </div>
            <p className="text-dark-200 font-medium">1.0.0</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-800/40 border border-dark-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-dark-500">ML Models</span>
            </div>
            <p className="text-dark-200 font-medium text-xs">YOLOv8n-cls + YOLOv8s-seg + LightGBM</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-800/40 border border-dark-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-dark-500">Database</span>
            </div>
            <p className="text-dark-200 font-medium">SQLite (Dev) / PostgreSQL (Prod)</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-800/40 border border-dark-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-dark-500">API Status</span>
            </div>
            <p className="text-emerald-400 font-medium">● Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}
