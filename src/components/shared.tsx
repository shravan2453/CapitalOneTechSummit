import React from 'react';
import Icon from './Icon';

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = "", noPadding = false, highlight = false, onClick }) => {
  // Check if className contains background override
  const hasBgOverride = className.includes('bg-') || className.includes('!bg-');
  const baseClasses = hasBgOverride 
    ? `rounded-2xl border-2 border-cap-red/20 shadow-3d transition-all duration-300 hover:shadow-3d-hover relative overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`
    : `rounded-2xl border-2 border-cap-red/20 shadow-3d transition-all duration-300 hover:shadow-3d-hover relative overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`;
  
  const cardGradient = 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)';
  const cardShadow = 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 4px 8px rgba(200, 16, 46, 0.15), 0 0 0 1px rgba(200, 16, 46, 0.1)';
  const cardShadowHover = 'inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(200, 16, 46, 0.3), 0 6px 12px rgba(200, 16, 46, 0.25), 0 0 0 2px rgba(200, 16, 46, 0.15)';
  
  return (
    <div 
      className={`${baseClasses} ${onClick ? 'cursor-pointer' : ''}`} 
      style={{
        background: hasBgOverride ? undefined : cardGradient,
        boxShadow: cardShadow
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!hasBgOverride) {
          e.currentTarget.style.boxShadow = cardShadowHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!hasBgOverride) {
          e.currentTarget.style.boxShadow = cardShadow;
        }
      }}
    >
      {highlight && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cap-red via-cap-redLight to-cap-red z-10" style={{
          boxShadow: '0 2px 4px rgba(200, 16, 46, 0.3)'
        }}></div>
      )}
      {children}
    </div>
  );
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'navy' | 'ghost';
  className?: string;
  onClick?: () => void;
  icon?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = "primary", 
  className = "", 
  onClick, 
  icon, 
  fullWidth = false,
  type = "button",
  disabled = false
}) => {
  const base = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] relative";
  const variants = {
    primary: "text-white border-2 border-cap-red/30",
    secondary: "text-cap-red border-2 border-cap-red/30",
    navy: "text-white border-2 border-cap-navy/30",
    ghost: "text-gray-700 hover:text-cap-red hover:bg-gray-100 border border-transparent hover:border-cap-red/20"
  };
  
  const buttonGradients = {
    primary: {
      normal: 'linear-gradient(145deg, #C8102E 0%, #E0112F 50%, #a30d25 100%)',
      hover: 'linear-gradient(145deg, #E0112F 0%, #C8102E 50%, #8B0A1F 100%)',
      shadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(163, 13, 37, 0.5), 0 4px 8px rgba(200, 16, 46, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      shadowHover: 'inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(163, 13, 37, 0.4), 0 6px 12px rgba(200, 16, 46, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.15)'
    },
    secondary: {
      normal: 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
      hover: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #E5E7EB 100%)',
      shadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 4px 8px rgba(200, 16, 46, 0.15), 0 0 0 1px rgba(200, 16, 46, 0.1)',
      shadowHover: 'inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(200, 16, 46, 0.3), 0 6px 12px rgba(200, 16, 46, 0.25), 0 0 0 2px rgba(200, 16, 46, 0.15)'
    },
    navy: {
      normal: 'linear-gradient(145deg, #003087 0%, #0044AA 50%, #001F5C 100%)',
      hover: 'linear-gradient(145deg, #0044AA 0%, #003087 50%, #001A4D 100%)',
      shadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 31, 92, 0.5), 0 4px 8px rgba(0, 48, 135, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      shadowHover: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 31, 92, 0.4), 0 6px 12px rgba(0, 48, 135, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.15)'
    },
    ghost: {
      normal: 'transparent',
      hover: 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
      shadow: 'none',
      shadowHover: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.1), 0 2px 4px rgba(200, 16, 46, 0.1)'
    }
  };

  const style = buttonGradients[variant] || buttonGradients.ghost;

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{
        background: style.normal,
        boxShadow: style.shadow
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = style.hover;
          e.currentTarget.style.boxShadow = style.shadowHover;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = style.normal;
        e.currentTarget.style.boxShadow = style.shadow;
      }}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
};

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  color?: "blue" | "navy" | "red" | "green" | "amber";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = "blue", className = "" }) => {
  const colors = {
    blue: "text-cap-navy border-2 border-cap-navy/30",
    navy: "text-cap-navy border-2 border-cap-navy/40",
    red: "text-cap-red border-2 border-cap-red/30",
    green: "text-green-700 border-2 border-green-300/30",
    amber: "text-amber-700 border-2 border-amber-300/30"
  };
  
  const badgeGradient = 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)';
  const badgeShadow = 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)';
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colors[color]} ${className}`}
      style={{
        background: badgeGradient,
        boxShadow: badgeShadow
      }}
    >
      {children}
    </span>
  );
};

// PageHeader Component
interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div 
    className="pt-8 sm:pt-10 pb-12 sm:pb-14 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b-2 border-cap-red/20"
    style={{
      background: 'linear-gradient(135deg, #C8102E 0%, #E0112F 50%, #C8102E 100%)',
      boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), 0 4px 8px rgba(200, 16, 46, 0.3)'
    }}
  >
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 break-words">{title}</h1>
        <p className="text-sm sm:text-base text-red-100 max-w-2xl break-words">{subtitle}</p>
      </div>
      {action && <div className="w-full md:w-auto shrink-0">{action}</div>}
    </div>
  </div>
);
