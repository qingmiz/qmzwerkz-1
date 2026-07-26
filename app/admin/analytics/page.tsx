'use client';

import { adminFetch } from '@/lib/admin-fetch';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  revenue: number;
  completedOrders: number;
  pendingOrders: number;
  totalProducts: number;
  uniqueCustomers: number;
  dailyRevenue: { date: string; revenue: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const res = await adminFetch('/api/admin/analytics');
      const json = await res.json();
      if (res.ok) setData(json);
      else setError(json.error || 'Failed to load analytics.');
    }
    load();
  }, []);

  const maxRevenue = Math.max(1, ...(data?.dailyRevenue.map((d) => d.revenue) ?? [1]));

  return (
    <main style={{ minHeight: '100vh', background: '#090909', color: '#fff', padding: '40px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 'bold', marginBottom: '10px' }}>Analytics</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>Monitor your marketplace performance.</p>

      {error && <p style={{ color: '#ef4444', marginBottom: 20 }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Revenue', value: data ? `$${data.revenue.toFixed(2)}` : '--' },
          { label: 'Completed Orders', value: data ? String(data.completedOrders) : '--' },
          { label: 'Pending Orders', value: data ? String(data.pendingOrders) : '--' },
          { label: 'Customers', value: data ? String(data.uniqueCustomers) : '--' },
        ].map((card) => (
          <div key={card.label} style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', padding: '24px' }}>
            <div style={{ color: '#999', marginBottom: '10px' }}>{card.label}</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ec4899' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', padding: '24px' }}>
        <h2 style={{ marginBottom: '20px' }}>Revenue - Last 14 Days</h2>

        {data ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '160px' }}>
            {data.dailyRevenue.map((d) => (
              <div key={d.date} style={{ flex: 1, textAlign: 'center' }} title={`${d.date}: $${d.revenue.toFixed(2)}`}>
                <div
                  style={{
                    height: `${Math.max(4, (d.revenue / maxRevenue) * 140)}px`,
                    background: d.revenue > 0 ? '#ec4899' : '#2a2a2a',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <div style={{ fontSize: '9px', color: '#666', marginTop: '6px' }}>
                  {new Date(d.date).getDate()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#888' }}>Loading...</p>
        )}

        <p style={{ color: '#666', fontSize: '12px', marginTop: '16px' }}>
          Note: visitor/traffic tracking isn't wired up yet - these numbers reflect real orders only.
        </p>
      </div>
    </main>
  );
}
