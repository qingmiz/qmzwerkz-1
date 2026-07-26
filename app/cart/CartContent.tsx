'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('status'); // 'complete' | 'cancelled' from Tebex redirect

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
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

  const handleCheckout = async () => {
    setLoading(true);
    setCheckoutStatus('Preparing secure Tebex checkout...');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setCheckoutStatus('Please sign in with Discord before checking out.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: cart.map((item) => item.id) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed.');
      }

      const Tebex = (window as any).Tebex;

      if (!Tebex) {
        // Fallback if the embedded script hasn't loaded for some reason.
        window.location.href = data.checkoutUrl;
        return;
      }

      Tebex.checkout.init({ ident: data.ident });

      Tebex.checkout.on('payment:complete', () => {
        localStorage.removeItem('qmz_cart');
        setCart([]);
        setPaymentComplete(true);
        setLoading(false);
      });

      Tebex.checkout.on('payment:error', () => {
        setCheckoutStatus('Payment failed or was declined. No charge was made.');
        setLoading(false);
      });

      Tebex.checkout.on('close', () => {
        setLoading(false);
      });

      setCheckoutStatus('');
      Tebex.checkout.launch();
    } catch (err: any) {
      setCheckoutStatus(`Checkout Error: ${err.message}`);
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

      {(paymentComplete || paymentStatus === 'complete') && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ color: '#10b981', fontWeight: 700, margin: '0 0 6px 0' }}>Payment received!</p>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
            Your order is being confirmed - it'll appear in <Link href="/account" style={{ color: '#10b981' }}>My Account</Link> once Tebex verifies the payment (usually within moments).
          </p>
        </div>
      )}

      {paymentStatus === 'cancelled' && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontWeight: 700, margin: 0 }}>Checkout was cancelled - no payment was taken.</p>
        </div>
      )}

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
              onClick={handleCheckout}
              disabled={loading}
              style={{ width: '100%', background: '#ec4899', color: '#fff', padding: '14px', borderRadius: '8px', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '14px', marginBottom: '16px' }}
            >
              {loading ? 'Opening secure checkout...' : 'Checkout with Tebex'}
            </button>

            {checkoutStatus && (
              <p style={{ fontSize: '12px', lineHeight: '1.4', textAlign: 'center', margin: '0 0 16px 0', color: checkoutStatus.includes('Success') ? '#10b981' : '#ec4899' }}>
                {checkoutStatus}
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
