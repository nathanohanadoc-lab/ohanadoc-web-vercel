'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import {
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  MapPin,
  Activity,
  AlertCircle,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';

interface MatchingRequest {
  id: string;
  patientId: string;
  visitType: string;
  state: string;
  urgency: 'routine' | 'moderate' | 'urgent' | 'emergent';
  timestamp: Date;
  insurance: string;
  language: string;
  complexityScore: number;
  estimatedDuration: number;
  estimatedRevenue: number;
  waitingTime: number;
}

interface ProviderMatch {
  providerId: string;
  providerName: string;
  matchScore: number;
  scoreComponents: {
    profit: number;
    efficiency: number;
    burnoutPrevention: number;
    waitTime: number;
    quality: number;
  };
  estimatedProfit: number;
  isArbitrageOpportunity: boolean;
}

interface MatchingMetrics {
  activeRequests: number;
  avgWaitTime: number;
  avgMatchScore: number;
  avgProfitPerVisit: number;
  utilizationRate: number;
}

export default function ProviderMatchingPanel({ providerId }: { providerId?: string }) {
  const ws = useWebSocketContext();
  const [requests, setRequests] = useState<MatchingRequest[]>([]);
  const [matches, setMatches] = useState<Map<string, ProviderMatch>>(new Map());
  const [metrics, setMetrics] = useState<MatchingMetrics>({
    activeRequests: 0,
    avgWaitTime: 0,
    avgMatchScore: 0,
    avgProfitPerVisit: 0,
    utilizationRate: 0
  });
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [autoMatch, setAutoMatch] = useState(false);

  useEffect(() => {
    // Subscribe to WebSocket events
    const unsubscribeNewMatch = ws.subscribe('match:new', (data) => {
      const newRequest: MatchingRequest = {
        id: data.id,
        patientId: data.patientId,
        visitType: data.visitType,
        state: data.state,
        urgency: data.urgency,
        timestamp: new Date(data.timestamp),
        insurance: data.insurance,
        language: data.language,
        complexityScore: data.complexityScore,
        estimatedDuration: data.estimatedDuration,
        estimatedRevenue: data.estimatedRevenue,
        waitingTime: 0
      };
      setRequests(prev => [...prev, newRequest].slice(-10));
      
      if (providerId || autoMatch) {
        generateMatchScore(newRequest);
      }
    });

    const unsubscribeMatchScore = ws.subscribe('match:score', (data) => {
      if (data.requestId) {
        const match: ProviderMatch = {
          providerId: data.providerId,
          providerName: data.providerName,
          matchScore: data.matchScore,
          scoreComponents: data.scoreComponents,
          estimatedProfit: data.estimatedProfit,
          isArbitrageOpportunity: data.isArbitrageOpportunity
        };
        setMatches(prev => new Map(prev).set(data.requestId, match));
      }
    });

    const unsubscribeMetricsUpdate = ws.subscribe('matching:metrics', (data) => {
      setMetrics(data);
    });

    // Simulate real-time patient requests for demo
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        generateMockRequest();
      }
      updateWaitingTimes();
    }, 5000);

    return () => {
      clearInterval(interval);
      unsubscribeNewMatch();
      unsubscribeMatchScore();
      unsubscribeMetricsUpdate();
    };
  }, [ws, providerId, autoMatch]);

  const generateMockRequest = () => {
    const visitTypes = ['Primary Care', 'Mental Health', 'Weight Loss', 'Urgent Care', 'Follow-up'];
    const states = ['Florida', 'Texas', 'California', 'New York', 'Washington'];
    const urgencies: MatchingRequest['urgency'][] = ['routine', 'moderate', 'urgent', 'emergent'];
    const insurances = ['cash', 'commercial', 'medicare', 'medicaid'];

    const newRequest: MatchingRequest = {
      id: Date.now().toString(),
      patientId: `PAT-${Math.floor(Math.random() * 10000)}`,
      visitType: visitTypes[Math.floor(Math.random() * visitTypes.length)],
      state: states[Math.floor(Math.random() * states.length)],
      urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
      timestamp: new Date(),
      insurance: insurances[Math.floor(Math.random() * insurances.length)],
      language: Math.random() > 0.2 ? 'english' : 'spanish',
      complexityScore: Math.random() * 2 + 0.5,
      estimatedDuration: Math.floor(Math.random() * 30) + 15,
      estimatedRevenue: Math.floor(Math.random() * 200) + 100,
      waitingTime: 0
    };

    setRequests(prev => [...prev, newRequest].slice(-10)); // Keep only last 10 requests
    
    // Generate match scores for this request
    if (providerId || autoMatch) {
      generateMatchScore(newRequest);
    }
  };

  const generateMatchScore = (request: MatchingRequest) => {
    const match: ProviderMatch = {
      providerId: providerId || 'AUTO',
      providerName: providerId ? 'Current Provider' : 'Best Match',
      matchScore: Math.random() * 40 + 60,
      scoreComponents: {
        profit: Math.random() * 100,
        efficiency: Math.random() * 100,
        burnoutPrevention: Math.random() * 100,
        waitTime: Math.random() * 100,
        quality: Math.random() * 100
      },
      estimatedProfit: request.estimatedRevenue * (0.3 + Math.random() * 0.4),
      isArbitrageOpportunity: request.state !== 'California' && Math.random() > 0.6
    };

    setMatches(prev => new Map(prev).set(request.id, match));
  };

  const updateWaitingTimes = () => {
    setRequests(prev => prev.map(req => ({
      ...req,
      waitingTime: Math.floor((Date.now() - req.timestamp.getTime()) / 1000)
    })));
  };

  const formatWaitTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const getUrgencyBadge = (urgency: MatchingRequest['urgency']) => {
    const variants = {
      routine: { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20' },
      moderate: { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
      urgent: { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
      emergent: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' }
    };

    const variant = variants[urgency];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variant.bg} ${variant.color}`}>
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
      </span>
    );
  };

  const handleAcceptMatch = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    const match = matches.get(requestId);
    
    if (request && match) {
      // Send acceptance through WebSocket
      ws.send('match:accept', {
        requestId,
        patientId: request.patientId,
        providerId: match.providerId,
        matchScore: match.matchScore,
        estimatedProfit: match.estimatedProfit
      });
    }
    
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setMatches(prev => {
      const newMatches = new Map(prev);
      newMatches.delete(requestId);
      return newMatches;
    });
  };

  return (
    <div className="space-y-6">
      {/* Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Requests</p>
              <p className="text-2xl font-bold">{requests.length}</p>
            </div>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Wait Time</p>
              <p className="text-2xl font-bold">
                {formatWaitTime(Math.floor(requests.reduce((acc, r) => acc + r.waitingTime, 0) / (requests.length || 1)))}
              </p>
            </div>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Match Score</p>
              <p className="text-2xl font-bold">
                {Array.from(matches.values()).reduce((acc, m) => acc + m.matchScore, 0) / (matches.size || 1) || 0}%
              </p>
            </div>
            <Target className="w-5 h-5 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Profit/Visit</p>
              <p className="text-2xl font-bold">
                ${Math.floor(Array.from(matches.values()).reduce((acc, m) => acc + m.estimatedProfit, 0) / (matches.size || 1)) || 0}
              </p>
            </div>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Auto-Match</p>
              <button
                onClick={() => setAutoMatch(!autoMatch)}
                className={`mt-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  autoMatch 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                    : 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
                }`}
              >
                {autoMatch ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Active Requests */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Real-Time Patient Requests
          </h3>

          <div className="space-y-3">
            {requests.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Waiting for patient requests...</p>
            ) : (
              requests.map(request => {
                const match = matches.get(request.id);
                return (
                  <div
                    key={request.id}
                    className={`border rounded-lg p-4 transition-all cursor-pointer ${
                      selectedRequest === request.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">{request.visitType}</span>
                          {getUrgencyBadge(request.urgency)}
                          <Badge variant="secondary">
                            <MapPin className="w-3 h-3 mr-1" />
                            {request.state}
                          </Badge>
                          {match?.isArbitrageOpportunity && (
                            <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-pink-600">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Arbitrage
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>
                            <span className="block">Patient</span>
                            <span className="text-gray-900 dark:text-white">{request.patientId}</span>
                          </div>
                          <div>
                            <span className="block">Insurance</span>
                            <span className="text-gray-900 dark:text-white capitalize">{request.insurance}</span>
                          </div>
                          <div>
                            <span className="block">Est. Duration</span>
                            <span className="text-gray-900 dark:text-white">{request.estimatedDuration}m</span>
                          </div>
                          <div>
                            <span className="block">Est. Revenue</span>
                            <span className="text-gray-900 dark:text-white">${request.estimatedRevenue}</span>
                          </div>
                        </div>

                        {match && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Match Score</span>
                                  <p className="text-lg font-bold text-green-600">{Math.round(match.matchScore)}%</p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Est. Profit</span>
                                  <p className="text-lg font-bold">${Math.round(match.estimatedProfit)}</p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptMatch(request.id);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                              >
                                Accept Match
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="ml-4 text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Waiting</p>
                        <p className="text-lg font-semibold text-orange-600">
                          {formatWaitTime(request.waitingTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}