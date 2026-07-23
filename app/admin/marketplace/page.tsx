'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hmxlzqirdfghlihgyynj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteGx6cWlyZGZnaGxpaGd5eW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjA1MDMsImV4cCI6MjEwMDI5NjUwM30.p5esFUDhbY8NXAYPBoY3TRBZmYwjjTCZ--IOh9SiNXg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminMarketplace() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Scripts');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUploadAndPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Uploading assets to Supabase storage...');

    try {
      let coverImageUrl = '';
      let zipFileUrl = '';

      // 1. Upload Cover Image if selected
      if (coverFile) {
        const fileName = `${Date.now()}-${coverFile.name}`;
        const { error: coverError } = await supabase.storage
          .from('product-images')
          .upload(fileName, coverFile);

        if (coverError) throw coverError;

        const { data: publicURLData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        coverImageUrl = publicURLData.publicUrl;
      }

      // 2. Upload Asset Zip file if selected
      if (zipFile) {
        const zipName = `${Date.now()}-${zipFile.name}`;
        const { error: zipError } = await supabase.storage
          .from('product-files')
          .upload(zipName, zipFile);

        if (zipError) throw zipError;

        const { data: publicZipData } = supabase.storage
          .from('product-files')
          .getPublicUrl(zipName);
          
        zipFileUrl = publicZipData.publicUrl;
      }

      setStatus('Saving product record...');

      // 3. Insert product row into Supabase
      const { error: dbError } = await supabase.from('products').insert([
        {
          name,
          category,
          short_description: description,
          price: parseFloat(price) || 0,
          cover_image: coverImageUrl,
          zip_file: zipFileUrl,
        },
      ]);

      if (dbError) throw dbError;

      setStatus('Success! Product published to QMZWERKZ storefront.');
      setName('');
      setDescription('');
      setPrice('');
      setCoverFile(null);
      setZipFile(null);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>QMZ WERKZ // Admin Asset Manager</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Upload preview work, bundle packages, and release directly to store.</p>
      </header>

      <form onSubmit={handleUploadAndPublish} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#ccc' }}>Asset Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., QMZ Luxury Face Pack Vol. 1"
            style={{ width: '100%', padding: '12px', background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#ccc' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
            >
              <option value="Scripts">Scripts</option>
              <option value="Clothing Packs">Clothing Packs</option>
              <option value="Face Packs">Face Packs</option>
              <option value="Weapons">Weapons</option>
              <option value="Maps & MLOs">Maps & MLOs</option>
              <option value="Vehicles">Vehicles</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#ccc' }}>Price ($ USD)</label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="19.99"
              style={{ width: '100%', padding: '12px', background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#ccc' }}>Short Description</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optimized 4K FiveM asset package..."
            style={{ width: '100%', padding: '12px', background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#ccc' }}>Display Image (.png / .jpg)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              style={{ width: '100%', padding: '10px', background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#ccc' }}>Deliverable Asset Package (.zip)</label>
            <input
              type="file"
              accept=".zip,.rar,.7z"
              onChange={(e) => setZipFile(e.target.files?.[0] || null)}
              style={{ width: '100%', padding: '10px', background: '#161616', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: '#ec4899', color: '#fff', padding: '14px', borderRadius: '8px', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '15px', marginTop: '10px' }}
        >
          {loading ? 'Publishing Release...' : 'Upload & Publish Asset'}
        </button>

        {status && (
          <p style={{ textAlign: 'center', fontSize: '13px', margin: '8px 0 0 0', color: status.includes('Success') ? '#10b981' : '#ec4899' }}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}