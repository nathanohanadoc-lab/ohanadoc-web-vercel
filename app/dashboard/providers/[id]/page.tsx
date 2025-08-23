'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Users, 
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Edit,
  Download,
  TrendingUp,
  Award,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Save,
  X
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  state: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'pending';
  patients: number;
  revenue: number;
  rating: number;
  startDate: string;
  lastActivity: string;
  bio?: string;
  npi?: string;
  taxId?: string;
  credentials: {
    licenseNumber: string;
    licenseState: string;
    licenseStatus: 'active' | 'expired' | 'pending';
    licenseExpiry: string;
    boardCertified: boolean;
    boardName?: string;
    boardExpiry?: string;
    deaNumber?: string;
    deaStatus: 'active' | 'expired' | 'pending';
    deaExpiry?: string;
    malpracticeInsurance: boolean;
    malpracticeExpiry?: string;
    customCredentials?: Array<{
      id: string;
      name: string;
      number: string;
      expiry: string;
      status: 'active' | 'expired' | 'pending';
    }>;
  };
  payroll: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    rate: number;
    rateType: 'hourly' | 'salary' | 'per-visit';
    lastPayment: string;
    nextPayment: string;
    ytdEarnings: number;
    bonusEligible: boolean;
    bonusPercentage?: number;
    directDeposit: boolean;
    bankName?: string;
    accountLast4?: string;
    payrollHistory?: Array<{
      id: string;
      date: string;
      amount: number;
      type: 'regular' | 'bonus' | 'reimbursement';
      status: 'paid' | 'pending' | 'processing';
    }>;
  };
  economicData?: {
    patientVolume: number;
    avgRevenuePerPatient: number;
    avgVisitDuration: number;
    noShowRate: number;
    patientSatisfaction: number;
    referralRate: number;
    monthlyMetrics?: Array<{
      month: string;
      revenue: number;
      patients: number;
      visits: number;
    }>;
  };
}

type TabType = 'overview' | 'payroll' | 'credentials' | 'economic';

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Provider>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProvider();
  }, [params.id]);

  const loadProvider = () => {
    const providers = JSON.parse(localStorage.getItem('providers') || '[]');
    const currentProvider = providers.find((p: Provider) => p.id === params.id);
    
    if (currentProvider) {
      // Enhance with additional mock data if needed
      const enhanced = {
        ...currentProvider,
        address: currentProvider.address || '123 Medical Center Dr, Suite 100',
        npi: currentProvider.npi || '1234567890',
        taxId: currentProvider.taxId || 'XX-XXXXXXX',
        bio: currentProvider.bio || 'Dedicated healthcare professional with years of experience.',
        credentials: {
          ...currentProvider.credentials,
          licenseNumber: currentProvider.credentials.licenseNumber || 'MD123456',
          licenseState: currentProvider.state,
          licenseExpiry: currentProvider.credentials.licenseExpiry || '2025-12-31',
          boardName: currentProvider.credentials.boardName || 'American Board of ' + currentProvider.specialty,
          boardExpiry: currentProvider.credentials.boardExpiry || '2026-06-30',
          deaNumber: currentProvider.credentials.deaNumber || 'BJ1234567',
          deaExpiry: currentProvider.credentials.deaExpiry || '2025-06-30',
          malpracticeInsurance: true,
          malpracticeExpiry: currentProvider.credentials.malpracticeExpiry || '2024-12-31',
          customCredentials: currentProvider.credentials.customCredentials || []
        },
        payroll: {
          ...currentProvider.payroll,
          rate: currentProvider.payroll.rate || 150,
          rateType: currentProvider.payroll.rateType || 'hourly',
          nextPayment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          bonusEligible: true,
          bonusPercentage: 10,
          directDeposit: true,
          bankName: 'Chase Bank',
          accountLast4: '4321',
          payrollHistory: generatePayrollHistory()
        },
        economicData: {
          patientVolume: currentProvider.patients,
          avgRevenuePerPatient: Math.round(currentProvider.revenue / currentProvider.patients),
          avgVisitDuration: 30,
          noShowRate: 5.2,
          patientSatisfaction: 4.8,
          referralRate: 22.5,
          monthlyMetrics: generateMonthlyMetrics()
        }
      };
      
      setProvider(enhanced);
      setEditForm(enhanced);
    }
    
    setLoading(false);
  };

  const generatePayrollHistory = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `pay-${i}`,
      date: new Date(Date.now() - i * 14 * 24 * 60 * 60 * 1000).toISOString(),
      amount: Math.floor(Math.random() * 2000) + 4000,
      type: i % 6 === 0 ? 'bonus' : 'regular' as 'regular' | 'bonus',
      status: i === 0 ? 'processing' : 'paid' as 'paid' | 'processing'
    }));
  };

  const generateMonthlyMetrics = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 20000) + 30000,
      patients: Math.floor(Math.random() * 50) + 100,
      visits: Math.floor(Math.random() * 100) + 150
    }));
  };

  const handleSave = () => {
    if (!provider) return;
    
    const providers = JSON.parse(localStorage.getItem('providers') || '[]');
    const index = providers.findIndex((p: Provider) => p.id === provider.id);
    
    if (index !== -1) {
      providers[index] = { ...provider, ...editForm };
      localStorage.setItem('providers', JSON.stringify(providers));
      setProvider({ ...provider, ...editForm });
    }
    
    setIsEditing(false);
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
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${variant.bg} ${variant.color}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCredentialStatusBadge = (status: 'active' | 'expired' | 'pending') => {
    const variants = {
      active: { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
      expired: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
      pending: { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' }
    };
    
    const variant = variants[status];
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variant.bg} ${variant.color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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

  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Provider not found
        </h3>
        <Link
          href="/dashboard/providers"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to Providers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/providers"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
              {provider.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {provider.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {provider.specialty} • {provider.state}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(provider.status)}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Edit className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Patients
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {provider.patients}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                  {formatCurrency(provider.revenue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Rating
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {provider.rating}
                  </p>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  YTD Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(provider.payroll.ytdEarnings)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="flex gap-8">
          {(['overview', 'payroll', 'credentials', 'economic'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {tab === 'economic' ? 'Economic Data' : tab}
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
          {/* Contact Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{provider.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{provider.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-900 dark:text-white">{provider.address}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Professional Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Professional Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">NPI Number</span>
                <span className="font-medium text-gray-900 dark:text-white">{provider.npi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax ID</span>
                <span className="font-medium text-gray-900 dark:text-white">{provider.taxId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(provider.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Activity</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(provider.lastActivity)}</span>
              </div>
            </div>
          </Card>

          {/* Bio */}
          <Card className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Biography
            </h3>
            {isEditing ? (
              <textarea
                value={editForm.bio || ''}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter provider biography..."
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                {provider.bio}
              </p>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Payroll Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payroll Settings
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pay Frequency</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {provider.payroll.frequency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rate</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(provider.payroll.rate)} / {provider.payroll.rateType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Payment</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(provider.payroll.nextPayment)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bonus</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {provider.payroll.bonusEligible ? `${provider.payroll.bonusPercentage}% eligible` : 'Not eligible'}
                </p>
              </div>
            </div>
          </Card>

          {/* Direct Deposit */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Direct Deposit
            </h3>
            {provider.payroll.directDeposit ? (
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {provider.payroll.bankName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Account ending in ****{provider.payroll.accountLast4}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Direct deposit not set up
              </p>
            )}
          </Card>

          {/* Payroll History */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payroll History
              </h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Download All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left py-3">Date</th>
                    <th className="text-left py-3">Type</th>
                    <th className="text-right py-3">Amount</th>
                    <th className="text-right py-3">Status</th>
                    <th className="text-right py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {provider.payroll.payrollHistory?.slice(0, 6).map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-3">
                        <span className="text-gray-900 dark:text-white">
                          {formatDate(payment.date)}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="capitalize text-gray-700 dark:text-gray-300">
                          {payment.type}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          payment.status === 'paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : payment.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'credentials' && (
        <div className="space-y-6">
          {/* License Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Medical License
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">License Number</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {provider.credentials.licenseNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">State</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {provider.credentials.licenseState}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                {getCredentialStatusBadge(provider.credentials.licenseStatus)}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expiry Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(provider.credentials.licenseExpiry)}
                  {calculateDaysUntilExpiry(provider.credentials.licenseExpiry) < 90 && (
                    <span className="text-yellow-600 text-sm ml-2">
                      (Expires in {calculateDaysUntilExpiry(provider.credentials.licenseExpiry)} days)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Board Certification */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Board Certification
            </h3>
            {provider.credentials.boardCertified ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Board Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {provider.credentials.boardName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expiry Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(provider.credentials.boardExpiry || '')}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Not board certified
              </p>
            )}
          </Card>

          {/* DEA Registration */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              DEA Registration
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">DEA Number</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {provider.credentials.deaNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                {getCredentialStatusBadge(provider.credentials.deaStatus)}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expiry Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(provider.credentials.deaExpiry || '')}
                </p>
              </div>
            </div>
          </Card>

          {/* Malpractice Insurance */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Malpractice Insurance
            </h3>
            {provider.credentials.malpracticeInsurance ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Active Coverage
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expires: {formatDate(provider.credentials.malpracticeExpiry || '')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <span>No active coverage</span>
              </div>
            )}
          </Card>

          {/* Custom Credentials */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Additional Credentials
              </h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Add Credential
              </button>
            </div>
            {provider.credentials.customCredentials && provider.credentials.customCredentials.length > 0 ? (
              <div className="space-y-3">
                {provider.credentials.customCredentials.map((cred) => (
                  <div key={cred.id} className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {cred.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          #{cred.number}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getCredentialStatusBadge(cred.status)}
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No additional credentials added
              </p>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'economic' && provider.economicData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Avg Revenue Per Patient
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(provider.economicData.avgRevenuePerPatient)}
              </p>
            </Card>
            
            <Card>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Patient Satisfaction
              </h4>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {provider.economicData.patientSatisfaction}
                </p>
              </div>
            </Card>
            
            <Card>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Referral Rate
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {provider.economicData.referralRate}%
              </p>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Metrics
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Average Visit Duration
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {provider.economicData.avgVisitDuration} minutes
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  No-Show Rate
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {provider.economicData.noShowRate}%
                </p>
              </div>
            </div>
          </Card>

          {/* Monthly Trends */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Trends
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left py-3">Month</th>
                    <th className="text-right py-3">Revenue</th>
                    <th className="text-right py-3">Patients</th>
                    <th className="text-right py-3">Visits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {provider.economicData.monthlyMetrics?.map((metric) => (
                    <tr key={metric.month}>
                      <td className="py-3 font-medium text-gray-900 dark:text-white">
                        {metric.month}
                      </td>
                      <td className="py-3 text-right text-gray-900 dark:text-white">
                        {formatCurrency(metric.revenue)}
                      </td>
                      <td className="py-3 text-right text-gray-900 dark:text-white">
                        {metric.patients}
                      </td>
                      <td className="py-3 text-right text-gray-900 dark:text-white">
                        {metric.visits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}