'use client';

import { adminFetch } from '@/lib/admin-fetch';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Analytics {
  revenue: number;
  completedOrders: number;
  pendingOrders: number;
  totalProducts: number;
  uniqueCustomers: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product_name: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);

  useEffect(() => {
    async function load() {
      const [analyticsRes, ordersRes] = await Promise.all([
        adminFetch('/api/admin/analytics'),
        adminFetch('/api/admin/orders'),
      ]);

      const analytics = await analyticsRes.json();
      const orders = await ordersRes.json();

      if (analyticsRes.ok) setData(analytics);
      if (ordersRes.ok) setRecent((orders.orders ?? []).slice(0, 5));
    }
    load();
  }, []);

  const cards = [
    { title: 'Total Revenue', value: data ? `$${data.revenue.toFixed(2)}` : '--' },
    { title: 'Completed Orders', value: data ? String(data.completedOrders) : '--' },
    { title: 'Products', value: data ? String(data.totalProducts) : '--' },
    { title: 'Customers', value: data ? String(data.uniqueCustomers) : '--' },
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#090909', color: '#fff', padding: '40px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 700, marginBottom: 8 }}>QMZWERKZ Admin Dashboard</h1>
      <p style={{ color: '#888', marginBottom: 40 }}>Welcome back. Here's what's happening with your marketplace.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
        {cards.map((card) => (
          <div key={card.title} style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: 14, padding: 25 }}>
            <div style={{ color: '#999', marginBottom: 12 }}>{card.title}</div>
            <div style={{ fontSize: 34, fontWeight: 'bold', color: '#ec4899' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, background: '#151515', borderRadius: 14, border: '1px solid #2b2b2b', padding: 25 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>Recent Orders</h2>
          <Link href="/admin/orders" style={{ color: '#ec4899', fontSize: 13, textDecoration: 'none', fontWeight: 700 }}>
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p style={{ color: '#888' }}>No activity yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent.map((o) => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{o.product_name}</div>
                  <div style={{ color: '#888', fontSize: 12 }}>{o.customer}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: o.status === 'completed' ? '#10b981' : '#f59e0b', fontWeight: 700, fontSize: 12 }}>
                    {o.status}
                  </div>
                  <div style={{ color: '#666', fontSize: 11 }}>{new Date(o.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
