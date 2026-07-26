'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  short_description: string;
  description?: string;
  price: number;
  cover_image?: string;
  zip_file?: string;
  requirements?: string;
  installation_guide?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (data && !error) {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const addToCart = (prod: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('qmz_cart') || '[]');
    const updatedCart = [...existingCart, prod];
    localStorage.setItem('qmz_cart', JSON.stringify(updatedCart));
    setJustAdded(true);
  };

  const handleDownload = async (productId: string) => {
    const res = await fetch(`/api/download/${productId}`);
    if (res.ok) {
      window.location.href = res.url;
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'You need to purchase this product first.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading product specification...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', padding: '60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Asset Not Found</h2>
        <p style={{ color: '#888', marginBottom: '24px' }}>The requested drop could not be retrieved from the catalog.</p>
        <Link href="/shop" style={{ color: '#ff2a85', textDecoration: 'none', fontWeight: 600 }}>&larr; Return to Storefront</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#000', color: '#fff' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/shop" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          &larr; Back to Marketplace
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        {/* Media / Carousel Preview */}
        <div>
          <div style={{ width: '100%', height: '380px', background: product.cover_image ? `url(${product.cover_image}) center/cover no-repeat #111` : '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontWeight: 600 }}>
            {!product.cover_image && '[ Immersive Preview Carousel ]'}
          </div>
        </div>

        {/* Product Details & Purchase Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff2a85', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>{product.name}</h1>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>
            ${product.price}
          </div>
          <p style={{ fontSize: '15px', color: '#aaa', lineHeight: 1.6, marginBottom: '24px' }}>
            {product.description || product.short_description || 'High-end custom asset designed for optimized server performance.'}
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <button
              onClick={() => addToCart(product)}
              style={{ background: '#ff2a85', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(255, 42, 133, 0.3)' }}
            >
              Add to Cart
            </button>
            {product.zip_file && (
              <button
                onClick={() => handleDownload(product.id)}
                style={{ background: '#222', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                Download (requires purchase)
              </button>
            )}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0', color: '#ddd' }}>Compatibility & Requirements</h4>
              <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{product.requirements || 'Compatible with standard FiveM server artifacts and current game builds.'}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0', color: '#ddd' }}>Installation Guide</h4>
              <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>{product.installation_guide || 'Drag and drop resource folder into your server resources directory and ensure it in server.cfg.'}</p>
            </div>
          </div>
        </div>
      </div>

      {justAdded && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setJustAdded(false)}
        >
          <div
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, maxWidth: 380, width: '90%', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Added to cart</h3>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>{product.name}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => router.push('/checkout')}
                style={{ background: '#ec4899', color: '#fff', border: 'none', padding: 14, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                Checkout
              </button>
              <button
                onClick={() => { setJustAdded(false); router.push('/shop'); }}
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