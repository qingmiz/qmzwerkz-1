'use client';

import { useEffect, useState } from 'react';

interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  active: boolean;
}

export default function PromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/promo-codes');
    const data = await res.json();
    if (res.ok) setCodes(data.promoCodes);
    else setError(data.error || 'Failed to load promo codes.');
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch('/api/admin/promo-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        discountPercent: parseInt(discountPercent, 10),
        maxUses: maxUses ? parseInt(maxUses, 10) : null,
        expiresAt: expiresAt || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setCode('');
      setDiscountPercent('');
      setMaxUses('');
      setExpiresAt('');
      setShowForm(false);
      load();
    } else {
      setError(data.error || 'Failed to create promo code.');
    }
  };

  const toggleActive = async (c: PromoCode) => {
    setCodes((prev) => prev.map((p) => (p.id === c.id ? { ...p, active: !p.active } : p)));
    await fetch('/api/admin/promo-codes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: c.id, active: !c.active }),
    });
  };

  const remove = async (id: string) => {
    setCodes((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/admin/promo-codes?id=${id}`, { method: 'DELETE' });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#090909', color: '#fff', padding: '40px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 'bold', marginBottom: '10px' }}>Promo Codes</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>Create and manage discounts for your marketplace.</p>

      {error && <p style={{ color: '#ef4444', marginBottom: 20 }}>{error}</p>}

      <button
        onClick={() => setShowForm((v) => !v)}
        style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '25px' }}
      >
        {showForm ? 'Cancel' : '+ Create Promo Code'}
      </button>

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', padding: '24px', marginBottom: '25px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', alignItems: 'end' }}
        >
          <div>
            <label style={label}>Code</label>
            <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="SAVE20" style={input} />
          </div>
          <div>
            <label style={label}>Discount %</label>
            <input required type="number" min={1} max={100} value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="20" style={input} />
          </div>
          <div>
            <label style={label}>Max Uses (optional)</label>
            <input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Unlimited" style={input} />
          </div>
          <div>
            <label style={label}>Expires (optional)</label>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} style={input} />
          </div>
          <button type="submit" disabled={saving} style={{ gridColumn: '1 / -1', background: '#ec4899', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {saving ? 'Saving...' : 'Save Promo Code'}
          </button>
        </form>
      )}

      <div style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1d1d1d' }}>
              <th style={th}>Code</th>
              <th style={th}>Discount</th>
              <th style={th}>Uses</th>
              <th style={th}>Expires</th>
              <th style={th}>Status</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={td} colSpan={6}>Loading...</td></tr>
            ) : codes.length === 0 ? (
              <tr><td style={td} colSpan={6}>No promo codes yet.</td></tr>
            ) : (
              codes.map((c) => (
                <tr key={c.id}>
                  <td style={{ ...td, fontFamily: 'monospace', fontWeight: 700 }}>{c.code}</td>
                  <td style={td}>{c.discount_percent}%</td>
                  <td style={td}>{c.uses_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                  <td style={td}>{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</td>
                  <td style={td}>
                    <button
                      onClick={() => toggleActive(c)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.active ? '#10b981' : '#666', fontWeight: 700 }}
                    >
                      {c.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td style={td}>
                    <button onClick={() => remove(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      Delete
                    </button>
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

const th: React.CSSProperties = { padding: '16px', textAlign: 'left', color: '#999' };
const td: React.CSSProperties = { padding: '16px', borderTop: '1px solid #2b2b2b' };
const label: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 12, color: '#999' };
const input: React.CSSProperties = { width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, color: '#fff' };
