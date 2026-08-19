import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ResultDashboard from './components/ResultDashboard';
import StatsBanner from './components/StatsBanner';
import HowItWorks from './components/HowItWorks';
import FeaturesGrid from './components/FeaturesGrid';
import CtaFooter from './components/CtaFooter';
import AuthModal from './components/AuthModal';
import { DEFAULT_API_URL } from './mockData';

export default function App() {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);

  // Authentication State with localStorage Persistence & Token Guard
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('foodfreshness_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authPromptMessage, setAuthPromptMessage] = useState(null);

  const handleOpenAuth = (mode = 'login', prompt = null) => {
    setAuthMode(mode);
    setAuthPromptMessage(prompt);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    setAuthPromptMessage(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('foodfreshness_user');
    localStorage.removeItem('foodfreshness_token');
    setUser(null);
    setAnalysisResult(null);
    setUploadedPreview(null);
  };

  const handleAnalysisSuccess = (data, imagePreview) => {
    setAnalysisResult(data);
    setUploadedPreview(imagePreview);
    setGlobalError(null);

    setTimeout(() => {
      const el = document.getElementById('result-dashboard');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setUploadedPreview(null);
    setGlobalError(null);
    
    const el = document.getElementById('hero-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f6faf6] text-gray-800 antialiased selection:bg-emerald-100 selection:text-emerald-800">
      
      {/* 1. Clean Sticky Navigation Header */}
      <Navbar
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* 2. Main Hero Section (Left copy + Right Analysis Card Form) */}
      <main className="flex-grow">
        <HeroSection
          apiUrl={apiUrl}
          user={user}
          onRequireAuth={(msg) => handleOpenAuth('login', msg)}
          onAnalysisSuccess={handleAnalysisSuccess}
          onError={(err) => setGlobalError(err)}
          loading={loading}
          setLoading={setLoading}
        />

        {/* 3. Result Dashboard (Conditional Rendering upon API Success) */}
        {analysisResult && (
          <ResultDashboard
            result={analysisResult}
            uploadedImagePreview={uploadedPreview}
            onReset={handleReset}
          />
        )}

        {/* 4. Analytics / Stats Banner (20+ Categories, 7,500+ Samples, etc.) */}
        <StatsBanner />

        {/* 5. How It Works (4 Steps Grid) */}
        <HowItWorks />

        {/* 6. Features Grid (6 Cards 3x2) */}
        <FeaturesGrid />
      </main>

      {/* 7. Call To Action Banner & Footer */}
      <CtaFooter onStartAnalysis={handleReset} />

      {/* Authentication & Security Modal (Sign In & Sign Up with Full Name, Email, Passwords) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authMode}
        promptMessage={authPromptMessage}
      />

    </div>
  );
}
