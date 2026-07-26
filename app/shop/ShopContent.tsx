'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  category: string;
  platform?: string;
  short_description: string;
  price: number;
  cover_image?: string;
  zip_file?: string;
  created_at?: string;
}

export default function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = (searchParams.get('q') || '').toLowerCase().trim();
  const categoryFilter = (searchParams.get('category') || '').toLowerCase().trim();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('qmz_cart') || '[]');
    const updatedCart = [...existingCart, product];
    localStorage.setItem('qmz_cart', JSON.stringify(updatedCart));
    setJustAdded(product);
  };

  const filteredProducts = products
    .filter((p) =>
      query
        ? [p.name, p.category, p.short_description]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(query))
        : true
    )
    .filter((p) =>
      categoryFilter
        ? [p.category, p.platform]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(categoryFilter))
        : true
    );

  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#000', color: '#fff' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}>QMZ WERKZ // Storefront</h1>
        <p style={{ color: '#888888', fontSize: '14px', margin: 0 }}>
          {query
            ? `Showing results for "${searchParams.get('q')}"`
            : categoryFilter
            ? `Category: ${searchParams.get('category')}`
            : 'Browse available FiveM assets and custom releases.'}
        </p>
      </header>

      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '60px' }}>Loading assets...</div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '60px', background: '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {query
            ? `No products match "${searchParams.get('q')}".`
            : categoryFilter
            ? `No products in "${searchParams.get('category')}" yet.`
            : 'No products published yet.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filteredProducts.map((p) => (
            <div key={p.id || 'prod'} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {p.cover_image && typeof p.cover_image === 'string' && (
                <div style={{ width: '100%', height: '180px', background: `url(${p.cover_image}) center/cover no-repeat #161616` }} />
              )}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#ec4899', textTransform: 'uppercase', marginBottom: '6px' }}>{p.category}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>{p.name}</h3>
                <p style={{ fontSize: '13px', color: '#888', margin: '0 0 16px 0', flex: 1 }}>{p.short_description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>${p.price}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => addToCart(p)}
                      style={{ background: '#222', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/shop/${p.id}`}
                      style={{ background: '#ec4899', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', display: 'inline-block' }}
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {justAdded && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setJustAdded(null)}
        >
          <div
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, maxWidth: 380, width: '90%', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Added to cart</h3>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>{justAdded.name}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => router.push('/checkout')}
                style={{ background: '#ec4899', color: '#fff', border: 'none', padding: 14, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Checkout
              </button>
              <button
                onClick={() => { setJustAdded(null); router.push('/shop'); }}
                style={{ background: '#222', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: 14, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
