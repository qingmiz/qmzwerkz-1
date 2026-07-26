'use client';

import { useEffect, useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  spent: number;
  joined: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (res.ok) {
        setCustomers(data.customers);
      } else {
        setError(data.error || 'Failed to load customers.');
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#090909', color: '#fff', padding: '40px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 'bold', marginBottom: '10px' }}>Customers</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>Manage your marketplace customers.</p>

      {error && <p style={{ color: '#ef4444', marginBottom: 20 }}>{error}</p>}

      <div style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1d1d1d' }}>
              <th style={th}>Customer</th>
              <th style={th}>Email</th>
              <th style={th}>Orders</th>
              <th style={th}>Spent</th>
              <th style={th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={td} colSpan={5}>Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td style={td} colSpan={5}>No customers yet.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id}>
                  <td style={td}>{c.name}</td>
                  <td style={td}>{c.email}</td>
                  <td style={td}>{c.orderCount}</td>
                  <td style={td}>${c.spent.toFixed(2)}</td>
                  <td style={td}>{new Date(c.joined).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const th: React.CSSProperties = { padding: '16px', textAlign: 'left', color: '#999' };
const td: React.CSSProperties = { padding: '16px', borderTop: '1px solid #2b2b2b' };
