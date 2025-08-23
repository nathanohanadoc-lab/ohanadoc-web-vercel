'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import ProviderMatchingPanel from '@/components/ProviderMatchingPanel';
import {
  Activity,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart,
  Brain,
  Globe,
  Heart
} from 'lucide-react';

type MatchingPriority = 'balanced' | 'profit' | 'provider_satisfaction' | 'patient_experience' | 'geographic_arbitrage';

interface MatchingSettings {
  priority: MatchingPriority;
  autoAcceptThreshold: number;
  maxWaitTime: number;
  burnoutProtection: boolean;
  arbitrageBonus: boolean;
}

export default function MatchingPage() {
  const [settings, setSettings] = useState<MatchingSettings>({
    priority: 'balanced',
    autoAcceptThreshold: 80,
    maxWaitTime: 30,
    burnoutProtection: true,
    arbitrageBonus: true
  });

  const priorityOptions: { value: MatchingPriority; label: string; icon: any; description: string }[] = [
    {
      value: 'balanced',
      label: 'Balanced',
      icon: Target,
      description: 'Optimize for overall system health'
    },
    {
      value: 'profit',
      label: 'Profit Maximization',
      icon: DollarSign,
      description: 'Prioritize high-margin matches'
    },
    {
      value: 'provider_satisfaction',
      label: 'Provider Satisfaction',
      icon: Heart,
      description: 'Focus on provider preferences and wellness'
    },
    {
      value: 'patient_experience',
      label: 'Patient Experience',
      icon: Users,
      description: 'Minimize wait times and maximize quality'
    },
    {
      value: 'geographic_arbitrage',
      label: 'Geographic Arbitrage',
      icon: Globe,
      description: 'Maximize cross-state cost advantages'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          Real-Time Patient Matching
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          AI-powered patient-provider matching with economic optimization
        </p>
      </div>

      {/* Matching Settings */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600" />
            Matching Configuration
          </h2>

          {/* Priority Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Matching Priority
            </label>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
              {priorityOptions.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSettings({ ...settings, priority: option.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      settings.priority === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 mx-auto ${
                      settings.priority === option.value ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <p className={`text-sm font-medium ${
                      settings.priority === option.value ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                    }`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Auto-Accept Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={settings.autoAcceptThreshold}
                  onChange={(e) => setSettings({ ...settings, autoAcceptThreshold: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                  {settings.autoAcceptThreshold}%
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Automatically accept matches above this score
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Wait Time (minutes)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={settings.maxWaitTime}
                  onChange={(e) => setSettings({ ...settings, maxWaitTime: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                  {settings.maxWaitTime}m
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Alert when patients wait longer than this
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Burnout Protection</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Prevent provider overload
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, burnoutProtection: !settings.burnoutProtection })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.burnoutProtection ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.burnoutProtection ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Geographic Arbitrage</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bonus for cross-state matches
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, arbitrageBonus: !settings.arbitrageBonus })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.arbitrageBonus ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.arbitrageBonus ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-medium">AI Optimization</h3>
          </div>
          <p className="text-2xl font-bold mb-1">98.5%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Match accuracy</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-medium">Revenue Impact</h3>
          </div>
          <p className="text-2xl font-bold mb-1">+24%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Profit increase</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-medium">Arbitrage Value</h3>
          </div>
          <p className="text-2xl font-bold mb-1">$145K</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Monthly savings</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <BarChart className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-medium">Utilization</h3>
          </div>
          <p className="text-2xl font-bold mb-1">87%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Provider capacity</p>
        </Card>
      </div>

      {/* Real-Time Matching Panel */}
      <ProviderMatchingPanel />
    </div>
  );
}