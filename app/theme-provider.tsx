'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { WebSocketProvider } from '@/contexts/WebSocketContext';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme on mount
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <WebSocketProvider>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          },
        }}
      />
    </WebSocketProvider>
  );
}