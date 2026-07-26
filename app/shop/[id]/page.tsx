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
  gallery_images?: string[];
  zip_file?: string;
  requirements?: string;
  installation_guide?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: size, letterSpacing: 1 }}>
      {'★'.repeat(Math.round(value))}
      <span style={{ color: '#444' }}>{'★'.repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');

  const [related, setRelated] = useState<Product[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

      if (data && !error) {
        setProduct(data);
        setActiveImage(data.cover_image || '');

        if (data.category) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category', data.category)
            .neq('id', id)
            .limit(4);
          if (relatedData) setRelated(relatedData);
        }
      }
      setLoading(false);
    }

    async function fetchReviews() {
      const res = await fetch(`/api/reviews?productId=${id}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
        setAvgRating(data.average);
      }
    }

    async function checkCanReview() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', id)
        .eq('status', 'completed')
        .limit(1)
        .maybeSingle();
      setCanReview(!!order);
    }

    fetchProduct();
    fetchReviews();
    checkCanReview();
  }, [id]);

  const addToCart = (prod: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('qmz_cart') || '[]');
    const updatedCart = [...existingCart, prod];
    localStorage.setItem('qmz_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cart-updated'));
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

  const submitReview = async () => {
    if (myRating === 0) {
      setReviewStatus('Pick a star rating first.');
      return;
    }
    setSubmittingReview(true);
    setReviewStatus('');

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: id, rating: myRating, comment: myComment }),
    });
    const data = await res.json();

    setSubmittingReview(false);

    if (!res.ok) {
      setReviewStatus(data.error || 'Failed to submit review.');
      return;
    }

    setReviewStatus('Thanks for your review!');
    const refreshed = await fetch(`/api/reviews?productId=${id}`);
    const refreshedData = await refreshed.json();
    setReviews(refreshedData.reviews);
    setAvgRating(refreshedData.average);
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

  const galleryThumbs = [product.cover_image, ...(product.gallery_images || [])].filter(Boolean) as string[];

  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#000', color: '#fff' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/shop" style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          &larr; Back to Marketplace
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
        {/* Media / Gallery */}
        <div>
          <div style={{ width: '100%', height: '380px', background: activeImage ? `url(${activeImage}) center/cover no-repeat #111` : '#111', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontWeight: 600 }}>
            {!activeImage && '[ No Preview Available ]'}
          </div>

          {galleryThumbs.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              {galleryThumbs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(src)}
                  style={{
                    width: 70,
                    height: 50,
                    borderRadius: 6,
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: activeImage === src ? '2px solid #ec4899' : '1px solid rgba(255,255,255,0.15)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff2a85', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>{product.name}</h1>

          {avgRating != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Stars value={avgRating} />
              <span style={{ color: '#888', fontSize: 13 }}>{avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}

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

      {/* Reviews */}
      <div style={{ marginTop: 60, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Reviews</h2>

        {canReview && (
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 24, maxWidth: 500 }}>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>Leave a review (verified purchase)</p>
            <div style={{ marginBottom: 10 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setMyRating(n)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: n <= myRating ? '#f59e0b' : '#444', padding: 2 }}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
              placeholder="What did you think? (optional)"
              style={{ width: '100%', minHeight: 70, padding: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
            />
            <button
              onClick={submitReview}
              disabled={submittingReview}
              style={{ marginTop: 10, background: '#ec4899', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
            {reviewStatus && <p style={{ fontSize: 12, color: reviewStatus.includes('Thanks') ? '#10b981' : '#ef4444', marginTop: 8 }}>{reviewStatus}</p>}
          </div>
        )}

        {reviews.length === 0 ? (
          <p style={{ color: '#666', fontSize: 14 }}>No reviews yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{r.reviewer_name}</span>
                  <Stars value={r.rating} size={13} />
                </div>
                {r.comment && <p style={{ color: '#aaa', fontSize: 13, margin: 0 }}>{r.comment}</p>}
                <p style={{ color: '#555', fontSize: 11, marginTop: 4 }}>{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ marginTop: 60, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Related Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                style={{ display: 'block', background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', textDecoration: 'none', color: '#fff' }}
              >
                {p.cover_image && (
                  <div style={{ height: 120, backgroundImage: `url(${p.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                )}
                <div style={{ padding: 14 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px 0' }}>{p.name}</h4>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#ec4899' }}>${p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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
                onClick={() => router.push('/cart')}
                style={{ background: '#222', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: 14, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                View Cart / Remove Items
              </button>
              <button
                onClick={() => { setJustAdded(false); router.push('/shop'); }}
                style={{ background: 'transparent', color: '#888', border: 'none', padding: 10, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
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
