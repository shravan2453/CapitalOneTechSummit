import React from 'react';
import { Landmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Icon from './Icon';

interface NavbarProps {
  activePage: string;
  setPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, setPage }) => {
  const { user, signOut } = useAuth();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'comparison', label: 'Loan Comparison', icon: 'scale' },
    { id: 'calculator', label: 'Calculator', icon: 'calculator' },
    { id: 'optimizer', label: 'Optimizer', icon: 'sparkles' },
    { id: 'my-loans', label: 'My Loans', icon: 'wallet' },
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setPage('landing');
  };

  return (
    <nav 
      className="sticky top-0 z-50 border-b-2 border-cap-navy/30"
      style={{
        background: 'linear-gradient(135deg, #003087 0%, #0044AA 50%, #001F5C 100%)',
        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.1), 0 4px 8px rgba(0, 48, 135, 0.3)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center gap-3 py-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{
                background: 'linear-gradient(145deg, #C8102E 0%, #E0112F 50%, #a30d25 100%)',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(163, 13, 37, 0.5), 0 2px 4px rgba(200, 16, 46, 0.3)'
              }}
            >
              <Landmark size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">LoanOS</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 text-white ${
                  activePage === item.id ? '' : 'hover:bg-white/10'
                }`}
                style={activePage === item.id ? {
                  background: 'linear-gradient(145deg, #C8102E 0%, #E0112F 50%, #a30d25 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(163, 13, 37, 0.5), 0 2px 4px rgba(200, 16, 46, 0.3)'
                } : {
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (activePage !== item.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePage !== item.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center gap-2 text-white text-sm">
                <span>{user.email}</span>
              </div>
            )}
            <div 
              className="h-9 w-9 rounded-full flex items-center justify-center text-white cursor-pointer"
              style={{
                background: 'linear-gradient(145deg, #C8102E 0%, #E0112F 50%, #a30d25 100%)',
                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(163, 13, 37, 0.5), 0 2px 4px rgba(200, 16, 46, 0.3)'
              }}
              onClick={handleSignOut}
              title="Sign Out"
            >
              <span className="font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
