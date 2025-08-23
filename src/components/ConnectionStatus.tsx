'use client';

import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { Wifi, WifiOff, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ConnectionStatus() {
  const { isConnected, isAuthenticated } = useWebSocketContext();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
        <WifiOff className="w-4 h-4" />
        <span>Offline</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-sm">
        <Activity className="w-4 h-4 animate-pulse" />
        <span>Connecting...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm">
      <div className="relative">
        <Wifi className="w-4 h-4" />
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
      <span>Real-time</span>
    </div>
  );
}