'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Building2, ArrowRight, Loader2, Moon, Sun } from 'lucide-react';

// Mock users for demo
const mockUsers = {
  'admin@ohanadoc.com': { password: 'admin123', name: 'Admin User' },
  'demo@ohanadoc.com': { password: 'demo123', name: 'Demo User' }
};

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const router = useRouter();

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Check if already logged in
    const user = localStorage.getItem('user');
    const organization = localStorage.getItem('organization');
    
    if (user && organization) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Sign in attempt:', { email, password }); // Debug log

    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers[email as keyof typeof mockUsers];
      if (user && user.password === password) {
        setShowOTP(true);
        // In production, this would send OTP via email
        console.log('OTP: 123456'); // For demo purposes
      } else {
        setError('Invalid email or password. Use: admin@ohanadoc.com / admin123');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    }
    
    setLoading(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update both data-theme attribute and dark class
    const root = document.documentElement;
    root.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otp === '123456') {
      const user = mockUsers[email as keyof typeof mockUsers];
      localStorage.setItem('user', JSON.stringify({
        email,
        name: user?.name || 'User'
      }));
      
      // Check if organization setup is needed
      const organization = localStorage.getItem('organization');
      if (!organization) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('Invalid OTP. Please try again.');
    }
    
    setLoading(false);
  };

  if (showOTP) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
        
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              O
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Enter Verification Code
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We&apos;ve sent a 6-digit code to {email}
            </p>
          </div>

          <form onSubmit={handleOTPVerify} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="123456"
                maxLength={6}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Demo OTP: 123456
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowOTP(false)}
              className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Back to Sign In
            </button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
      
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            O
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to OhanaDoc
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to manage your healthcare network
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="admin@ohanadoc.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Demo Credentials:
              </p>
              <div className="space-y-1">
                <p className="text-sm font-mono text-blue-800 dark:text-blue-200">
                  Email: admin@ohanadoc.com
                </p>
                <p className="text-sm font-mono text-blue-800 dark:text-blue-200">
                  Password: admin123
                </p>
                <p className="text-sm font-mono text-blue-800 dark:text-blue-200">
                  OTP: 123456
                </p>
              </div>
            </div>
            
            {/* Quick bypass for development/testing */}
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('user', JSON.stringify({
                  email: 'admin@ohanadoc.com',
                  name: 'Admin User'
                }));
                localStorage.setItem('organization', JSON.stringify({
                  name: 'Demo Healthcare Network',
                  type: 'Multi-State Network'
                }));
                router.push('/dashboard');
              }}
              className="mt-4 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
            >
              Skip Login (Dev Mode)
            </button>
      </Card>
    </div>
  );
}

