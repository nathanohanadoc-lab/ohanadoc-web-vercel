'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  data?: Record<string, any>;
}

interface NotificationsHook {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export function useNotifications(): NotificationsHook {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { subscribe, isAuthenticated } = useWebSocket();

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load initial notifications
  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${process.env['NEXT_PUBLIC_API_URL']}/v1/notifications`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setNotifications(data);
          }
        })
        .catch(error => {
          console.error('Failed to load notifications:', error);
        });
    }
  }, [isAuthenticated]);

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribeNew = subscribe('notification:new', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      
      // Show toast notification
      const toastFn = {
        info: toast.info,
        warning: toast.warning,
        error: toast.error,
        success: toast.success,
      }[notification.type] || toast;

      toastFn(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    });

    const unsubscribeBroadcast = subscribe('notification:broadcast', (notification: Partial<Notification>) => {
      const fullNotification: Notification = {
        id: crypto.randomUUID(),
        userId: 'current-user', // Will be set by server
        read: false,
        timestamp: new Date().toISOString(),
        ...notification as any,
      };
      
      setNotifications(prev => [fullNotification, ...prev]);
      
      // Show toast for broadcast
      const toastFn = {
        info: toast.info,
        warning: toast.warning,
        error: toast.error,
        success: toast.success,
      }[fullNotification.type] || toast;

      toastFn(fullNotification.title, {
        description: fullNotification.message,
        duration: 5000,
      });
    });

    const unsubscribeRead = subscribe('notification:read', ({ id }: { id: string }) => {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    });

    return () => {
      unsubscribeNew();
      unsubscribeBroadcast();
      unsubscribeRead();
    };
  }, [subscribe]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );

    // Send to server
    fetch(`${process.env['NEXT_PUBLIC_API_URL']}/v1/notifications/${id}/read`, {
      method: 'PATCH',
      credentials: 'include',
    }).catch(error => {
      console.error('Failed to mark notification as read:', error);
      // Revert on error
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: false } : n))
      );
    });
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );

    // Send to server (you'd implement this endpoint)
    Promise.all(
      unreadIds.map(id =>
        fetch(`${process.env['NEXT_PUBLIC_API_URL']}/v1/notifications/${id}/read`, {
          method: 'PATCH',
          credentials: 'include',
        })
      )
    ).catch(error => {
      console.error('Failed to mark all as read:', error);
    });
  }, [notifications]);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}