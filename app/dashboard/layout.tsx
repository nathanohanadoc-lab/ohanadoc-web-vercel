'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ConnectionStatus from '@/components/ConnectionStatus';
import {
  Building2,
  MapPin,
  Users,
  BarChart3,
  Settings,
  Briefcase,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Activity
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' as const, icon: BarChart3 },
  { name: 'States', href: '/dashboard/states' as const, icon: MapPin },
  { name: 'Providers', href: '/dashboard/providers' as const, icon: Users },
  { name: 'Matching', href: '/dashboard/matching' as const, icon: Activity },
  { name: 'Analytics', href: '/dashboard/analytics' as const, icon: BarChart3 },
  { name: 'Organization', href: '/dashboard/organization' as const, icon: Building2 },
  { name: 'Services', href: '/dashboard/services' as const, icon: Briefcase },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSignOut = () => {
    // Clear session and redirect to home
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
    router.push('/');
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-800/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                O
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OhanaDoc
              </span>
            </div>

            {/* Desktop Navigation Pills */}
            <nav className="hidden md:flex items-center gap-2 bg-gray-100/50 dark:bg-slate-800/50 rounded-full p-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-lg"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

                      {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <ConnectionStatus />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

              {/* Settings */}
              <Link
                href="/dashboard/settings"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <nav className="fixed top-16 right-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-xl">
            <div className="p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
}