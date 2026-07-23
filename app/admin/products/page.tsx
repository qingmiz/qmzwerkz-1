'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;

    await supabase
      .from('products')
      .delete()
      .eq('id', id);

    loadProducts();
  }

  return (
    <div
      style={{
        background: '#000',
        minHeight: '100vh',
        color: '#fff',
        padding: 40,
      }}
    >
      <h1
        style={{
          fontSize: 34,
          marginBottom: 30,
          fontWeight: 800,
        }}
      >
        Product Manager
      </h1>

      {loading && <p>Loading...</p>}

      {!loading &&
        products.map((product) => (
          <div
            key={product.id}
            style={{
              background: '#111',
              border: '1px solid #222',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2>{product.name}</h2>

              <p>{product.platform}</p>

              <p>{product.category}</p>

              <p>${product.price}</p>

              <p>Status: {product.status}</p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
              }}
            >
              <button
                style={{
                  padding: '10px 16px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(product.id)}
                style={{
                  padding: '10px 16px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}