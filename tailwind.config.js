/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Capital One Brand Colors
        'cap-red': '#C8102E',
        'cap-redHover': '#a30d25',
        'cap-redDark': '#8B0A1F',
        'cap-redLight': '#E0112F',
        'cap-navy': '#003087',
        'cap-navyDark': '#001F5C',
        'cap-navyLight': '#0044AA',
      },
      spacing: {
        '18': '4.5rem',
      },
      backgroundImage: {
        'capital-gradient': 'linear-gradient(135deg, #C8102E 0%, #E0112F 50%, #C8102E 100%)',
        'card-gradient-3d': 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
        'button-gradient-primary': 'linear-gradient(145deg, #C8102E 0%, #E0112F 50%, #a30d25 100%)',
        'button-gradient-secondary': 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
        'nav-gradient': 'linear-gradient(135deg, #003087 0%, #0044AA 50%, #001F5C 100%)',
      },
      boxShadow: {
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
        'float': '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
        'outline-black': '0 0 0 2px #000000',
        'outline-white': '0 0 0 2px #FFFFFF',
        '3d': 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 4px 8px rgba(200, 16, 46, 0.15), 0 0 0 1px rgba(200, 16, 46, 0.1)',
        '3d-hover': 'inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(200, 16, 46, 0.3), 0 6px 12px rgba(200, 16, 46, 0.25), 0 0 0 2px rgba(200, 16, 46, 0.15)',
        '3d-button': 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(163, 13, 37, 0.5), 0 4px 8px rgba(200, 16, 46, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        '3d-button-hover': 'inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(163, 13, 37, 0.4), 0 6px 12px rgba(200, 16, 46, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.15)',
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'enter': 'enter 0.4s ease-out',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
