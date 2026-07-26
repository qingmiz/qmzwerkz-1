'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  cover_image?: string;
  zip_file?: string;
}

export default function CartContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('qmz_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  const removeFromCart = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem('qmz_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0' }}>QMZ WERKZ // Cart</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Review your items, then continue to checkout.</p>
      </header>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#888', fontSize: '15px', marginBottom: '20px' }}>Your cart is currently empty.</p>
          <Link href="/shop" style={{ background: '#ec4899', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none' }}>
            Browse Storefront
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', gap: '16px' }}>
                {item.cover_image && (
                  <img src={item.cover_image} alt={item.name} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', background: '#161616' }} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>{item.name}</h3>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#ec4899' }}>${item.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 16px 0' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '15px', fontWeight: '700' }}>
              <span>Total:</span>
              <span style={{ color: '#ec4899' }}>${totalPrice.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              style={{ display: 'block', textAlign: 'center', width: '100%', background: '#ec4899', color: '#fff', padding: '14px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' }}
            >
              Proceed to Checkout
            </Link>

            {signedIn === false && (
              <p style={{ fontSize: '12px', textAlign: 'center', color: '#f59e0b', margin: '0 0 16px 0' }}>
                You'll be asked to sign in with Discord at checkout.
              </p>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <p style={{ fontSize: '11px', color: '#888', textAlign: 'center', margin: 0 }}>
                Secure checkout powered by Tebex. Payment issue or manual delivery? <Link href="/support" style={{ color: '#ec4899', fontWeight: 600 }}>Open a ticket</Link>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
