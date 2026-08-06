'use client';

import { adminFetch } from '@/lib/admin-fetch';

import { useEffect, useState } from 'react';

interface Prize {
  id: string;
  label: string;
  icon: string;
  description: string | null;
  weight: number;
  active: boolean;
  sort_order: number;
  auto_discount_percent: number | null;
  auto_discount_amount: number | null;
}

interface Spin {
  id: string;
  discord_username: string;
  discord_id: string;
  prize: string;
  claim_code: string;
  claimed: boolean;
  created_at: string;
}

export default function AdminLuckyWheelPage() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [spins, setSpins] = useState<Spin[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('🎁');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('10');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [prizesRes, spinsRes] = await Promise.all([
      adminFetch('/api/admin/wheel-prizes'),
      adminFetch('/api/admin/wheel-spins'),
    ]);
    const prizesData = await prizesRes.json();
    const spinsData = await spinsRes.json();

    if (prizesRes.ok) setPrizes(prizesData.prizes);
    else setError(prizesData.error || 'Failed to load prizes.');

    if (spinsRes.ok) setSpins(spinsData.spins);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await adminFetch('/api/admin/wheel-prizes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, icon, description, weight: parseInt(weight, 10), sortOrder: prizes.length }),
    });

    setSaving(false);

    if (res.ok) {
      setLabel('');
      setIcon('🎁');
      setDescription('');
      setWeight('10');
      setShowForm(false);
      load();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to create prize.');
    }
  };

  const toggleActive = async (p: Prize) => {
    setPrizes((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
    await adminFetch('/api/admin/wheel-prizes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, active: !p.active }),
    });
  };

  const updateWeight = async (p: Prize, newWeight: number) => {
    setPrizes((prev) => prev.map((x) => (x.id === p.id ? { ...x, weight: newWeight } : x)));
    await adminFetch('/api/admin/wheel-prizes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, weight: newWeight }),
    });
  };

  const updateAutoDiscount = async (p: Prize, field: 'auto_discount_percent' | 'auto_discount_amount', value: string) => {
    const num = value === '' ? null : parseFloat(value);
    // Setting one clears the other - a prize is either % off or $ off, not both.
    const updates: Record<string, unknown> =
      field === 'auto_discount_percent'
        ? { auto_discount_percent: num, auto_discount_amount: num ? null : p.auto_discount_amount }
        : { auto_discount_amount: num, auto_discount_percent: num ? null : p.auto_discount_percent };

    setPrizes((prev) => prev.map((x) => (x.id === p.id ? { ...x, ...updates } as Prize : x)));
    await adminFetch('/api/admin/wheel-prizes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, ...updates }),
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this prize?')) return;
    setPrizes((prev) => prev.filter((p) => p.id !== id));
    await adminFetch(`/api/admin/wheel-prizes?id=${id}`, { method: 'DELETE' });
  };

  const toggleClaimed = async (s: Spin) => {
    setSpins((prev) => prev.map((x) => (x.id === s.id ? { ...x, claimed: !x.claimed } : x)));
    await adminFetch('/api/admin/wheel-spins', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: s.id, claimed: !s.claimed }),
    });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#090909', color: '#fff', padding: '40px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 'bold', marginBottom: '10px' }}>Lucky Wheel</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>Manage prizes and view spin winners.</p>

      {error && <p style={{ color: '#ef4444', marginBottom: 20 }}>{error}</p>}

      {prizes.length === 0 && (
        <div style={{ background: '#1a1200', border: '1px solid #443300', borderRadius: 10, padding: 16, marginBottom: 24, color: '#facc15', fontSize: 13 }}>
          No prizes in the database yet - the live wheel is showing a built-in default set. Add prizes below to take control of it.
        </div>
      )}

      <button
        onClick={() => setShowForm((v) => !v)}
        style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '25px' }}
      >
        {showForm ? 'Cancel' : '+ Add Prize'}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', padding: '24px', marginBottom: '25px', display: 'grid', gridTemplateColumns: '80px 1fr 1fr 100px', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={label_}>Icon</label>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} style={input} />
          </div>
          <div>
            <label style={label_}>Prize Name</label>
            <input required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Premium Skin" style={input} />
          </div>
          <div>
            <label style={label_}>Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What the winner gets" style={input} />
          </div>
          <div>
            <label style={label_}>Weight</label>
            <input required type="number" min={1} value={weight} onChange={(e) => setWeight(e.target.value)} style={input} />
          </div>
          <button type="submit" disabled={saving} style={{ gridColumn: '1 / -1', background: '#ec4899', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {saving ? 'Saving...' : 'Save Prize'}
          </button>
        </form>
      )}

      <div style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', overflow: 'hidden', marginBottom: 40 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1d1d1d' }}>
              <th style={th}>Prize</th>
              <th style={th}>Weight (odds)</th>
              <th style={th}>Auto-Discount (% or $)</th>
              <th style={th}>Status</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((p) => (
              <tr key={p.id}>
                <td style={td}>{p.icon} {p.label}</td>
                <td style={td}>
                  <input
                    type="number"
                    min={1}
                    value={p.weight}
                    onChange={(e) => updateWeight(p, parseInt(e.target.value, 10) || 1)}
                    style={{ ...input, width: 70 }}
                  />
                </td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="%"
                      value={p.auto_discount_percent ?? ''}
                      onChange={(e) => updateAutoDiscount(p, 'auto_discount_percent', e.target.value)}
                      style={{ ...input, width: 55 }}
                    />
                    <span style={{ color: '#555', fontSize: 12 }}>or</span>
                    <input
                      type="number"
                      min={0}
                      placeholder="$"
                      value={p.auto_discount_amount ?? ''}
                      onChange={(e) => updateAutoDiscount(p, 'auto_discount_amount', e.target.value)}
                      style={{ ...input, width: 55 }}
                    />
                  </div>
                  {(p.auto_discount_percent || p.auto_discount_amount) ? (
                    <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>Auto-applies at checkout</div>
                  ) : (
                    <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Manual (Discord ticket)</div>
                  )}
                </td>
                <td style={td}>
                  <button onClick={() => toggleActive(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.active ? '#10b981' : '#666', fontWeight: 700 }}>
                    {p.active ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td style={td}>
                  <button onClick={() => remove(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Recent Winners</h2>

      <div style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1d1d1d' }}>
              <th style={th}>Discord User</th>
              <th style={th}>Prize</th>
              <th style={th}>Claim Code</th>
              <th style={th}>Date</th>
              <th style={th}>Redeemed</th>
            </tr>
          </thead>
          <tbody>
            {spins.length === 0 ? (
              <tr><td style={td} colSpan={5}>No spins yet.</td></tr>
            ) : (
              spins.map((s) => (
                <tr key={s.id}>
                  <td style={td}>{s.discord_username}</td>
                  <td style={td}>{s.prize}</td>
                  <td style={{ ...td, fontFamily: 'monospace' }}>{s.claim_code}</td>
                  <td style={td}>{new Date(s.created_at).toLocaleString()}</td>
                  <td style={td}>
                    <button onClick={() => toggleClaimed(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.claimed ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                      {s.claimed ? 'Redeemed' : 'Pending'}
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
const label_: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 12, color: '#999' };
const input: React.CSSProperties = { width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, color: '#fff' };
