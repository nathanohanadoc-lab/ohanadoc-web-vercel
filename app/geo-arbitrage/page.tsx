'use client';

import { useState, useEffect } from 'react';
import { Card } from '@ohanadoc/ui';
import { Scatter, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

interface StateData {
  state: string;
  name: string;
  costOfLiving: number;
  avgReimbursement: number;
  demandIndex: number;
  arbitrageScore: number;
  providers: number;
  potentialProfit: number;
}

interface ArbitrageOpportunity {
  providerState: string;
  serviceState: string;
  profitDifferential: number;
  roiPercent: number;
  recommendedHours: number;
}

export default function GeoArbitragePage() {
  const [stateData, setStateData] = useState<StateData[]>([]);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [selectedProviderState, setSelectedProviderState] = useState('OH');
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/v1';

  useEffect(() => {
    // Simulate fetching state data
    const mockStateData: StateData[] = [
      { state: 'CA', name: 'California', costOfLiving: 1.4, avgReimbursement: 1.3, demandIndex: 1.4, arbitrageScore: 0.93, providers: 12, potentialProfit: 45000 },
      { state: 'TX', name: 'Texas', costOfLiving: 0.95, avgReimbursement: 1.0, demandIndex: 1.2, arbitrageScore: 1.05, providers: 8, potentialProfit: 38000 },
      { state: 'OH', name: 'Ohio', costOfLiving: 0.85, avgReimbursement: 0.85, demandIndex: 0.9, arbitrageScore: 1.0, providers: 15, potentialProfit: 32000 },
      { state: 'KS', name: 'Kansas', costOfLiving: 0.75, avgReimbursement: 0.75, demandIndex: 0.7, arbitrageScore: 1.0, providers: 5, potentialProfit: 28000 },
      { state: 'NY', name: 'New York', costOfLiving: 1.5, avgReimbursement: 1.4, demandIndex: 1.5, arbitrageScore: 0.93, providers: 10, potentialProfit: 48000 },
      { state: 'FL', name: 'Florida', costOfLiving: 1.1, avgReimbursement: 1.1, demandIndex: 1.3, arbitrageScore: 1.0, providers: 9, potentialProfit: 40000 }
    ];
    setStateData(mockStateData);

    // Calculate arbitrage opportunities
    const provider = mockStateData.find(s => s.state === selectedProviderState);
    if (provider) {
      const opps: ArbitrageOpportunity[] = mockStateData
        .filter(s => s.state !== selectedProviderState)
        .map(service => ({
          providerState: selectedProviderState,
          serviceState: service.state,
          profitDifferential: (service.avgReimbursement / provider.costOfLiving - 1) * 100,
          roiPercent: ((service.avgReimbursement * service.demandIndex) / provider.costOfLiving - 1) * 100,
          recommendedHours: Math.min(20, Math.floor(service.demandIndex * 15))
        }))
        .sort((a, b) => b.roiPercent - a.roiPercent);
      setOpportunities(opps);
    }
  }, [selectedProviderState]);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Geographic Arbitrage Optimizer</h1>
          <p className="text-gray-600 mt-2">Maximize profitability through strategic provider-state matching</p>
        </header>

        {/* Provider State Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider Residence State
          </label>
          <select
            value={selectedProviderState}
            onChange={(e) => setSelectedProviderState(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            {stateData.map(state => (
              <option key={state.state} value={state.state}>
                {state.name} (CoL Index: {state.costOfLiving})
              </option>
            ))}
          </select>
        </div>

        {/* Arbitrage Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Cost vs Revenue Analysis</h2>
            <div className="h-64">
              <Scatter
                data={{
                  datasets: [{
                    label: 'States',
                    data: stateData.map(s => ({
                      x: s.costOfLiving,
                      y: s.avgReimbursement,
                      label: s.state
                    })),
                    backgroundColor: stateData.map(s => 
                      s.state === selectedProviderState ? 'rgba(59, 130, 246, 0.8)' :
                      s.avgReimbursement / s.costOfLiving > 1.1 ? 'rgba(34, 197, 94, 0.8)' :
                      'rgba(156, 163, 175, 0.8)'
                    ),
                    pointRadius: stateData.map(s => s.demandIndex * 8),
                    pointHoverRadius: 10
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Cost of Living Index'
                      },
                      min: 0.5,
                      max: 1.6
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Avg Reimbursement Multiplier'
                      },
                      min: 0.5,
                      max: 1.6
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const point = context.raw as any;
                          const state = stateData.find(s => s.costOfLiving === point.x);
                          return [
                            `${state?.name || 'Unknown'}`,
                            `CoL: ${point.x}`,
                            `Reimbursement: ${point.y}`,
                            `Arbitrage: ${((point.y / point.x - 1) * 100).toFixed(1)}%`
                          ];
                        }
                      }
                    }
                  }
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Bubble size represents demand index. Green indicates profitable arbitrage opportunities.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Top Arbitrage Opportunities</h2>
            <div className="space-y-3">
              {opportunities.slice(0, 5).map(opp => (
                <div key={opp.serviceState} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {selectedProviderState} → {opp.serviceState}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Recommended: {opp.recommendedHours} hrs/week
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${opp.roiPercent > 20 ? 'text-green-600' : 'text-gray-700'}`}>
                        +{opp.roiPercent.toFixed(1)}% ROI
                      </p>
                      <p className="text-sm text-gray-600">
                        ${(opp.profitDifferential * 50).toFixed(0)}/visit extra
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* State Performance Comparison */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">State Performance Metrics</h2>
          <div className="h-64">
            <Bar
              data={{
                labels: stateData.map(s => s.state),
                datasets: [
                  {
                    label: 'Potential Annual Profit ($k)',
                    data: stateData.map(s => s.potentialProfit / 1000),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)'
                  },
                  {
                    label: 'Active Providers',
                    data: stateData.map(s => s.providers),
                    backgroundColor: 'rgba(156, 163, 175, 0.8)',
                    yAxisID: 'y1'
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Annual Profit ($k)'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Provider Count'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  }
                }
              }}
            />
          </div>
        </Card>

        {/* Strategy Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">💰 Highest ROI</h3>
            <p className="text-sm text-green-700">
              {selectedProviderState} providers serving CA patients yield 
              {opportunities[0] && ` ${opportunities[0].roiPercent.toFixed(0)}% higher returns`}
            </p>
          </Card>
          
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">⚖️ Optimal Mix</h3>
            <p className="text-sm text-blue-700">
              Allocate 60% capacity to high-arbitrage states, 40% to local market for stability
            </p>
          </Card>
          
          <Card className="p-4 bg-purple-50 border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">🎯 Quick Win</h3>
            <p className="text-sm text-purple-700">
              License in {opportunities[0]?.serviceState || 'CA'} first - 
              {opportunities[0] && ` ${(opportunities[0].recommendedHours * 52 * 50).toLocaleString()} annual profit potential`}
            </p>
          </Card>
        </div>

        {/* Action Panel */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-lg font-semibold mb-4">Take Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Immediate Steps</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">1</span>
                  Analyze provider availability in {selectedProviderState}
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">2</span>
                  Calculate licensing costs for top 3 opportunity states
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">3</span>
                  Run profitability simulation for mixed portfolio
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Generate Licensing Plan
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Run Portfolio Optimization
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                Export Analysis Report
              </button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}