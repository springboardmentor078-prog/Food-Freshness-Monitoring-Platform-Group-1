import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import ScanPage from './pages/ScanPage';
import AdminPage from './pages/AdminPage';
import PredictionHistoryPage from './pages/PredictionHistoryPage';

export default function App() {
  return (
    <div className="page-container">
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <ScanPage />
            </ProtectedRoute>
          }
        />

        {/* Prediction History */}
        <Route
          path="/history/:itemId"
          element={
            <ProtectedRoute>
              <PredictionHistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['Administrator']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-black text-dark-700 mb-4">
                  404
                </p>
                <p className="text-dark-400">Page not found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
