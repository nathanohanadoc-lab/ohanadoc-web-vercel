'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft,
  MapPin, 
  Users, 
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
  Building2,
  Briefcase,
  FileText,
  Download
} from 'lucide-react';

interface State {
  id: string;
  name: string;
  code: string;
  providers: number;
  revenue: number;
  patients: number;
  services: number;
  addedAt: string;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  state: string;
  status: 'active' | 'inactive';
  patients: number;
  revenue: number;
}

interface Service {
  id: string;
  name: string;
  state: string;
  price: number;
  providers: number;
}

// State configuration with colors
const stateConfig: Record<string, { color: string; gradient: string; bgClass: string }> = {
  florida: { 
    color: 'text-orange-600', 
    gradient: 'from-orange-400 to-red-500',
    bgClass: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
  },
  texas: { 
    color: 'text-blue-600', 
    gradient: 'from-blue-400 to-blue-600',
    bgClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
  },
  california: { 
    color: 'text-yellow-600', 
    gradient: 'from-yellow-400 to-orange-500',
    bgClass: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
  },
  newyork: { 
    color: 'text-purple-600', 
    gradient: 'from-purple-400 to-pink-500',
    bgClass: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
  },
  washington: { 
    color: 'text-green-600', 
    gradient: 'from-green-400 to-teal-500',
    bgClass: 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20'
  }
};

export default function StateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'services' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStateData();
  }, [params.id]);

  const loadStateData = () => {
    // Load state data
    const states = JSON.parse(localStorage.getItem('states') || '[]');
    const currentState = states.find((s: State) => s.id === params.id);
    
    if (currentState) {
      setState(currentState);
      
      // Load providers for this state
      const allProviders = JSON.parse(localStorage.getItem('providers') || '[]');
      const stateProviders = allProviders.filter((p: Provider) => 
        p.state === currentState.name
      );
      setProviders(stateProviders);
      
      // Load services for this state
      const allServices = JSON.parse(localStorage.getItem('services') || '[]');
      const stateServices = allServices.filter((s: Service) => 
        s.state === currentState.name
      );
      setServices(stateServices);
    }
    
    setLoading(false);
  };

  const getStateConfig = (stateName: string) => {
    const key = stateName.toLowerCase().replace(/\s+/g, '');
    return stateConfig[key] || { 
      color: 'text-gray-600', 
      gradient: 'from-gray-400 to-gray-600',
      bgClass: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20'
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generateReport = () => {
    console.log('Generating state report...');
    // In production, this would generate a PDF report
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          State not found
        </h3>
        <Link
          href="/dashboard/states"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to States
        </Link>
      </div>
    );
  }

  const config = getStateConfig(state.name);

  return (
    <div className="space-y-8">
      {/* Header with state-specific styling */}
      <div className={`-m-8 p-8 mb-8 ${config.bgClass}`}>
        <Link
          href="/dashboard/states"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to States
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
              {state.code}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {state.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Active since {new Date(state.addedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-20 rounded-full -mr-16 -mt-16`} />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Providers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {providers.length}
                </p>
              </div>
              <div className={`p-3 bg-gradient-to-br ${config.gradient} bg-opacity-10 rounded-xl`}>
                <Users className={`w-6 h-6 ${config.color}`} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(state.revenue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Patients
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {state.patients}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Services Offered
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {services.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="flex gap-8">
          {(['overview', 'providers', 'services', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href={`/dashboard/providers?state=${state.name}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium">Add Provider</span>
                </div>
                <Plus className="w-4 h-4 text-gray-400" />
              </Link>
              
              <Link
                href={`/dashboard/services?state=${state.name}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium">Add Service</span>
                </div>
                <Plus className="w-4 h-4 text-gray-400" />
              </Link>
              
              <button
                onClick={generateReport}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors w-full"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">Generate Report</span>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-600 dark:text-gray-400">
                  New provider onboarded 2 hours ago
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-gray-600 dark:text-gray-400">
                  Service pricing updated yesterday
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-gray-600 dark:text-gray-400">
                  Monthly report generated 3 days ago
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'providers' && (
        <div>
          {providers.length === 0 ? (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No providers in {state.name} yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start adding healthcare providers to this state
              </p>
              <Link
                href={`/dashboard/providers?state=${state.name}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Provider
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Provider list would go here */}
              <p className="text-gray-600 dark:text-gray-400">
                {providers.length} providers in {state.name}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div>
          {services.length === 0 ? (
            <Card className="text-center py-12">
              <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No services configured for {state.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add services offered in this state
              </p>
              <Link
                href={`/dashboard/services?state=${state.name}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Service
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Service list would go here */}
              <p className="text-gray-600 dark:text-gray-400">
                {services.length} services in {state.name}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {state.name} Analytics
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Analytics dashboard for {state.name} coming soon...
          </p>
        </Card>
      )}
    </div>
  );
}