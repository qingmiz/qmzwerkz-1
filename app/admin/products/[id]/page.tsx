'use client';

import { adminFetch } from '@/lib/admin-fetch';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [product, setProduct] = useState<any>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (data && !error) setProduct(data);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  const set = (field: string, value: any) => setProduct((prev: any) => ({ ...prev, [field]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus('Saving...');

    try {
      const form = new FormData();
      form.append('id', id);
      form.append('name', product.name || '');
      form.append('slug', product.slug || '');
      form.append('platform', product.platform || 'FiveM');
      form.append('category', product.category || '');
      form.append('subcategory', product.subcategory || '');
      form.append('status', product.status || 'draft');
      form.append('short_description', product.short_description || '');
      form.append('description', product.description || '');
      form.append('price', String(product.price ?? ''));
      form.append('sale_price', String(product.sale_price ?? ''));
      form.append('featured', String(!!product.featured));
      form.append('bestseller', String(!!product.bestseller));
      form.append('new_release', String(!!product.new_release));
      form.append('free_product', String(!!product.free_product));
      form.append('version', product.version || '');
      form.append('changelog', product.changelog || '');
      form.append('tebex_package_id', String(product.tebex_package_id ?? ''));
      if (coverFile) form.append('cover', coverFile);
      if (zipFile) form.append('zip', zipFile);

      const res = await adminFetch('/api/admin/products', { method: 'PATCH', body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save.');

      setStatus('Saved!');
      setTimeout(() => router.push('/admin/products'), 800);
    } catch (err: any) {
      setStatus(err.message ?? 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#000', color: '#888', padding: 40 }}>Loading...</div>;
  }

  if (!product) {
    return <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: 40 }}>Product not found.</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '40px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Edit Product</h1>
      <p style={{ color: '#888', marginBottom: 30 }}>{product.name}</p>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20, background: '#111', padding: 25, borderRadius: 12, border: '1px solid #222' }}>
        <input placeholder="Product Name" value={product.name || ''} onChange={(e) => set('name', e.target.value)} style={inputStyle} />
        <input placeholder="Slug" value={product.slug || ''} onChange={(e) => set('slug', e.target.value)} style={inputStyle} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 15 }}>
          <select value={product.platform || 'FiveM'} onChange={(e) => set('platform', e.target.value)} style={inputStyle}>
            <option>FiveM</option>
            <option>IMVU</option>
            <option>Second Life</option>
            <option>Roblox</option>
          </select>
          <input placeholder="Category" value={product.category || ''} onChange={(e) => set('category', e.target.value)} style={inputStyle} />
          <input placeholder="Subcategory" value={product.subcategory || ''} onChange={(e) => set('subcategory', e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <input placeholder="Price" type="number" value={product.price ?? ''} onChange={(e) => set('price', e.target.value)} style={inputStyle} />
          <input placeholder="Sale Price" type="number" value={product.sale_price ?? ''} onChange={(e) => set('sale_price', e.target.value)} style={inputStyle} />
        </div>

        <input placeholder="Short Description" value={product.short_description || ''} onChange={(e) => set('short_description', e.target.value)} style={inputStyle} />
        <textarea placeholder="Full Description" value={product.description || ''} onChange={(e) => set('description', e.target.value)} style={{ ...inputStyle, minHeight: 150 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <input placeholder="Version" value={product.version || ''} onChange={(e) => set('version', e.target.value)} style={inputStyle} />
          <select value={product.status || 'draft'} onChange={(e) => set('status', e.target.value)} style={inputStyle}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <textarea placeholder="Changelog" value={product.changelog || ''} onChange={(e) => set('changelog', e.target.value)} style={{ ...inputStyle, minHeight: 100 }} />

        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Tebex Package ID</label>
          <input placeholder="e.g. 6234567" value={product.tebex_package_id ?? ''} onChange={(e) => set('tebex_package_id', e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 15 }}>
          <label style={checkboxStyle}>
            <input type="checkbox" checked={!!product.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured
          </label>
          <label style={checkboxStyle}>
            <input type="checkbox" checked={!!product.bestseller} onChange={(e) => set('bestseller', e.target.checked)} /> Best Seller
          </label>
          <label style={checkboxStyle}>
            <input type="checkbox" checked={!!product.new_release} onChange={(e) => set('new_release', e.target.checked)} /> New Release
          </label>
          <label style={checkboxStyle}>
            <input type="checkbox" checked={!!product.free_product} onChange={(e) => set('free_product', e.target.checked)} /> Free Product
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 700 }}>Replace Cover Image</p>
            {product.cover_image && <img src={product.cover_image} alt="" style={{ width: 120, borderRadius: 8, marginBottom: 10 }} />}
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
          </div>
          <div>
            <p style={{ marginBottom: 8, fontWeight: 700 }}>Replace ZIP</p>
            {product.zip_file && <p style={{ color: '#888', fontSize: 12, marginBottom: 10 }}>Current file on record</p>}
            <input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>

        <button type="submit" disabled={saving} style={{ background: '#ec4899', color: '#fff', border: 'none', borderRadius: 10, padding: 16, fontWeight: 700, cursor: 'pointer', fontSize: 16 }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {status && <div style={{ background: '#161616', borderRadius: 8, padding: 12, textAlign: 'center' }}>{status}</div>}
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  background: '#161616',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
};

const checkboxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: '#161616',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #2a2a2a',
  cursor: 'pointer',
};
