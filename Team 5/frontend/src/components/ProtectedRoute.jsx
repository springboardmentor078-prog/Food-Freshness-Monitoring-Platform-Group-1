import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Optional role guard
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-dark-400">
            You don't have permission to access this page.
            Required role: {roles.join(' or ')}
          </p>
        </div>
      </div>
    );
  }

  return children;
}
