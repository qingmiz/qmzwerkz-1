'use client';

import { adminFetch } from '@/lib/admin-fetch';
import { useEffect, useState } from 'react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string | null;
  active: boolean;
}

export default function AdminOurWorkPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const load = async () => {
    const res = await adminFetch('/api/admin/portfolio');
    const data = await res.json();
    if (res.ok) setItems(data.items);
    else setError(data.error || 'Failed to load projects.');
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('link_url', linkUrl);
    if (image) form.append('image', image);

    const res = await adminFetch('/api/admin/portfolio', { method: 'POST', body: form });
    setSaving(false);

    if (res.ok) {
      setTitle('');
      setDescription('');
      setLinkUrl('');
      setImage(null);
      setPreview('');
      setShowForm(false);
      load();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to add project.');
    }
  };

  const toggleActive = async (item: PortfolioItem) => {
    setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, active: !x.active } : x)));
    await adminFetch('/api/admin/portfolio', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, active: !item.active }),
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
    await adminFetch(`/api/admin/portfolio?id=${id}`, { method: 'DELETE' });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#090909', color: '#fff', padding: '40px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 'bold', marginBottom: '10px' }}>Our Work</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>Manage the portfolio shown on your homepage and Our Work page.</p>

      {error && <p style={{ color: '#ef4444', marginBottom: 20 }}>{error}</p>}

      <button
        onClick={() => setShowForm((v) => !v)}
        style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '25px' }}
      >
        {showForm ? 'Cancel' : '+ Add Project'}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', padding: '24px', marginBottom: '25px', maxWidth: 500 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={label_}>Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Custom FiveM Face Pack" style={input} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={label_}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this project was" style={{ ...input, minHeight: 80 }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={label_}>Link (optional)</label>
            <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://... (e.g. link to the product)" style={input} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={label_}>Screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
            {preview && <img src={preview} alt="" style={{ width: 160, marginTop: 10, borderRadius: 8 }} />}
          </div>
          <button type="submit" disabled={saving} style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {items.length === 0 ? (
          <p style={{ color: '#888' }}>No projects added yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: 14, overflow: 'hidden' }}>
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 140, background: '#1d1d1d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                  No image
                </div>
              )}
              <div style={{ padding: 16 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>{item.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => toggleActive(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.active ? '#10b981' : '#666', fontWeight: 700, fontSize: 12 }}>
                    {item.active ? 'Visible' : 'Hidden'}
                  </button>
                  <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

const label_: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 12, color: '#999' };
const input: React.CSSProperties = { width: '100%', padding: '10px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, color: '#fff' };
