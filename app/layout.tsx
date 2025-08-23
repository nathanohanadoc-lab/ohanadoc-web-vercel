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

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        {/* Gradient Background Layers */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%22100%22%20height%3D%22100%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%20100%200%20L%200%200%200%20100%22%20fill%3D%22none%22%20stroke%3D%22rgba(0%2C0%2C0%2C0.05)%22%20stroke-width%3D%221%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%20%2F%3E%3C%2Fsvg%3E')]" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

