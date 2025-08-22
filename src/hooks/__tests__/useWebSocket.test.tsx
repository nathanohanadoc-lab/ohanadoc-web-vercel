import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWebSocket } from '../useWebSocket';
import { SessionProvider } from 'next-auth/react';
import WS from 'vitest-websocket-mock';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: { accessToken: 'test-token', user: { id: 'user123' } },
    status: 'authenticated',
  })),
  SessionProvider: ({ children }: any) => children,
}));

describe('useWebSocket', () => {
  let server: WS;

  beforeEach(() => {
    server = new WS('ws://localhost:8080/ws');
  });

  afterEach(() => {
    WS.clean();
    vi.clearAllMocks();
  });

  test('should connect automatically when autoConnect is true', async () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: true }));

    await server.connected;
    
    expect(result.current.isConnected).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should not connect automatically when autoConnect is false', async () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: false }));

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
    });

    expect(server).not.toHaveReceivedMessages();
  });

  test('should authenticate after connection', async () => {
    const { result } = renderHook(() => useWebSocket());

    await server.connected;

    // Server sends initial connection message
    server.send(JSON.stringify({
      type: 'connected',
      data: { message: 'Please authenticate' },
      timestamp: Date.now()
    }));

    // Hook should send auth message
    await expect(server).toReceiveMessage(
      JSON.stringify({
        type: 'auth',
        data: { token: 'test-token' },
        timestamp: expect.any(Number)
      })
    );

    // Server responds with auth success
    act(() => {
      server.send(JSON.stringify({
        type: 'auth:success',
        data: { userId: 'user123' },
        timestamp: Date.now()
      }));
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  test('should handle auth failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useWebSocket());

    await server.connected;

    // Send auth failure
    act(() => {
      server.send(JSON.stringify({
        type: 'auth:error',
        data: { message: 'Authentication failed' },
        timestamp: Date.now()
      }));
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('WebSocket authentication failed');
    });

    consoleSpy.mockRestore();
  });

  test('should send messages when connected', async () => {
    const { result } = renderHook(() => useWebSocket());

    await server.connected;

    act(() => {
      result.current.send('test:message', { data: 'hello' });
    });

    await expect(server).toReceiveMessage(
      JSON.stringify({
        type: 'test:message',
        data: { data: 'hello' },
        timestamp: expect.any(Number)
      })
    );
  });

  test('should not send messages when disconnected', async () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: false }));

    act(() => {
      result.current.send('test:message', { data: 'hello' });
    });

    expect(server).not.toHaveReceivedMessages();
  });

  test('should handle subscriptions', async () => {
    const handler = vi.fn();
    const { result } = renderHook(() => useWebSocket());

    await server.connected;

    // Subscribe to event
    const unsubscribe = result.current.subscribe('test:event', handler);

    // Server sends event
    act(() => {
      server.send(JSON.stringify({
        type: 'test:event',
        data: { message: 'test data' },
        timestamp: Date.now()
      }));
    });

    await waitFor(() => {
      expect(handler).toHaveBeenCalledWith({ message: 'test data' });
    });

    // Unsubscribe
    unsubscribe();

    // Send another event
    act(() => {
      server.send(JSON.stringify({
        type: 'test:event',
        data: { message: 'test data 2' },
        timestamp: Date.now()
      }));
    });

    // Handler should not be called again
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('should handle multiple subscriptions to same event', async () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const { result } = renderHook(() => useWebSocket());

    await server.connected;

    // Subscribe multiple handlers
    result.current.subscribe('test:event', handler1);
    result.current.subscribe('test:event', handler2);

    // Server sends event
    act(() => {
      server.send(JSON.stringify({
        type: 'test:event',
        data: { message: 'test' },
        timestamp: Date.now()
      }));
    });

    await waitFor(() => {
      expect(handler1).toHaveBeenCalledWith({ message: 'test' });
      expect(handler2).toHaveBeenCalledWith({ message: 'test' });
    });
  });

  test('should reconnect on disconnect', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useWebSocket({ 
      reconnectDelay: 100,
      maxReconnectAttempts: 3 
    }));

    await server.connected;
    expect(result.current.isConnected).toBe(true);

    // Close connection
    act(() => {
      server.close({ code: 1006, reason: 'Connection lost' });
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
    });

    // Fast forward to trigger reconnect
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // New server instance for reconnection
    const newServer = new WS('ws://localhost:8080/ws');
    await newServer.connected;

    expect(result.current.isConnected).toBe(true);

    vi.useRealTimers();
  });

  test('should not reconnect on manual disconnect', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useWebSocket({ reconnectDelay: 100 }));

    await server.connected;

    // Manual disconnect
    act(() => {
      result.current.disconnect();
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
    });

    // Fast forward
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should not reconnect
    expect(result.current.isConnected).toBe(false);

    vi.useRealTimers();
  });

  test('should respect max reconnect attempts', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useWebSocket({ 
      reconnectDelay: 100,
      maxReconnectAttempts: 2 
    }));

    await server.connected;

    // Simulate multiple disconnects
    for (let i = 0; i < 3; i++) {
      act(() => {
        server.close({ code: 1006 });
      });
      
      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
      });

      if (i < 2) {
        // Should attempt reconnect
        act(() => {
          vi.advanceTimersByTime(100);
        });
        
        server = new WS('ws://localhost:8080/ws');
        await server.connected;
      } else {
        // Should not attempt after max attempts
        act(() => {
          vi.advanceTimersByTime(100);
        });
        
        expect(result.current.isConnected).toBe(false);
      }
    }

    vi.useRealTimers();
  });

  test('should handle ping/pong for heartbeat', async () => {
    const { result } = renderHook(() => useWebSocket());

    await server.connected;

    // Send ping
    act(() => {
      result.current.send('ping');
    });

    await expect(server).toReceiveMessage(
      JSON.stringify({
        type: 'ping',
        timestamp: expect.any(Number)
      })
    );

    // Server responds with pong
    act(() => {
      server.send(JSON.stringify({
        type: 'pong',
        timestamp: Date.now()
      }));
    });

    // Connection should remain active
    expect(result.current.isConnected).toBe(true);
  });
});