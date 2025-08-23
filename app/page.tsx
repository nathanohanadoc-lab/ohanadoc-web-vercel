'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';

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
  const router = useRouter();

  useEffect(() => {
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers[email as keyof typeof mockUsers];
    if (user && user.password === password) {
      setShowOTP(true);
      // In production, this would send OTP via email
      console.log('OTP: 123456'); // For demo purposes
    } else {
      setError('Invalid email or password');
    }
    
    setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center p-4">
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
    <div className="min-h-screen flex items-center justify-center p-4">
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

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Demo credentials:
          </p>
          <p className="text-sm font-mono text-gray-700 dark:text-gray-300 mt-1">
            admin@ohanadoc.com / admin123
          </p>
        </div>
      </Card>
    </div>
  );
}

