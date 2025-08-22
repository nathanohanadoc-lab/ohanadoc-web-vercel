'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useWebSocket } from '@/hooks/useWebSocket';
import { toast } from 'sonner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
  Filler
);

interface ProviderMetrics {
  providerId: string;
  weeklyRevenue: number;
  weeklyProfit: number;
  annualProfit: number;
  avgProfitPerVisit: number;
  burnoutRisk: number;
  lifetimeValue: number;
}

interface MatchingMetrics {
  totalAssignments: number;
  avgWaitTimeMinutes: number;
  avgProfitPerVisit: number;
  activeProviders: number;
  totalRevenueToday: number;
  providerUtilization: Record<string, number>;
  currentQueueLengths: Record<string, number>;
}

interface StateRecommendation {
  state: string;
  bestService: string;
  profitPerVisit: number;
  annualProfit: number;
  roiPercent: number;
  paybackMonths: number;
}

export default function ProviderAnalyticsPage() {
  const [selectedProvider, setSelectedProvider] = useState('NP001');
  const [providerMetrics, setProviderMetrics] = useState<ProviderMetrics | null>(null);
  const [matchingMetrics, setMatchingMetrics] = useState<MatchingMetrics | null>(null);
  const [stateRecommendations, setStateRecommendations] = useState<StateRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { subscribe, isConnected } = useWebSocket();
  const base = process.env['NEXT_PUBLIC_API_BASE'] || 'http://localhost:4000/v1';

  // Subscribe to real-time updates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const unsubscribeAssignment = subscribe('matching:assignment', (data) => {
      toast.success(`Patient ${data.patientId} assigned to ${data.providerId}`);
      fetchMatchingMetrics();
    });

    const unsubscribeQueue = subscribe('matching:queue-update', (data) => {
      setMatchingMetrics(prev => prev ? {
        ...prev,
        currentQueueLengths: data.queueLengths,
        avgWaitTimeMinutes: data.avgWaitTime,
        activeProviders: data.activeProviders
      } : null);
    });

    return () => {
      unsubscribeAssignment();
      unsubscribeQueue();
    };
  }, [subscribe]);

  // Fetch provider metrics
  const fetchProviderMetrics = async () => {
    try {
      const response = await fetch(`${base}/providers/${selectedProvider}/economics`);
      if (response.ok) {
        const data = await response.json();
        setProviderMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch provider metrics:', error);
    }
  };

  // Fetch matching metrics
  const fetchMatchingMetrics = async () => {
    try {
      const response = await fetch(`${base}/matching/metrics`);
      if (response.ok) {
        const data = await response.json();
        setMatchingMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch matching metrics:', error);
    }
  };

  // Fetch state licensing recommendations
  const fetchStateLicensing = async () => {
    try {
      const response = await fetch(`${base}/providers/${selectedProvider}/licensing-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: selectedProvider,
          availableHoursPerWeek: 20,
          potentialStates: ['NY', 'FL', 'TX']
        })
      });
      if (response.ok) {
        const data = await response.json();
        setStateRecommendations(data.recommendedStates || []);
      }
    } catch (error) {
      console.error('Failed to fetch licensing recommendations:', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchProviderMetrics(),
      fetchMatchingMetrics(),
      fetchStateLicensing()
    ]).finally(() => setLoading(false));
  }, [selectedProvider]);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">Provider Analytics Dashboard</h1>
        <p>Loading analytics data...</p>
      </main>
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time provider economics and matching insights</p>
          {isConnected && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full mt-2">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Live Updates
            </span>
          )}
        </header>

        {/* Provider Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Provider
          </label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="NP001">NP001 - Nurse Practitioner (Ohio)</option>
            <option value="MD001">MD001 - Medical Doctor (California)</option>
            <option value="PA001">PA001 - Physician Assistant (Kansas)</option>
          </select>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {providerMetrics && (
            <>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500">Weekly Profit</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${providerMetrics.weeklyProfit.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ${providerMetrics.weeklyRevenue.toFixed(2)} revenue
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500">Annual Profit</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${(providerMetrics.annualProfit / 1000).toFixed(1)}k
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  LTV: ${(providerMetrics.lifetimeValue / 1000).toFixed(1)}k
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500">Avg Profit/Visit</h3>
                <p className="text-2xl font-bold text-purple-600">
                  ${providerMetrics.avgProfitPerVisit.toFixed(2)}
                </p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500">Burnout Risk</h3>
                <p className={`text-2xl font-bold ${
                  providerMetrics.burnoutRisk < 0.3 ? 'text-green-600' :
                  providerMetrics.burnoutRisk < 0.6 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {(providerMetrics.burnoutRisk * 100).toFixed(0)}%
                </p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      providerMetrics.burnoutRisk < 0.3 ? 'bg-green-500' :
                      providerMetrics.burnoutRisk < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${providerMetrics.burnoutRisk * 100}%` }}
                  />
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Matching System Metrics */}
        {matchingMetrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Real-time Matching Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Active Providers</p>
                  <p className="text-xl font-bold">{matchingMetrics.activeProviders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today&apos;s Assignments</p>
                  <p className="text-xl font-bold">{matchingMetrics.totalAssignments}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Wait Time</p>
                  <p className="text-xl font-bold">{matchingMetrics.avgWaitTimeMinutes.toFixed(1)} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revenue Today</p>
                  <p className="text-xl font-bold text-green-600">
                    ${matchingMetrics.totalRevenueToday.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Queue Status</h3>
                <div className="space-y-2">
                  {Object.entries(matchingMetrics.currentQueueLengths).map(([urgency, count]) => (
                    <div key={urgency} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{urgency}</span>
                      <span className={`text-sm font-medium ${
                        urgency === 'EMERGENT' && count > 0 ? 'text-red-600' :
                        urgency === 'URGENT' && count > 2 ? 'text-orange-600' :
                        'text-gray-700'
                      }`}>
                        {count} waiting
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Provider Utilization</h2>
              <div className="h-64">
                <Bar
                  data={{
                    labels: Object.keys(matchingMetrics.providerUtilization),
                    datasets: [{
                      label: 'Utilization %',
                      data: Object.values(matchingMetrics.providerUtilization),
                      backgroundColor: Object.values(matchingMetrics.providerUtilization).map(v =>
                        v > 80 ? 'rgba(239, 68, 68, 0.8)' :
                        v > 60 ? 'rgba(251, 191, 36, 0.8)' :
                        'rgba(34, 197, 94, 0.8)'
                      )
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </div>
            </Card>
          </div>
        )}

        {/* State Licensing Recommendations */}
        {stateRecommendations.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">State Licensing Opportunities</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Best Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit/Visit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Annual Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROI %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payback
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stateRecommendations.map((rec) => (
                    <tr key={rec.state}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {rec.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rec.bestService}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${rec.profitPerVisit.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(rec.annualProfit / 1000).toFixed(1)}k
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {rec.roiPercent.toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rec.paybackMonths.toFixed(1)} mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Simulate Day
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Optimize Portfolio
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            Download Report
          </button>
        </div>
      </div>
    </main>
  );
}