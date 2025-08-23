'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Building2, ArrowRight, Loader2, Check } from 'lucide-react';

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Save organization to localStorage
      const organization = {
        name: orgName,
        address: address,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('organization', JSON.stringify(organization));
      
      // Initialize empty data structures
      localStorage.setItem('states', JSON.stringify([]));
      localStorage.setItem('providers', JSON.stringify([]));
      localStorage.setItem('services', JSON.stringify([]));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to setup organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            O
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to OhanaDoc!
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Let&apos;s set up your organization
          </p>
        </div>

        <form onSubmit={handleSetup} className="space-y-6">
          <div>
            <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="OhanaDoc Healthcare Network"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Headquarters Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="1234 Healthcare Blvd, Suite 100&#10;Medical City, CA 90210"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Add states where you operate</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Onboard healthcare providers</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Configure services and pricing</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Monitor real-time analytics</span>
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || !orgName.trim() || !address.trim()}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Complete Setup
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}