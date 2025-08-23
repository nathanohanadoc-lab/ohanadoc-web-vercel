'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Building2, 
  Edit2, 
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  foundedDate?: string;
  description?: string;
  createdAt: string;
}

interface OrgStats {
  totalStates: number;
  totalProviders: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export default function OrganizationPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [stats, setStats] = useState<OrgStats>({
    totalStates: 0,
    totalProviders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Organization>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganization();
    loadStats();
  }, []);

  const loadOrganization = () => {
    const savedOrg = localStorage.getItem('organization');
    if (savedOrg) {
      const org = JSON.parse(savedOrg);
      setOrganization(org);
      setEditForm(org);
    }
    setLoading(false);
  };

  const loadStats = () => {
    // Calculate stats from localStorage data
    const states = JSON.parse(localStorage.getItem('states') || '[]');
    const providers = JSON.parse(localStorage.getItem('providers') || '[]');
    
    let totalRevenue = 0;
    states.forEach((state: any) => {
      totalRevenue += state.revenue || 0;
    });

    setStats({
      totalStates: states.length,
      totalProviders: providers.length,
      totalRevenue,
      monthlyGrowth: 12.5 // Mock growth rate
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(organization || {});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(organization || {});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedOrg = {
      ...organization,
      ...editForm,
      id: organization?.id || Date.now().toString(),
      createdAt: organization?.createdAt || new Date().toISOString()
    } as Organization;

    setOrganization(updatedOrg);
    localStorage.setItem('organization', JSON.stringify(updatedOrg));
    setIsEditing(false);
    
    // Show success notification
    // In production, this would use a toast library
    console.log('Organization updated successfully');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
            Organization
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your organization details and settings
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Edit2 className="w-5 h-5" />
            Edit Details
          </button>
        )}
      </div>

      {/* Organization Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total States
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalStates}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                  Total Providers
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalProviders}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Monthly Growth
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  +{stats.monthlyGrowth}%
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Organization Details */}
      <Card>
        {isEditing ? (
          <form onSubmit={handleSave}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Organization Details
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  value={editForm.website || ''}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="https://"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us about your organization..."
                />
              </div>
            </div>
          </form>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Organization Details
            </h2>
            
            {organization ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Organization Name</span>
                  </div>
                  <p className="text-gray-900 dark:text-white">
                    {organization.name}
                  </p>
                </div>

                {organization.email && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      {organization.email}
                    </p>
                  </div>
                )}

                {organization.phone && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      {organization.phone}
                    </p>
                  </div>
                )}

                {organization.website && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-medium">Website</span>
                    </div>
                    <a 
                      href={organization.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {organization.website}
                    </a>
                  </div>
                )}

                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Address</span>
                  </div>
                  <p className="text-gray-900 dark:text-white whitespace-pre-line">
                    {organization.address}
                  </p>
                </div>

                {organization.description && (
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">About</span>
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      {organization.description}
                    </p>
                  </div>
                )}

                <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Organization created on {new Date(organization.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No organization details found. Please complete setup.
                </p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}