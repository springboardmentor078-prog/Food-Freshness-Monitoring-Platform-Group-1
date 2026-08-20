import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';
import LoadingOverlay from '../ui/Spinner';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <LoadingOverlay text="Loading FreshEye AI..." />;
  }

  if (!isAuthenticated) return null;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      <div className="transition-all duration-300 ease-in-out" style={{ marginLeft: isCollapsed ? '5rem' : '17rem' }}>
        <Navbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} isSidebarCollapsed={isCollapsed} />

        <main className="min-h-[calc(100vh-5rem-5rem)] p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <div style={{ marginLeft: isCollapsed ? 0 : 0 }}>
          <Footer simple />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
