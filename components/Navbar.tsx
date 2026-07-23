'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0, 0, 0, 0.85)' }}>
      <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#fff', textDecoration: 'none' }}>
        QMZ<span style={{ color: '#ff2a85' }}>WERKZ</span>.ZIP
      </Link>
      <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 500, alignItems: 'center' }}>
        <Link href="/shop" style={{ color: isActive('/shop') ? '#ff2a85' : '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Shop</Link>
        <Link href="/cart" style={{ color: isActive('/cart') ? '#ff2a85' : '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Cart</Link>
        <Link href="/account" style={{ color: isActive('/account') ? '#ff2a85' : '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Account</Link>
        <Link href="/auth" style={{ color: isActive('/auth') ? '#ff2a85' : '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Sign In</Link>
        <Link href="/admin/marketplace" style={{ color: '#ff2a85', textDecoration: 'none', fontWeight: 600, background: 'rgba(255, 42, 133, 0.1)', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255, 42, 133, 0.3)' }}>
          Admin Panel
        </Link>
      </div>
    </nav>
  );
}