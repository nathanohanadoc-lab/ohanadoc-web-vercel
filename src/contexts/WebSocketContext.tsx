'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { toast } from 'sonner';

interface WebSocketContextValue {
  isConnected: boolean;
  isAuthenticated: boolean;
  send: (type: string, data?: any) => void;
  subscribe: (event: string, handler: (data: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const ws = useWebSocket({ autoConnect: true });

  // Handle global WebSocket events
  useEffect(() => {
    // Connection status notifications
    const unsubscribeConnect = ws.subscribe('connection:established', () => {
      toast.success('Real-time connection established');
    });

    const unsubscribeDisconnect = ws.subscribe('connection:lost', () => {
      toast.error('Real-time connection lost. Reconnecting...');
    });

    // Provider updates
    const unsubscribeProviderUpdate = ws.subscribe('provider:update', (data) => {
      console.log('Provider update:', data);
      // Update local state or trigger re-fetch
    });

    // Patient matching updates
    const unsubscribeMatchUpdate = ws.subscribe('match:new', (data) => {
      toast.info(`New patient match available: ${data.visitType}`);
    });

    const unsubscribeMatchAccepted = ws.subscribe('match:accepted', (data) => {
      toast.success(`Match accepted for patient ${data.patientId}`);
    });

    // Analytics updates
    const unsubscribeAnalyticsUpdate = ws.subscribe('analytics:update', (data) => {
      console.log('Analytics update:', data);
      // Trigger analytics refresh
    });

    // System notifications
    const unsubscribeNotification = ws.subscribe('notification', (data) => {
      switch (data.type) {
        case 'info':
          toast.info(data.message);
          break;
        case 'success':
          toast.success(data.message);
          break;
        case 'warning':
          toast.warning(data.message);
          break;
        case 'error':
          toast.error(data.message);
          break;
      }
    });

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeProviderUpdate();
      unsubscribeMatchUpdate();
      unsubscribeMatchAccepted();
      unsubscribeAnalyticsUpdate();
      unsubscribeNotification();
    };
  }, [ws]);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
}