'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

interface WebSocketOptions {
  autoConnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

interface WebSocketHook {
  isConnected: boolean;
  isAuthenticated: boolean;
  send: (type: string, data?: any) => void;
  subscribe: (event: string, handler: (data: any) => void) => () => void;
  connect: () => void;
  disconnect: () => void;
}

const DEFAULT_OPTIONS: WebSocketOptions = {
  autoConnect: true,
  reconnectDelay: 3000,
  maxReconnectAttempts: 5,
};

export function useWebSocket(options: WebSocketOptions = {}): WebSocketHook {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const eventHandlersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Send message through WebSocket
  const send = useCallback((type: string, data?: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now(),
      };
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  // Subscribe to WebSocket events
  const subscribe = useCallback((event: string, handler: (data: any) => void) => {
    if (!eventHandlersRef.current.has(event)) {
      eventHandlersRef.current.set(event, new Set());
    }
    eventHandlersRef.current.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = eventHandlersRef.current.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          eventHandlersRef.current.delete(event);
        }
      }
    };
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Handle authentication response
      if (message.type === 'auth:success') {
        setIsAuthenticated(true);
        console.log('WebSocket authenticated');
      } else if (message.type === 'auth:error') {
        setIsAuthenticated(false);
        console.error('WebSocket authentication failed');
      }
      
      // Dispatch to event handlers
      const handlers = eventHandlersRef.current.get(message.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(message.data);
          } catch (error) {
            console.error(`Error in WebSocket handler for ${message.type}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      const wsUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, 'ws') || 'ws://localhost:8080';
      const ws = new WebSocket(`${wsUrl}/ws`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
        // Authenticate if we have a session
        if (session?.accessToken) {
          send('auth', { token: session.accessToken });
        }
      };

      ws.onmessage = handleMessage;

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setIsAuthenticated(false);
        wsRef.current = null;

        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < opts.maxReconnectAttempts!) {
          reconnectAttemptsRef.current++;
          console.log(`Reconnecting in ${opts.reconnectDelay}ms (attempt ${reconnectAttemptsRef.current})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, opts.reconnectDelay);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [session, send, handleMessage, opts.reconnectDelay, opts.maxReconnectAttempts]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setIsAuthenticated(false);
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (opts.autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, opts.autoConnect]);

  // Re-authenticate when session changes
  useEffect(() => {
    if (isConnected && session?.accessToken && !isAuthenticated) {
      send('auth', { token: session.accessToken });
    }
  }, [isConnected, session, isAuthenticated, send]);

  return {
    isConnected,
    isAuthenticated,
    send,
    subscribe,
    connect,
    disconnect,
  };
}