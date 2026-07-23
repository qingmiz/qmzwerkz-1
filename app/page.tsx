'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff2a85', textTransform: 'uppercase', letterSpacing: '0.15em', background: 'rgba(255, 42, 133, 0.1)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255, 42, 133, 0.2)' }}>
          Luxury FiveM Marketplace
        </span>

        <h1 style={{ fontSize: '52px', fontWeight: 900, margin: '24px 0 16px 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          QMZ<span style={{ color: '#ff2a85', textShadow: '0 0 30px rgba(255, 42, 133, 0.4)' }}>WERKZ</span>.ZIP
        </h1>

        <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Engineered for elite FiveM server owners. High-performance custom scripts, optimized face and clothing packs, and automated instant-delivery asset management.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/shop" style={{ background: '#ff2a85', color: '#fff', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 25px rgba(255, 42, 133, 0.35)' }}>
            Explore Storefront
          </Link>
          <Link href="/admin/marketplace" style={{ background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
            Open Admin Panel
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginTop: '80px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px', textAlign: 'left' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Instant Delivery</h3>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Automated zip package handoffs and license key retrieval directly from your account portal.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Optimized Artifacts</h3>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Rigorously tested scripts and assets designed for zero lag and maximum client framerates.</p>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Creator Control</h3>
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Direct asset publishing, inventory management, and database synchronization via Supabase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}