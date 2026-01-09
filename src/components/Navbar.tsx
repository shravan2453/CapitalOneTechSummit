import React, { useState, useEffect, useRef } from 'react';
import { Landmark, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Icon from './Icon';

interface NavbarProps {
  activePage: string;
  setPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, setPage }) => {
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'comparison', label: 'Loan Comparison', icon: 'scale' },
    { id: 'calculator', label: 'Calculator', icon: 'calculator' },
    { id: 'optimizer', label: 'Optimizer', icon: 'sparkles' },
    { id: 'my-loans', label: 'My Loans', icon: 'wallet' },
    { id: 'education', label: 'Education', icon: 'book-open' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    await signOut();
    setPage('landing');
    setDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setPage('profile');
    setDropdownOpen(false);
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
          <div className="flex items-center gap-3 py-4 cursor-pointer" onClick={() => setPage('dashboard')}>
            {/* Red Crescent Shape */}
            <div 
              className="h-10 w-10 flex items-center justify-center"
              style={{
                position: 'relative'
              }}
            >
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 40 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M20 5 C 30 5, 35 10, 35 20 C 35 30, 30 35, 20 35" 
                  stroke="#C8102E" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Text */}
            <div className="flex flex-col">
              <span 
                className="font-bold text-2xl leading-none text-white"
                style={{
                  fontFamily: 'sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                ONE
              </span>
              <span 
                className="text-sm font-medium text-white/70 leading-none mt-0.5"
                style={{
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.01em'
                }}
              >
                LOAN
              </span>
            </div>
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
            <div className="relative" ref={dropdownRef}>
              <div 
                className="h-9 w-9 rounded-full flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-105"
                style={{
                  background: 'linear-gradient(145deg, #C8102E 0%, #E0112F 50%, #a30d25 100%)',
                  boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(163, 13, 37, 0.5), 0 2px 4px rgba(200, 16, 46, 0.3)'
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title="Account Menu"
              >
                <span className="font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              
              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-cap-red/20 shadow-lg z-50"
                  style={{
                    background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 4px 8px rgba(200, 16, 46, 0.2)'
                  }}
                >
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-cap-red/10 flex items-center gap-2 transition-colors"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-cap-red/10 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
