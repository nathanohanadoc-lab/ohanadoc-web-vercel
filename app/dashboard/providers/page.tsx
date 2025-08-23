'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Calendar,
  DollarSign,
  Star,
  Clock,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  state: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  patients: number;
  revenue: number;
  rating: number;
  startDate: string;
  lastActivity: string;
  credentials: {
    licenseStatus: 'active' | 'expired' | 'pending';
    boardCertified: boolean;
    deaStatus: 'active' | 'expired' | 'pending';
  };
  payroll: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    lastPayment: string;
    ytdEarnings: number;
  };
}

// Specialty options
const specialties = [
  'Primary Care',
  'Internal Medicine',
  'Pediatrics',
  'Cardiology',
  'Dermatology',
  'Psychiatry',
  'Orthopedics',
  'Neurology',
  'Emergency Medicine',
  'Family Medicine'
];

// Mock data generator
const generateMockProviders = (): Provider[] => {
  const states = ['Florida', 'Texas', 'California', 'New York', 'Washington'];
  const firstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'Robert', 'Emily', 'James'];
  const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore'];
  
  return Array.from({ length: 12 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `Dr. ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    specialty: specialties[i % specialties.length],
    state: states[i % states.length],
    email: `dr.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
    phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    status: i % 3 === 0 ? 'inactive' : i % 5 === 0 ? 'pending' : 'active',
    patients: Math.floor(Math.random() * 150) + 50,
    revenue: Math.floor(Math.random() * 50000) + 25000,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3).toISOString(),
    lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    credentials: {
      licenseStatus: i % 4 === 0 ? 'expired' : i % 7 === 0 ? 'pending' : 'active',
      boardCertified: i % 3 !== 0,
      deaStatus: i % 5 === 0 ? 'expired' : i % 8 === 0 ? 'pending' : 'active'
    },
    payroll: {
      frequency: i % 3 === 0 ? 'weekly' : i % 2 === 0 ? 'biweekly' : 'monthly',
      lastPayment: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      ytdEarnings: Math.floor(Math.random() * 200000) + 100000
    }
  }));
};

export default function ProvidersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, searchTerm, selectedState, selectedSpecialty, selectedStatus]);

  const loadProviders = () => {
    const savedProviders = localStorage.getItem('providers');
    if (savedProviders) {
      setProviders(JSON.parse(savedProviders));
    } else {
      // Initialize with mock data
      const mockProviders = generateMockProviders();
      setProviders(mockProviders);
      localStorage.setItem('providers', JSON.stringify(mockProviders));
    }
    setLoading(false);
  };

  const filterProviders = () => {
    let filtered = [...providers];

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter(p => p.state === selectedState);
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(p => p.specialty === selectedSpecialty);
    }

    if (selectedStatus) {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    setFilteredProviders(filtered);
  };

  const getStatusBadge = (status: Provider['status']) => {
    const variants = {
      active: { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircle },
      inactive: { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', icon: XCircle },
      pending: { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: AlertCircle }
    };
    
    const variant = variants[status];
    const Icon = variant.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variant.bg} ${variant.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCredentialStatus = (provider: Provider) => {
    const { licenseStatus, deaStatus } = provider.credentials;
    if (licenseStatus === 'expired' || deaStatus === 'expired') {
      return { color: 'text-red-600', icon: AlertCircle, text: 'Credentials Expired' };
    }
    if (licenseStatus === 'pending' || deaStatus === 'pending') {
      return { color: 'text-yellow-600', icon: Clock, text: 'Credentials Pending' };
    }
    return { color: 'text-green-600', icon: CheckCircle, text: 'Credentials Active' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return formatDate(dateString);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Providers
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your healthcare provider network
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Provider
        </button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">All States</option>
            <option value="Florida">Florida</option>
            <option value="Texas">Texas</option>
            <option value="California">California</option>
            <option value="New York">New York</option>
            <option value="Washington">Washington</option>
          </select>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">All Specialties</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </Card>

      {/* Provider Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{providers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {providers.filter(p => p.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {(providers.reduce((acc, p) => acc + p.rating, 0) / providers.length).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(providers.reduce((acc, p) => acc + p.revenue, 0))}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </Card>
      </div>

      {/* Providers Grid */}
      {filteredProviders.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No providers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || selectedState || selectedSpecialty || selectedStatus
              ? 'Try adjusting your filters'
              : 'Start by adding your first provider'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((provider) => {
            const credStatus = getCredentialStatus(provider);
            const CredIcon = credStatus.icon;
            
            return (
              <Card key={provider.id} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(provider.status)}
                </div>

                <Link href={`/dashboard/providers/${provider.id}`}>
                  <div className="cursor-pointer">
                    {/* Provider Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {provider.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {provider.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {provider.specialty}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {provider.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400 truncate">
                          {provider.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {provider.phone}
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {provider.patients}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Patients</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(provider.revenue)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {provider.rating}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                      </div>
                    </div>

                    {/* Credentials Status */}
                    <div className={`flex items-center gap-2 text-sm ${credStatus.color} mb-4`}>
                      <CredIcon className="w-4 h-4" />
                      <span>{credStatus.text}</span>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Joined {formatDate(provider.startDate)}</span>
                      <span>Active {getTimeAgo(provider.lastActivity)}</span>
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}