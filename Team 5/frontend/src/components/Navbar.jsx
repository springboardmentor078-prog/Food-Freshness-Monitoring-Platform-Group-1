import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, LogOut, Menu, X, ScanLine } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated ? [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/scan', label: 'Scan Food' },
    ...(user?.role === 'Administrator' ? [{ to: '/admin', label: 'Admin' }] : []),
  ] : [];

  return (
    <nav className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/20 transition-shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-emerald-300 bg-clip-text text-transparent">
              FreshSense
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary-500/15 text-primary-400'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Quick Scan */}
                <button
                  onClick={() => navigate('/scan')}
                  className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                  title="Quick Scan"
                >
                  <ScanLine className="w-5 h-5" />
                </button>

                <div className="text-right mr-2">
                  <p className="text-sm font-medium text-dark-200">{user?.name}</p>
                  <p className="text-xs text-dark-500">{user?.role}</p>
                </div>
                <button onClick={handleLogout}
                  className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-dark-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-dark-800/50 mt-2 pt-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 text-left"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
