'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  Plus, 
  Users, 
  DollarSign,
  TrendingUp,
  Calendar,
  MoreVertical,
  Trash2,
  Edit,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

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

// State configuration with colors
const stateConfig: Record<string, { color: string; gradient: string }> = {
  florida: { 
    color: 'text-orange-600', 
    gradient: 'from-orange-400 to-red-500' 
  },
  texas: { 
    color: 'text-blue-600', 
    gradient: 'from-blue-400 to-blue-600' 
  },
  california: { 
    color: 'text-yellow-600', 
    gradient: 'from-yellow-400 to-orange-500' 
  },
  newyork: { 
    color: 'text-purple-600', 
    gradient: 'from-purple-400 to-pink-500' 
  },
  washington: { 
    color: 'text-green-600', 
    gradient: 'from-green-400 to-teal-500' 
  }
};

// Available states for selection
const availableStates = [
  { name: 'Florida', code: 'FL' },
  { name: 'Texas', code: 'TX' },
  { name: 'California', code: 'CA' },
  { name: 'New York', code: 'NY' },
  { name: 'Washington', code: 'WA' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Arizona', code: 'AZ' }
];

export default function StatesPage() {
  const [states, setStates] = useState<State[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = () => {
    const savedStates = localStorage.getItem('states');
    if (savedStates) {
      setStates(JSON.parse(savedStates));
    }
    setLoading(false);
  };

  const handleAddState = (e: React.FormEvent) => {
    e.preventDefault();
    
    const stateData = availableStates.find(s => s.code === selectedState);
    if (!stateData) return;

    const newState: State = {
      id: Date.now().toString(),
      name: stateData.name,
      code: stateData.code,
      providers: 0,
      revenue: 0,
      patients: 0,
      services: 0,
      addedAt: new Date().toISOString()
    };

    const updatedStates = [...states, newState];
    setStates(updatedStates);
    localStorage.setItem('states', JSON.stringify(updatedStates));
    
    setShowAddModal(false);
    setSelectedState('');
  };

  const handleRemoveState = (stateId: string) => {
    const updatedStates = states.filter(s => s.id !== stateId);
    setStates(updatedStates);
    localStorage.setItem('states', JSON.stringify(updatedStates));
  };

  const getStateConfig = (stateName: string) => {
    const key = stateName.toLowerCase().replace(/\s+/g, '');
    return stateConfig[key] || { color: 'text-gray-600', gradient: 'from-gray-400 to-gray-600' };
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
            States
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your healthcare network across states
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add State
        </button>
      </div>

      {/* States Grid */}
      {states.length === 0 ? (
        <Card className="text-center py-12">
          <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No states added yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start by adding states where your healthcare network operates
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Your First State
          </button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {states.map((state) => {
            const config = getStateConfig(state.name);
            return (
              <Card key={state.id} className="relative overflow-hidden group">
                {/* State Color Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />
                
                {/* Dropdown Menu */}
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <Link href={`/dashboard/states/${state.id}`}>
                  <div className="cursor-pointer">
                    {/* State Header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                          {state.code}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {state.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Active since {new Date(state.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* State Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Providers</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {state.providers}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">Revenue</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(state.revenue)}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Patients</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {state.patients}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Services</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {state.services}
                        </p>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${config.color}`}>
                        View Details
                      </span>
                      <ArrowRight className={`w-4 h-4 ${config.color}`} />
                    </div>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add State Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <Card className="relative z-10 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Add New State
            </h2>
            
            <form onSubmit={handleAddState}>
              <div className="mb-6">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select State
                </label>
                <select
                  id="state"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Choose a state...</option>
                  {availableStates
                    .filter(s => !states.some(existing => existing.code === s.code))
                    .map(state => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                </select>
              </div>

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
                  disabled={!selectedState}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Add State
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}