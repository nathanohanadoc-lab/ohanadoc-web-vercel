'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Globe,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  ChevronRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

interface TimeRange {
  label: string;
  value: string;
  from: Date;
  to: Date;
}

const timeRanges: TimeRange[] = [
  { label: 'Last 7 Days', value: '7d', from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() },
  { label: 'Last 30 Days', value: '30d', from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() },
  { label: 'Last 90 Days', value: '90d', from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), to: new Date() },
  { label: 'Year to Date', value: 'ytd', from: new Date(new Date().getFullYear(), 0, 1), to: new Date() }
];

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[1]);
  const [loading, setLoading] = useState(true);

  // Mock data - in production, this would come from API
  const kpis = {
    revenue: 1875420,
    revenueChange: 12.5,
    profit: 562626,
    profitChange: 15.3,
    providers: 47,
    providersChange: 4.2,
    patients: 3240,
    patientsChange: 8.7,
    avgVisitValue: 185,
    avgVisitValueChange: 3.2,
    utilizationRate: 87,
    utilizationRateChange: 2.1
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, [selectedTimeRange]);

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

  // Chart configurations
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [320000, 345000, 365000, 390000, 420000, 445000, 475000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Profit',
        data: [96000, 103500, 109500, 117000, 126000, 133500, 142500],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const visitTypeData = {
    labels: ['Primary Care', 'Mental Health', 'Weight Loss', 'Urgent Care', 'Specialty'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#3b82f6',
        '#8b5cf6',
        '#06b6d4',
        '#f59e0b',
        '#ef4444'
      ],
      borderWidth: 0
    }]
  };

  const statePerformanceData = {
    labels: ['Florida', 'Texas', 'California', 'New York', 'Washington'],
    datasets: [
      {
        label: 'Revenue',
        data: [450000, 380000, 420000, 350000, 275000],
        backgroundColor: '#3b82f6'
      },
      {
        label: 'Providers',
        data: [12, 10, 11, 8, 6],
        backgroundColor: '#8b5cf6',
        yAxisID: 'y1'
      }
    ]
  };

  const providerUtilizationData = {
    labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
    datasets: [{
      label: 'Providers',
      data: [2, 3, 8, 18, 16],
      backgroundColor: [
        '#ef4444',
        '#f59e0b',
        '#eab308',
        '#84cc16',
        '#10b981'
      ]
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      }
    }
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
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track performance metrics and financial insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange.value}
            onChange={(e) => setSelectedTimeRange(timeRanges.find(t => t.value === e.target.value) || timeRanges[1])}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(kpis.revenue)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {kpis.revenueChange}%
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(kpis.profit)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {kpis.profitChange}%
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">30% margin</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatNumber(kpis.patients)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {kpis.patientsChange}%
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">new this month</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Visit Value</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${kpis.avgVisitValue}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {kpis.avgVisitValueChange}%
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">per visit</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
              <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilization Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {kpis.utilizationRate}%
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {kpis.utilizationRateChange}%
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">capacity used</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Providers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {kpis.providers}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {kpis.providersChange}%
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">5 states</span>
              </div>
            </div>
            <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-xl">
              <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue & Profit Trend */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue & Profit Trend</h3>
            <div style={{ height: '300px' }}>
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>
        </Card>

        {/* Visit Type Distribution */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Visit Type Distribution</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={visitTypeData} options={doughnutOptions} />
            </div>
          </div>
        </Card>

        {/* State Performance */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">State Performance</h3>
            <div style={{ height: '300px' }}>
              <Bar 
                data={statePerformanceData} 
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </Card>

        {/* Provider Utilization */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Provider Utilization</h3>
            <div style={{ height: '300px' }}>
              <Bar data={providerUtilizationData} options={chartOptions} />
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Providers</h3>
          <div className="space-y-3">
            {[
              { name: 'Dr. Sarah Johnson', specialty: 'Primary Care', state: 'Florida', revenue: 125000, patients: 342 },
              { name: 'Dr. Michael Chen', specialty: 'Mental Health', state: 'California', revenue: 118000, patients: 256 },
              { name: 'Dr. Emily Rodriguez', specialty: 'Weight Loss', state: 'Texas', revenue: 105000, patients: 198 },
              { name: 'Dr. James Wilson', specialty: 'Urgent Care', state: 'New York', revenue: 98000, patients: 412 },
              { name: 'Dr. Lisa Thompson', specialty: 'Primary Care', state: 'Washington', revenue: 92000, patients: 287 }
            ].map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{provider.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {provider.specialty} • {provider.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(provider.revenue)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">{provider.patients}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Patients</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}