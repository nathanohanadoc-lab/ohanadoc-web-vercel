'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { 
  Briefcase, 
  Plus, 
  DollarSign,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Save,
  X,
  Calculator,
  MapPin,
  Clock,
  BarChart3
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  code: string;
  description: string;
  state: string;
  category: string;
  basePrice: number;
  avgDuration: number;
  providers: number;
  monthlyVolume: number;
  reimbursementRate: number;
  profitMargin: number;
  lastUpdated: string;
}

interface ServiceCategory {
  name: string;
  services: string[];
}

const serviceCategories: ServiceCategory[] = [
  {
    name: 'Primary Care',
    services: ['Annual Wellness Visit', 'Sick Visit', 'Follow-up Visit', 'Preventive Care']
  },
  {
    name: 'Specialty Care',
    services: ['Cardiology Consultation', 'Dermatology Exam', 'Orthopedic Evaluation', 'Neurology Assessment']
  },
  {
    name: 'Diagnostic Services',
    services: ['Lab Work', 'X-Ray', 'EKG', 'Ultrasound']
  },
  {
    name: 'Procedures',
    services: ['Minor Surgery', 'Injection Therapy', 'Wound Care', 'Biopsy']
  }
];

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    code: '',
    description: '',
    state: selectedState,
    category: '',
    basePrice: 0,
    avgDuration: 30,
    reimbursementRate: 80
  });

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, selectedState, selectedCategory]);

  const loadServices = () => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      // Initialize with mock data
      const mockServices = generateMockServices();
      setServices(mockServices);
      localStorage.setItem('services', JSON.stringify(mockServices));
    }
    setLoading(false);
  };

  const generateMockServices = (): Service[] => {
    const states = ['Florida', 'Texas', 'California', 'New York', 'Washington'];
    const mockServices: Service[] = [];
    
    states.forEach(state => {
      serviceCategories.forEach(category => {
        category.services.forEach((serviceName, index) => {
          mockServices.push({
            id: `${state}-${category.name}-${index}`,
            name: serviceName,
            code: `CPT${99200 + mockServices.length}`,
            description: `Standard ${serviceName.toLowerCase()} service`,
            state,
            category: category.name,
            basePrice: Math.floor(Math.random() * 200) + 100,
            avgDuration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
            providers: Math.floor(Math.random() * 20) + 5,
            monthlyVolume: Math.floor(Math.random() * 500) + 100,
            reimbursementRate: Math.floor(Math.random() * 20) + 70,
            profitMargin: 0,
            lastUpdated: new Date().toISOString()
          });
        });
      });
    });
    
    // Calculate profit margins
    return mockServices.map(service => ({
      ...service,
      profitMargin: calculateProfitMargin(service)
    }));
  };

  const filterServices = () => {
    let filtered = [...services];
    
    if (selectedState) {
      filtered = filtered.filter(s => s.state === selectedState);
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    
    setFilteredServices(filtered);
  };

  const calculateProfitMargin = (service: Partial<Service>) => {
    const revenue = (service.basePrice || 0) * (service.reimbursementRate || 0) / 100;
    const cost = (service.basePrice || 0) * 0.6; // Assume 60% cost
    return Math.round(((revenue - cost) / revenue) * 100);
  };

  const calculateMonthlyRevenue = (service: Service) => {
    return service.basePrice * service.monthlyVolume * (service.reimbursementRate / 100);
  };

  const handleAddService = () => {
    const service: Service = {
      ...newService as Service,
      id: Date.now().toString(),
      providers: 0,
      monthlyVolume: 0,
      profitMargin: calculateProfitMargin(newService),
      lastUpdated: new Date().toISOString()
    };
    
    const updatedServices = [...services, service];
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    
    setShowAddModal(false);
    setNewService({
      name: '',
      code: '',
      description: '',
      state: selectedState,
      category: '',
      basePrice: 0,
      avgDuration: 30,
      reimbursementRate: 80
    });
  };

  const handleUpdateService = () => {
    if (!editingService) return;
    
    const updatedService = {
      ...editingService,
      profitMargin: calculateProfitMargin(editingService),
      lastUpdated: new Date().toISOString()
    };
    
    const updatedServices = services.map(s => 
      s.id === updatedService.id ? updatedService : s
    );
    
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = services.filter(s => s.id !== serviceId);
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 30) return 'text-green-600';
    if (margin >= 15) return 'text-yellow-600';
    return 'text-red-600';
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
            Services
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage service offerings and pricing across states
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">All Categories</option>
            {serviceCategories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Service Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {filteredServices.length}
              </p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(
                  filteredServices.reduce((acc, s) => acc + s.basePrice, 0) / filteredServices.length || 0
                )}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {filteredServices.reduce((acc, s) => acc + s.providers, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(
                  filteredServices.reduce((acc, s) => acc + calculateMonthlyRevenue(s), 0)
                )}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="text-left py-3 px-4">Service</th>
                <th className="text-left py-3 px-4">State</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">Duration</th>
                <th className="text-right py-3 px-4">Providers</th>
                <th className="text-right py-3 px-4">Volume</th>
                <th className="text-right py-3 px-4">Margin</th>
                <th className="text-right py-3 px-4">Revenue</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {service.code} • {service.category}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {service.state}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(service.basePrice)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {service.avgDuration}m
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                    {service.providers}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                    {service.monthlyVolume}/mo
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${getMarginColor(service.profitMargin)}`}>
                      {service.profitMargin}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(calculateMonthlyRevenue(service))}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingService(service)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <Card className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Service
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddService(); }} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Code
                  </label>
                  <input
                    type="text"
                    value={newService.code}
                    onChange={(e) => setNewService({ ...newService, code: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CPT Code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <select
                    value={newService.state}
                    onChange={(e) => setNewService({ ...newService, state: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Florida">Florida</option>
                    <option value="Texas">Texas</option>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                    <option value="Washington">Washington</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {serviceCategories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Base Price
                  </label>
                  <input
                    type="number"
                    value={newService.basePrice}
                    onChange={(e) => setNewService({ ...newService, basePrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Average Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newService.avgDuration}
                    onChange={(e) => setNewService({ ...newService, avgDuration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="5"
                    step="5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reimbursement Rate (%)
                  </label>
                  <input
                    type="number"
                    value={newService.reimbursementRate}
                    onChange={(e) => setNewService({ ...newService, reimbursementRate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
              </div>

              {/* Economic Preview */}
              <Card glass={false} className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Economic Preview
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700 dark:text-blue-300">Expected Revenue</p>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {formatCurrency((newService.basePrice || 0) * (newService.reimbursementRate || 0) / 100)}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700 dark:text-blue-300">Estimated Cost</p>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {formatCurrency((newService.basePrice || 0) * 0.6)}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700 dark:text-blue-300">Profit Margin</p>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      {calculateProfitMargin(newService)}%
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Add Service
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setEditingService(null)} />
          <Card className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Service
              </h2>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleUpdateService(); }} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Base Price
                  </label>
                  <input
                    type="number"
                    value={editingService.basePrice}
                    onChange={(e) => setEditingService({ ...editingService, basePrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reimbursement Rate (%)
                  </label>
                  <input
                    type="number"
                    value={editingService.reimbursementRate}
                    onChange={(e) => setEditingService({ ...editingService, reimbursementRate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Volume
                  </label>
                  <input
                    type="number"
                    value={editingService.monthlyVolume}
                    onChange={(e) => setEditingService({ ...editingService, monthlyVolume: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Economic Impact */}
              <Card glass={false} className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <h3 className="text-sm font-medium text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Economic Impact
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-700 dark:text-green-300">Current Monthly Revenue</p>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {formatCurrency(calculateMonthlyRevenue(editingService))}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 dark:text-green-300">Projected Annual Revenue</p>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {formatCurrency(calculateMonthlyRevenue(editingService) * 12)}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <ServicesPageContent />
    </Suspense>
  );
}