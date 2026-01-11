import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/shared';

interface SignupPageProps {
  setPage: (page: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ setPage }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signUp(email, password, firstName, lastName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Redirect to profile after successful signup (user needs to complete profile first)
      setTimeout(() => {
        setPage('profile');
      }, 2000);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // Note: Google OAuth will redirect, so we don't need to handle success here
  };

  if (success) {
    return (
      <div 
        className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 relative"
        style={{
          background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%)'
        }}
      >
        <div 
          className="absolute inset-x-0 top-0 h-64"
          style={{
            background: 'linear-gradient(135deg, #003087 0%, #0044AA 40%, #C8102E 100%)'
          }}
        ></div>
        
        <div 
          className="w-full max-w-md rounded-2xl border border-cap-red/20 p-8 relative z-10 text-center"
          style={{
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 8px 16px rgba(200, 16, 46, 0.2)'
          }}
        >
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-600 mb-4">Redirecting to complete your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 relative"
      style={{
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 50%, #E5E7EB 100%)'
      }}
    >
      <div 
        className="absolute inset-x-0 top-0 h-64"
        style={{
          background: 'linear-gradient(135deg, #003087 0%, #0044AA 40%, #C8102E 100%)'
        }}
      ></div>
      
      <div 
        className="w-full max-w-md rounded-2xl border border-cap-red/20 p-8 relative z-10"
        style={{
          background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
          boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 8px 16px rgba(200, 16, 46, 0.2)'
        }}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
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
                className="font-bold text-2xl leading-none text-cap-red"
                style={{
                  fontFamily: 'sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                ONE
              </span>
              <span 
                className="text-sm font-medium text-gray-600 leading-none mt-0.5"
                style={{
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.01em'
                }}
              >
                LOAN
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-600 mt-2">Start optimizing your loans today</p>
        </div>

        {error && (
          <div 
            className="mb-4 p-3 rounded-lg text-sm text-cap-red border border-cap-red/20"
            style={{
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
              boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(200, 16, 46, 0.1)'
            }}
          >
            {error}
          </div>
        )}

        {/* Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-cap-red/20 rounded-xl font-semibold text-gray-900 transition-all hover:border-cap-red/40 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          style={{
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 4px 8px rgba(200, 16, 46, 0.15)'
          }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {googleLoading ? 'Signing up with Google...' : 'Continue with Google'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cap-red/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-600">Or create account with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                }}
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
                style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                }}
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
              style={{
                background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
              }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border-2 border-cap-red/20 rounded-xl focus:ring-2 focus:ring-cap-red/20 focus:border-cap-red/40 outline-none text-gray-900"
              style={{
                background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
              }}
              placeholder="Create a strong password"
            />
            <p className="text-xs text-gray-600 mt-1">Must be at least 6 characters</p>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            className="mt-6"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Free Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>
          <button 
            onClick={() => setPage('login')} 
            className="text-cap-red font-semibold hover:underline ml-1"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
