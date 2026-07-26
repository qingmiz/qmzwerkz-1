'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface CartItem {
  id: string;
  name: string;
  price: number;
  cover_image?: string;
}

type PaymentMethod = 'tebex' | 'paypal';

export default function CheckoutPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [paying, setPaying] = useState(false);
  const [status, setStatus] = useState('');
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [paidItems, setPaidItems] = useState<CartItem[] | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<Record<string, string>>({});
  const paypalContainerRef = React.useRef<HTMLDivElement>(null);

  const paypalConfigured = !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoadingUser(false);
    }
    init();

    const savedCart = localStorage.getItem('qmz_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        // ignore malformed cart
      }
    }
  }, []);

  // Render the PayPal button only once the user has chosen PayPal on the summary step.
  useEffect(() => {
    if (method !== 'paypal' || !paypalConfigured || cart.length === 0 || paidItems) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    function renderButtons() {
      const paypal = (window as any).paypal;
      if (!paypal || !paypalContainerRef.current) return;

      paypalContainerRef.current.innerHTML = '';

      paypal
        .Buttons({
          style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
          createOrder: async () => {
            setPaymentFailed(false);
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productIds: cart.map((item) => item.id) }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Could not start PayPal checkout.');
            return data.paypalOrderId;
          },
          onApprove: async (data: { orderID: string }) => {
            setPaying(true);
            setStatus('Confirming payment with PayPal...');

            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paypalOrderId: data.orderID }),
            });

            setPaying(false);
            setStatus('');

            if (!res.ok) {
              setPaymentFailed(true);
              return;
            }

            localStorage.removeItem('qmz_cart');
            setPaidItems(cart);
            setCart([]);
          },
          onError: () => {
            setPaymentFailed(true);
            setPaying(false);
          },
          onCancel: () => {
            setPaying(false);
          },
        })
        .render(paypalContainerRef.current);
    }

    if ((window as any).paypal) {
      renderButtons();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.onload = renderButtons;
    document.body.appendChild(script);
  }, [method, paypalConfigured, cart, paidItems]);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayTebex = async () => {
    setPaying(true);
    setPaymentFailed(false);
    setStatus('Preparing secure Tebex checkout...');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: cart.map((item) => item.id) }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Checkout failed.');

      const Tebex = (window as any).Tebex;

      if (!Tebex) {
        window.location.href = data.checkoutUrl;
        return;
      }

      Tebex.checkout.init({ ident: data.ident });

      Tebex.checkout.on('payment:complete', () => {
        localStorage.removeItem('qmz_cart');
        setPaidItems(cart);
        setCart([]);
        setStatus('');
        setPaying(false);
      });

      Tebex.checkout.on('payment:error', () => {
        setStatus('');
        setPaymentFailed(true);
        setPaying(false);
      });

      Tebex.checkout.on('close', () => {
        setPaying(false);
      });

      setStatus('');
      Tebex.checkout.launch();
    } catch (err: any) {
      setStatus(`Checkout Error: ${err.message}`);
      setPaying(false);
    }
  };

  const handleDownload = async (productId: string, attempt = 1) => {
    setDownloadStatus((s) => ({ ...s, [productId]: 'Preparing your download...' }));

    const res = await fetch(`/api/download/${productId}`);

    if (res.ok) {
      setDownloadStatus((s) => ({ ...s, [productId]: '' }));
      window.location.href = res.url;
      return;
    }

    if (attempt < 5) {
      setDownloadStatus((s) => ({ ...s, [productId]: 'Confirming your payment...' }));
      setTimeout(() => handleDownload(productId, attempt + 1), 2500);
      return;
    }

    setDownloadStatus((s) => ({
      ...s,
      [productId]: 'Still confirming - check My Account in a moment, or contact support if this persists.',
    }));
  };

  const retry = () => {
    setPaymentFailed(false);
    setStatus('');
    if (method === 'tebex') handlePayTebex();
    // For PayPal, the freshly re-rendered button is the retry path - nothing else to trigger.
  };

  if (loadingUser) {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#888' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Sign in to check out</h2>
        <p style={{ color: '#888', marginBottom: 24 }}>You'll need a Discord account to complete your purchase.</p>
        <Link href="/login" style={{ background: '#5865F2', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
          Continue with Discord
        </Link>
      </div>
    );
  }

  // Post-payment view: confirmation + direct downloads.
  if (paidItems) {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', padding: '60px 20px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 40 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '12px 0 6px' }}>Payment received!</h1>
          <p style={{ color: '#888' }}>Thanks for your purchase. Your downloads are ready below.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paidItems.map((item) => (
            <div key={item.id} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.name}</div>
                {downloadStatus[item.id] && (
                  <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 4 }}>{downloadStatus[item.id]}</div>
                )}
              </div>
              <button
                onClick={() => handleDownload(item.id)}
                style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Download
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/shop" style={{ color: '#ec4899', fontWeight: 700, textDecoration: 'none' }}>
            ← Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Your cart is empty</h2>
        <Link href="/shop" style={{ background: '#ec4899', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
          Browse Storefront
        </Link>
      </div>
    );
  }

  // Step 1: choose a payment method.
  if (!method) {
    return (
      <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', padding: '40px 20px', maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Choose Payment Method</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>Select how you'd like to pay.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button
            onClick={() => setMethod('tebex')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, cursor: 'pointer', color: '#fff', textAlign: 'left' }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>💳 Card / Apple Pay / More</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Secure checkout powered by Tebex</div>
            </div>
            <span style={{ color: '#ec4899', fontWeight: 700 }}>→</span>
          </button>

          {paypalConfigured && (
            <button
              onClick={() => setMethod('paypal')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, cursor: 'pointer', color: '#fff', textAlign: 'left' }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>🅿️ PayPal</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Pay with your PayPal balance or card</div>
              </div>
              <span style={{ color: '#ec4899', fontWeight: 700 }}>→</span>
            </button>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/cart" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>
            ← Back to cart
          </Link>
        </div>
      </div>
    );
  }

  // Step 2: order summary + complete purchase with the chosen method.
  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', background: '#000', color: '#fff', padding: '40px 20px', maxWidth: 700, margin: '0 auto' }}>
      <button
        onClick={() => { setMethod(null); setPaymentFailed(false); setStatus(''); }}
        style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', marginBottom: 16, padding: 0 }}
      >
        ← Change payment method
      </button>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Confirm Your Order</h1>
      <p style={{ color: '#888', marginBottom: 32, fontSize: 14 }}>
        Paying with {method === 'tebex' ? 'Card / Apple Pay via Tebex' : 'PayPal'}.
      </p>

      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: 16 }}>
          Buyer
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {(user.user_metadata?.avatar_url as string) && (
            <img src={user.user_metadata.avatar_url as string} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          )}
          <div>
            <div style={{ fontWeight: 700 }}>
              {(user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || 'Discord User'}
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>{user.email}</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: 16 }}>
          Order Summary
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>{item.name}</span>
              <span style={{ fontWeight: 700 }}>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800 }}>
          <span>Amount Due</span>
          <span style={{ color: '#ec4899' }}>${total.toFixed(2)}</span>
        </div>
      </div>

      {paymentFailed ? (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid #ef4444', borderRadius: 12, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 28 }}>⚠️</div>
          <p style={{ color: '#ef4444', fontWeight: 800, margin: '10px 0 4px' }}>Payment failed</p>
          <p style={{ color: '#999', fontSize: 13, marginBottom: 20 }}>
            No charge was made. You can try again with the same or a different payment method.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={retry}
              style={{ flex: 1, background: '#ec4899', color: '#fff', border: 'none', padding: 14, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              Try Again
            </button>
            <a
              href="https://discord.com/channels/1458550712119070925/1458550715130581238"
              target="_blank"
              rel="noreferrer"
              style={{ flex: 1, background: '#5865F2', color: '#fff', padding: 14, borderRadius: 8, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}
            >
              Visit Discord
            </a>
          </div>
        </div>
      ) : method === 'tebex' ? (
        <button
          onClick={handlePayTebex}
          disabled={paying}
          style={{ width: '100%', background: '#ec4899', color: '#fff', padding: 16, borderRadius: 10, fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer' }}
        >
          {paying ? 'Opening secure checkout...' : `Complete Purchase - $${total.toFixed(2)}`}
        </button>
      ) : (
        <div>
          <p style={{ fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 10 }}>
            Click below to complete your purchase with PayPal.
          </p>
          <div ref={paypalContainerRef} />
        </div>
      )}

      {status && (
        <p style={{ fontSize: 12, textAlign: 'center', marginTop: 16, color: '#f59e0b' }}>{status}</p>
      )}

      <p style={{ fontSize: 11, color: '#666', textAlign: 'center', marginTop: 16 }}>
        Your files unlock immediately after payment is confirmed.
      </p>
    </div>
  );
}
