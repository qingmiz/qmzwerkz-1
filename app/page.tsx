import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  const featuredDrops = [
    { id: 1, name: 'QMZ Obsidian Supercar Pack', category: 'Vehicles', price: '$49.99', image: '/api/placeholder/600/400' },
    { id: 2, name: 'Cyberpunk Neon Clothing Bundle', category: 'EUP / Clothing', price: '$29.99', image: '/api/placeholder/600/400' },
    { id: 3, name: 'Vortex Custom Dealership MLO', category: 'Maps / MLO', price: '$79.99', image: '/api/placeholder/600/400' },
  ];

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation Bar */}
      <nav style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0, 0, 0, 0.8)' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#fff' }}>
          QMZ<span style={{ color: '#ff2a85' }}>WERKZ</span>.ZIP
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 500 }}>
          <Link href="/shop" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Shop</Link>
          <Link href="/cart" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Cart</Link>
          <Link href="/auth" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Sign In</Link>
          <Link href="/admin/marketplace" style={{ color: '#ff2a85', textDecoration: 'none', fontWeight: 600 }}>Admin</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '8rem 2rem 6rem 2rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(255, 42, 133, 0.1)', border: '1px solid rgba(255, 42, 133, 0.3)', borderRadius: '50px', color: '#ff2a85', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
          NEXT-GEN FIVEM ASSET MARKETPLACE
        </div>
        <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
          Luxury Assets for <br />
          <span style={{ background: 'linear-gradient(135deg, #fff 30%, #ff2a85 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Elite Servers.
          </span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#888', maxWidth: '650px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
          Engineered for performance, styled for prestige. Discover custom vehicle packs, bespoke clothing bundles, and immersive maps with instant automated delivery.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/shop" style={{ background: '#ff2a85', color: '#fff', padding: '0.9rem 2.2rem', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 30px rgba(255, 42, 133, 0.4)', transition: 'transform 0.2s' }}>
            Explore Drops
          </Link>
          <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" style={{ background: 'transparent', color: '#fff', padding: '0.9rem 2.2rem', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            Join Discord
          </a>
        </div>
      </section>

      {/* Featured Drops Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5s' }}>Featured Drops</h2>
            <p style={{ color: '#777', fontSize: '0.95rem' }}>Handcrafted luxury modifications released this week.</p>
          </div>
          <Link href="/shop" style={{ color: '#ff2a85', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            View All Catalog &rarr;
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {featuredDrops.map((item) => (
            <div key={item.id} style={{ background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <div style={{ height: '220px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontWeight: 600 }}>
                [ Asset Preview ]
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#ff2a85', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.4rem', marginBottom: '1rem' }}>{item.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.price}</span>
                  <Link href="/shop" style={{ background: '#fff', color: '#000', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                    Secure Drop
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: '#050505', padding: '4rem 2rem', margin: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ff2a85', marginBottom: '0.5rem' }}>99.9%</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Automated Key Delivery</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>100+</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Elite Server Partners</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ff2a85', marginBottom: '0.5rem' }}>0ms</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Framework Latency</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>24/7</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Discord Support</div>
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem 6rem 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            QMZ<span style={{ color: '#ff2a85' }}>WERKZ</span>.ZIP
          </div>
          <p style={{ color: '#666', fontSize: '0.85rem' }}>&copy; 2026 QMZWERKZ. All rights reserved. Built for FiveM creators.</p>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: '#888' }}>
          <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Store</Link>
          <Link href="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>Cart</Link>
          <Link href="/auth" style={{ color: 'inherit', textDecoration: 'none' }}>Access</Link>
          <Link href="/admin/marketplace" style={{ color: 'inherit', textDecoration: 'none' }}>Control Panel</Link>
        </div>
      </footer>
    </div>
  );
}