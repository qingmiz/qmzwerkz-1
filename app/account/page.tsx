'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Order {
  id: string;
  created_at: string;
  status: string;
  product_id: string;
  product_name?: string;
  product_price?: number;
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (data && !error) {
          const productIds = [...new Set(data.map((o) => o.product_id))];
          const { data: products } = await supabase
            .from('products')
            .select('id, name, price')
            .in('id', productIds.length ? productIds : ['00000000-0000-0000-0000-000000000000']);

          const productMap = new Map((products ?? []).map((p) => [p.id, p]));

          setOrders(
            data.map((o) => ({
              ...o,
              product_name: productMap.get(o.product_id)?.name ?? 'Unknown product',
              product_price: productMap.get(o.product_id)?.price,
            }))
          );
        }
      }
      setLoading(false);
    }
    fetchUserData();
  }, []);

  const handleDownload = async (productId: string) => {
    const res = await fetch(`/api/download/${productId}`);
    if (res.ok) {
      window.location.href = res.url;
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Could not start download.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading account portal...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Authentication Required</h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>Please sign in to access your downloaded assets and active license keys.</p>
        <Link href="/login" style={{ background: '#ff2a85', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
          Sign In / Register
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', padding: '40px', maxWidth: '1000px', margin: '0 auto', background: '#000', color: '#fff' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px 0' }}>My Account</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Signed in as <span style={{ color: '#fff' }}>{user.email}</span></p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0' }}>Active Licenses & Downloads</h3>
          {orders.length === 0 ? (
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>No orders registered to this account yet. Explore the <Link href="/shop" style={{ color: '#ff2a85', textDecoration: 'none' }}>Storefront</Link> to secure your first release.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map((order) => (
                <div key={order.id} style={{ background: '#161616', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{order.product_name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{new Date(order.created_at).toLocaleDateString()} · {order.status}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {order.product_price != null && (
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#ff2a85' }}>${order.product_price}</span>
                    )}
                    {order.status === 'completed' ? (
                      <button onClick={() => handleDownload(order.product_id)} style={{ background: '#222', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        Download Zip
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>{order.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
