import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OhanaDoc Admin Dashboard',
  description: 'Healthcare practice management and analytics dashboard',
  icons: {
    icon: [
      { url: '/icons16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons128.png', sizes: '128x128', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#3b82f6', // brand-primary color
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons32.png" sizes="32x32" />
        <link rel="icon" href="/icons16.png" sizes="16x16" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>{children}</body>
    </html>
  );
}

