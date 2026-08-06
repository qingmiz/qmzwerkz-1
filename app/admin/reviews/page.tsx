'use client';

import { adminFetch } from '@/lib/admin-fetch';
import { useEffect, useState } from 'react';

interface Review {
  id: string;
  product_name: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    const res = await adminFetch('/api/admin/reviews');
    const data = await res.json();
    if (res.ok) setReviews(data.reviews);
    else setError(data.error || 'Failed to load reviews.');
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this review? This cannot be undone.')) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    await adminFetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#090909', color: '#fff', padding: '40px' }}>
      <h1 style={{ fontSize: '34px', fontWeight: 'bold', marginBottom: '10px' }}>Reviews</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>Moderate customer reviews left on product pages.</p>

      {error && <p style={{ color: '#ef4444', marginBottom: 20 }}>{error}</p>}

      <div style={{ background: '#151515', border: '1px solid #2b2b2b', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1d1d1d' }}>
              <th style={th}>Product</th>
              <th style={th}>Reviewer</th>
              <th style={th}>Rating</th>
              <th style={th}>Comment</th>
              <th style={th}>Date</th>
              <th style={th}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td style={td} colSpan={6}>Loading...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td style={td} colSpan={6}>No reviews yet.</td></tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td style={td}>{r.product_name}</td>
                  <td style={td}>{r.reviewer_name}</td>
                  <td style={{ ...td, color: '#f59e0b' }}>
                    {'★'.repeat(r.rating)}
                    <span style={{ color: '#444' }}>{'★'.repeat(5 - r.rating)}</span>
                  </td>
                  <td style={{ ...td, maxWidth: 320 }}>{r.comment || <span style={{ color: '#555' }}>No comment</span>}</td>
                  <td style={td}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={td}>
                    <button onClick={() => remove(r.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const th: React.CSSProperties = { padding: '16px', textAlign: 'left', color: '#999' };
const td: React.CSSProperties = { padding: '16px', borderTop: '1px solid #2b2b2b' };
