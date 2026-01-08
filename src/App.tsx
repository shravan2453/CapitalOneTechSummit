import React, { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { userService } from './services/userService';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ComparisonPage from './pages/ComparisonPage';
import CalculatorPage from './pages/CalculatorPage';
import OptimizerPage from './pages/OptimizerPage';
import ProfilePage from './pages/ProfilePage';
import MyLoansPage from './pages/MyLoansPage';
// import LoansForm from './pages/LoansForm'; // From loans-page branch
import './styles/globals.css';

const AppContent: React.FC = () => {
  // Current page state for navigation
  const [currentPage, setCurrentPage] = useState<string>('landing');
  
  const { user, loading } = useAuth();
  
  const [checkingProfile, setCheckingProfile] = useState(false);
  const hasCheckedProfileRef = useRef(false);
  const previousUserRef = useRef<User | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.email) {
        hasCheckedProfileRef.current = false;
        return;
      }
      
      // Only check once per user session to avoid unnecessary API calls
      if (hasCheckedProfileRef.current) {
        return;
      }
      
      setCheckingProfile(true);
      hasCheckedProfileRef.current = true;
      
      try {
        await userService.getUserByEmail(user.email);
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setCheckingProfile(false);
      }
    };

    // Only check profile when auth is loaded and user is logged in
    if (!loading && user) {
      const isNewLogin = !previousUserRef.current && user;
      previousUserRef.current = user;
      
      if (isNewLogin) {
        setTimeout(() => {
          hasCheckedProfileRef.current = false;
          checkProfile();
        }, 500);
        return;
      }
      
      checkProfile();
    } else if (!loading && !user) {
      hasCheckedProfileRef.current = false;
      previousUserRef.current = null;
    }
  }, [user, loading]);

  useEffect(() => {
    const handleProfileUpdate = async () => {
      if (!user?.email) return;
      
      setCheckingProfile(true);
      try {
        // Small delay to ensure database has committed the changes
        await new Promise(resolve => setTimeout(resolve, 300));
        await userService.getUserByEmail(user.email);
        hasCheckedProfileRef.current = false;
      } catch (error) {
        console.error('Error checking profile after update:', error);
      } finally {
        setCheckingProfile(false);
      }
    };

    // Listen for custom event dispatched from ProfilePage when profile is saved
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user]);

  // Redirect authenticated users from landing/login/signup to dashboard
  useEffect(() => {
    if (!loading && user && ['landing', 'login', 'signup'].includes(currentPage)) {
      setCurrentPage('dashboard');
    }
  }, [user, loading, currentPage]);

  // Redirect to login if user tries to access protected routes without authentication
  useEffect(() => {
    if (!loading && !user && ['dashboard', 'comparison', 'calculator', 'optimizer', 'profile', 'my-loans'].includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [user, loading, currentPage]);

  // Handle OAuth callback: redirect to dashboard after successful OAuth login
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // If user just signed in via OAuth and is on login page, go to dashboard
      // Profile check effect will redirect to profile if incomplete
      if (session && currentPage === 'login') {
        setCurrentPage('dashboard');
      }
    };
    handleOAuthCallback();
  }, [currentPage]);

  // Render the appropriate page component based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setPage={setCurrentPage} />;
      case 'login':
        return <LoginPage setPage={setCurrentPage} />;
      case 'signup':
        return <SignupPage setPage={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage setPage={setCurrentPage} />;
      case 'comparison':
        return <ComparisonPage setPage={setCurrentPage} />;
      case 'calculator':
        return <CalculatorPage />;
      case 'optimizer':
        return <OptimizerPage />;
      case 'profile':
        return <ProfilePage />;
      case 'my-loans':
        return <MyLoansPage />;
      // case 'loanform':
      //   return <LoansForm /> // From loans-page branch
      default:
        return <LandingPage setPage={setCurrentPage} />;
    }
  };

  // Show loading spinner while checking authentication or profile completion
  if (loading || checkingProfile) {
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

