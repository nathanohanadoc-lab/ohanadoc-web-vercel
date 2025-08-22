export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header with Gradient */}
      <header className="bg-gradient-primary text-white shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="OhanaDoc" className="h-10 w-10" />
              <h1 className="text-2xl font-bold">OhanaDoc Admin</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/analytics" className="hover:opacity-80 transition-opacity">Analytics</a>
              <a href="/patients" className="hover:opacity-80 transition-opacity">Patients</a>
              <a href="/providers" className="hover:opacity-80 transition-opacity">Providers</a>
              <a href="/settings" className="hover:opacity-80 transition-opacity">Settings</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* KPI Cards Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-6">Dashboard Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue Card */}
            <div className="surface-elevated rounded-xl p-6 hover-lift transition-transform">
              <div className="bg-gradient-primary rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">Monthly Revenue</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">$125,430</h3>
                <p className="text-xs mt-1 opacity-75">+12.5% from last month</p>
              </div>
            </div>

            {/* Patients Card */}
            <div className="surface-elevated rounded-xl p-6 hover-lift transition-transform">
              <div className="bg-gradient-success rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">Active Patients</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">1,842</h3>
                <p className="text-xs mt-1 opacity-75">+48 new this week</p>
              </div>
            </div>

            {/* Appointments Card */}
            <div className="surface-elevated rounded-xl p-6 hover-lift transition-transform">
              <div className="bg-brand-tertiary rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">Today's Appointments</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">47</h3>
                <p className="text-xs mt-1 opacity-75">85% booking rate</p>
              </div>
            </div>

            {/* Performance Card */}
            <div className="surface-elevated rounded-xl p-6 hover-lift transition-transform">
              <div className="bg-gradient-secondary rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">Performance Score</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">94.2%</h3>
                <p className="text-xs mt-1 opacity-75">Above target</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Patient
            </button>
            <button className="btn btn-gradient">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Appointment
            </button>
            <button className="glass rounded-md px-4 py-2 font-medium text-text-primary hover-scale transition-transform">
              View Reports
            </button>
            <button className="glass rounded-md px-4 py-2 font-medium text-text-primary hover-scale transition-transform">
              Export Data
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Recent Activity</h2>
          <div className="surface rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                        {i}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">Patient Check-in</p>
                        <p className="text-sm text-text-tertiary">John Doe - Annual Checkup</p>
                      </div>
                    </div>
                    <time className="text-sm text-text-muted">2 min ago</time>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-primary rounded-full shadow-xl text-white flex items-center justify-center hover-scale transition-transform">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}

