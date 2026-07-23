'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hmxlzqirdfghlihgyynj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteGx6cWlyZGZnaGxpaGd5eW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjA1MDMsImV4cCI6MjEwMDI5NjUwM30.p5esFUDhbY8NXAYPBoY3TRBZmYwjjTCZ--IOh9SiNXg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CartItem {
  id: string;
  name: string;
  price: number;
  cover_image?: string;
  zip_file?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState('');

  useEffect(() => {
    // Load local cart storage if available
    const savedCart = localStorage.getItem('qmz_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const removeFromCart = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem('qmz_cart', JSON.stringify(updated));
  };

  const handleSimulatedCheckout = async () => {
    setLoading(true);
    setCheckoutStatus('Processing transaction & verifying secure asset release...');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setCheckoutStatus('Error: Please sign in at /auth before completing your purchase for automatic downloads.');
      setLoading(false);
      return;
    }

    try {
      for (const item of cart) {
        await supabase.from('orders').insert([
          {
            user_id: user.id,
            product_id: item.id,
            status: 'completed',
            payment_method: 'card_or_fallback',
          },
        ]);
      }

      setCheckoutStatus('Success! Order verified. Your instant downloads are ready below.');
      localStorage.removeItem('qmz_cart');
    } catch (err: any) {
      setCheckoutStatus(`Checkout Error: ${err.message}. Please use alternative payment below.`);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0' }}>QMZ WERKZ // Secure Checkout & Cart</h1>
        <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>Review items, complete order, or access alternative payment routing.</p>
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

            <button
              onClick={handleSimulatedCheckout}
              disabled={loading}
              style={{ width: '100%', background: '#ec4899', color: '#fff', padding: '14px', borderRadius: '8px', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '14px', marginBottom: '16px' }}
            >
              {loading ? 'Processing...' : 'Complete Secure Checkout'}
            </button>

            {checkoutStatus && (
              <p style={{ fontSize: '12px', lineHeight: '1.4', textAlign: 'center', margin: '0 0 16px 0', color: checkoutStatus.includes('Success') ? '#10b981' : '#ec4899' }}>
                {checkoutStatus}
              </p>
            )}

            {/* Alternative Payment & Discord Routing Fallbacks */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <p style={{ fontSize: '11px', color: '#888', margin: '0 0 10px 0', textAlign: 'center' }}>Alternative Direct Payment Methods</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '12px' }}>
                <span style={{ background: '#161616', padding: '6px', borderRadius: '6px', textAlign: 'center', fontSize: '11px', border: '1px solid rgba(255,255,255,0.06)' }}>PayPal</span>
                <span style={{ background: '#161616', padding: '6px', borderRadius: '6px', textAlign: 'center', fontSize: '11px', border: '1px solid rgba(255,255,255,0.06)' }}>CashApp</span>
                <span style={{ background: '#161616', padding: '6px', borderRadius: '6px', textAlign: 'center', fontSize: '11px', border: '1px solid rgba(255,255,255,0.06)' }}>ApplePay</span>
              </div>
              <p style={{ fontSize: '11px', color: '#ec4899', textAlign: 'center', margin: 0, fontWeight: '600' }}>
                Payment error or manual asset delivery? Open a ticket on Discord.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}