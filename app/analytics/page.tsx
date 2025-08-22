'use client';
import { useEffect, useState } from 'react';
import { Card, SrOnly } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type KPISet = {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  marginPct: number;
  patientsTotal: number;
  avgRevenuePerProvider: number;
  avgRevenuePerState: number;
  avgRevenuePerPatient: number;
};

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<KPISet | null>(null);
  const [series, setSeries] = useState<{ labels: string[]; revenue: number[]; expenses: number[]; patients: number[] } | null>(null);
  const base = process.env['NEXT_PUBLIC_API_BASE'] || 'http://localhost:4000/v1';
  useEffect(() => {
    const params = new URLSearchParams({ from: '2025-01-01', to: '2025-03-31', granularity: 'month' });
    fetch(`${base}/analytics/overview?${params.toString()}`)
      .then(r => r.json())
      .then(d => setKpis(d.kpis))
      .catch(() => setKpis(null));
    fetch(`${base}/analytics/timeseries?${params.toString()}`)
      .then(r => r.json())
      .then(d => {
        const labels = (d.revenue || d.revenue?.series || d.revenue)?.map((p: any) => new Date(p.periodStart).toLocaleDateString()) || [];
        setSeries({
          labels,
          revenue: (d.revenue || []).map((p: any) => p.value),
          expenses: (d.expenses || []).map((p: any) => p.value),
          patients: (d.patients || []).map((p: any) => p.value)
        });
      })
      .catch(() => setSeries(null));
  }, [base]);
  return (
    <main style={{ padding: 24 }}>
      <h1><SrOnly>Admin</SrOnly> Analytics</h1>
      {kpis ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <Card><div>Total Revenue</div><strong>${(kpis.totalRevenue/100).toFixed(2)}</strong></Card>
          <Card><div>Total Expenses</div><strong>${(kpis.totalExpenses/100).toFixed(2)}</strong></Card>
          <Card><div>Profit</div><strong>${(kpis.profit/100).toFixed(2)}</strong></Card>
          <Card><div>Margin</div><strong>{kpis.marginPct.toFixed(1)}%</strong></Card>
        </div>
      ) : (
        <p>Loading KPIs...</p>
      )}
      <section aria-labelledby="ts-heading" style={{ marginTop: 24 }}>
        <h2 id="ts-heading">Revenue and Expenses over time</h2>
        {series ? (
          <Line data={{
            labels: series.labels,
            datasets: [
              { label: 'Revenue', data: series.revenue.map(v => v/100), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.2)' },
              { label: 'Expenses', data: series.expenses.map(v => v/100), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.2)' }
            ]
          }} options={{ responsive: true, plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } }, scales: { y: { title: { display: true, text: 'USD' } } } }} />
        ) : (
          <p>Loading time series...</p>
        )}
      </section>
    </main>
  );
}

