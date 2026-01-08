import React, { useState, useEffect, useRef } from 'react';
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
import './styles/globals.css';

const AppContent: React.FC = () => {
  // Current page state for navigation
  const [currentPage, setCurrentPage] = useState<string>('landing');
  
  // Authentication state from context
  const { user, loading } = useAuth();
  
  // Loading state for profile completion check
  const [checkingProfile, setCheckingProfile] = useState(false);
  
  // Refs to prevent multiple redirects and profile checks
  const hasRedirectedRef = useRef(false); // Tracks if user has been redirected to profile page
  const hasCheckedProfileRef = useRef(false); // Tracks if profile has been checked for current user session


  // Check profile completion on user login
  // Redirects to profile page if profile is incomplete and user tries to access protected pages
  useEffect(() => {
    const checkProfile = async () => {
      // Reset refs if no user is logged in
      if (!user?.email) {
        hasRedirectedRef.current = false;
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
        // Fetch user profile and check if it's complete
        const userRecord = await userService.getUserByEmail(user.email);
        const complete = userService.isProfileComplete(userRecord);
        
        // Redirect to profile if incomplete and user is on a protected page
        if (!complete && !hasRedirectedRef.current) {
          const protectedPages = ['dashboard', 'comparison', 'calculator', 'optimizer', 'my-loans'];
          setCurrentPage(prevPage => {
            if (protectedPages.includes(prevPage)) {
              hasRedirectedRef.current = true;
              return 'profile';
            }
            return prevPage;
          });
        }
        
        // Reset redirect flag if profile is complete to allow nav
        if (complete) {
          hasRedirectedRef.current = false;
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        // On error, redirect to profile if on protected page
        if (!hasRedirectedRef.current) {
          setCurrentPage(prevPage => {
            const protectedPages = ['dashboard', 'comparison', 'calculator', 'optimizer', 'my-loans'];
            if (protectedPages.includes(prevPage)) {
              hasRedirectedRef.current = true;
              return 'profile';
            }
            return prevPage;
          });
        }
      } finally {
        setCheckingProfile(false);
      }
    };

    // Only check profile when auth is loaded and user is logged in
    if (!loading && user) {
      checkProfile();
    } else if (!loading && !user) {
      // Reset refs when user logs out
      hasRedirectedRef.current = false;
      hasCheckedProfileRef.current = false;
    }
  }, [user, loading]);

  // Listen for profile updates when user saves their profile
  // Re-checks profile completion and allows navigation if profile is now complete
  useEffect(() => {
    const handleProfileUpdate = async () => {
      if (!user?.email) return;
      
      setCheckingProfile(true);
      try {
        // Small delay to ensure database has committed the changes
        await new Promise(resolve => setTimeout(resolve, 300));
        const userRecord = await userService.getUserByEmail(user.email);
        const complete = userService.isProfileComplete(userRecord);
        
        // If profile is now complete, reset flags to allow navigation
        if (complete) {
          hasRedirectedRef.current = false;
          hasCheckedProfileRef.current = false;
        }
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

  // Main app layout
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

