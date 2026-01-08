import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ComparisonPage from './pages/ComparisonPage';
import CalculatorPage from './pages/CalculatorPage';
import OptimizerPage from './pages/OptimizerPage';
import ProfilePage from './pages/ProfilePage';
import LoansForm from './pages/LoansForm';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const { user, loading } = useAuth();

  // Initialize icons on page change
  useEffect(() => {
    const initIcons = async () => {
      if (typeof window !== 'undefined') {
        try {
          const lucide = await import('lucide-react');
          // Icons are already imported as React components, so no initialization needed
        } catch (error) {
          console.error('Failed to load icons:', error);
        }
      }
    };
    
    initIcons();
  }, [currentPage]);

  // Map URL pathname to internal page state on first mount (so direct links work)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.replace(/\/+$/g, '') || '/';
    const mapPathToPage = (p: string) => {
      switch (p) {
        case '/':
        case '/landing':
          return 'landing';
        case '/login':
          return 'login';
        case '/signup':
          return 'signup';
        case '/dashboard':
          return 'dashboard';
        case '/comparison':
          return 'comparison';
        case '/calculator':
          return 'calculator';
        case '/optimizer':
          return 'optimizer';
        case '/profile':
          return 'profile';
        case '/loanform':
          return 'loanform';
        default:
          return 'landing';
      }
    };
    setCurrentPage(mapPathToPage(path));
  }, []);

  // Redirect to login if trying to access protected routes without auth
  useEffect(() => {
    if (!loading && !user && ['dashboard', 'comparison', 'calculator', 'optimizer', 'profile'].includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [user, loading, currentPage]);

  // Handle OAuth callback - check if user just signed in via OAuth
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && currentPage === 'login') {
        setCurrentPage('dashboard');
      }
    };
    handleOAuthCallback();
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setPage={setCurrentPage} />;
      case 'login':
        return <LoginPage setPage={setCurrentPage} />;
      case 'signup':
        return <SignupPage setPage={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'comparison':
        return <ComparisonPage setPage={setCurrentPage} />;
      case 'calculator':
        return <CalculatorPage />;
      case 'optimizer':
        return <OptimizerPage />;
      case 'profile':
        return <ProfilePage />;
      case 'loanform':
        return <LoansForm />
      default:
        return <LandingPage setPage={setCurrentPage} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%)'
      }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cap-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-cap-red selection:text-white" style={{
      background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%)'
    }}>
      {!['landing', 'login', 'signup'].includes(currentPage) && <Navbar activePage={currentPage} setPage={setCurrentPage} />}
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
