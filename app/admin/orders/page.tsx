'use client';

import { adminFetch } from '@/lib/admin-fetch';

import { useEffect, useState } from 'react';

interface Order {
  id: string;
  customer: string;
  product_name: string;
  amount: number | null;
  status: string;
  cfx_username?: string | null;
  created_at: string;
}

const STATUS_OPTIONS = ['pending', 'completed', 'declined', 'refunded'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await adminFetch('/api/admin/orders');
    const data = await res.json();
    if (res.ok) {
      setOrders(data.orders);
    } else {
      setError(data.error || 'Failed to load orders.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    await adminFetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#090909', color: '#fff', padding: '40px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 'bold', marginBottom: '10px' }}>Orders</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>View and manage customer purchases.</p>

      {error && <p style={{ color: '#ef4444', marginBottom: 20 }}>{error}</p>}

      <div style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1d1d1d' }}>
              <th style={th}>Customer</th>
              <th style={th}>Cfx.re / FiveM</th>
              <th style={th}>Product</th>
              <th style={th}>Amount</th>
              <th style={th}>Date</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={td} colSpan={6}>Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td style={td} colSpan={6}>No orders yet.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td style={td}>{o.customer}</td>
                  <td style={td}>{o.cfx_username || '-'}</td>
                  <td style={td}>{o.product_name}</td>
                  <td style={td}>{o.amount != null ? `$${o.amount}` : '-'}</td>
                  <td style={td}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td style={td}>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      style={{
                        background: '#1d1d1d',
                        color: statusColor(o.status),
                        border: '1px solid #333',
                        borderRadius: 6,
                        padding: '6px 10px',
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function statusColor(status: string) {
  switch (status) {
    case 'completed': return '#10b981';
    case 'declined': return '#ef4444';
    case 'refunded': return '#f59e0b';
    default: return '#999';
  }
}

const th: React.CSSProperties = { padding: '16px', textAlign: 'left', color: '#999' };
const td: React.CSSProperties = { padding: '16px', borderTop: '1px solid #2b2b2b' };
