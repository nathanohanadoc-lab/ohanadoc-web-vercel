'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import {
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Building2,
  Briefcase,
  Plus,
  ArrowRight,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalRevenue: number;
  activeProviders: number;
  states: number;
  services: number;
  monthlyGrowth: number;
  patientVolume: number;
}

export default function DashboardPage() {
  const ws = useWebSocketContext();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeProviders: 0,
    states: 0,
    services: 0,
    monthlyGrowth: 0,
    patientVolume: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    const organization = localStorage.getItem('organization');

    if (!user || !organization) {
      router.push('/');
      return;
    }

    // Load dashboard stats
    loadDashboardStats();

    // Subscribe to real-time stats updates
    const unsubscribeStats = ws.subscribe('dashboard:stats', (data) => {
      setStats(prevStats => ({
        ...prevStats,
        ...data
      }));
    });

    const unsubscribeRevenue = ws.subscribe('revenue:update', (data) => {
      setStats(prevStats => ({
        ...prevStats,
        totalRevenue: data.totalRevenue || prevStats.totalRevenue,
        monthlyGrowth: data.monthlyGrowth || prevStats.monthlyGrowth
      }));
    });

    const unsubscribeProvider = ws.subscribe('provider:count', (data) => {
      setStats(prevStats => ({
        ...prevStats,
        activeProviders: data.count || prevStats.activeProviders
      }));
    });

    return () => {
      unsubscribeStats();
      unsubscribeRevenue();
      unsubscribeProvider();
    };
  }, [router, ws]);

  const loadDashboardStats = async () => {
    try {
      // For now, use mock data - in production, this would fetch from API
      const mockStats: DashboardStats = {
        totalRevenue: 1875420,
        activeProviders: 47,
        states: 5,
        services: 12,
        monthlyGrowth: 12.5,
        patientVolume: 3240
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to OhanaDoc
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor your healthcare network performance and manage operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-green-600 dark:text-green-400 font-medium">
                +{stats.monthlyGrowth}%
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                vs last month
              </span>
            </div>
          </div>
        </Card>

        {/* Active Providers */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Providers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.activeProviders}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <Link 
              href="/dashboard/providers"
              className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all providers
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </Card>

        {/* States Coverage */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  States
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.states}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <Link 
              href="/dashboard/states"
              className="mt-4 flex items-center text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Manage states
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </Card>

        {/* Patient Volume */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Patient Volume
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatNumber(stats.patientVolume)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              This month
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            className="cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            onClick={() => router.push('/dashboard/states')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Add New State
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expand your network coverage
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
            onClick={() => router.push('/dashboard/providers')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Onboard Provider
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add healthcare professionals
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors"
            onClick={() => router.push('/dashboard/analytics')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  View Analytics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Performance insights
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <Card>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New provider onboarded
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dr. Sarah Johnson joined the network in Florida
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                2 hours ago
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Revenue milestone reached
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monthly revenue exceeded $1.8M
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                5 hours ago
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New state added
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Texas network is now operational
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                1 day ago
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}