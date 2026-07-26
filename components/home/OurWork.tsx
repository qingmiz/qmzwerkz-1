'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string | null;
}

export default function OurWork() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (data && !error) setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <section style={{ background: '#090909', padding: '100px 40px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ color: '#fff', fontSize: '42px', marginBottom: '15px' }}>Our Work</h2>
        <p style={{ color: '#888', marginBottom: '50px' }}>
          Explore some of the premium digital products created by QMZWERKZ.
        </p>

        {loading ? (
          <p style={{ color: '#666' }}>Loading...</p>
        ) : items.length === 0 ? (
          <div style={{ background: '#151515', border: '1px solid #262626', borderRadius: 18, padding: 60, textAlign: 'center', color: '#666' }}>
            Portfolio coming soon - check back for examples of our custom work.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '30px' }}>
            {items.map((item) => {
              const Wrapper = item.link_url ? 'a' : 'div';
              return (
                <Wrapper
                  key={item.id}
                  {...(item.link_url ? { href: item.link_url, target: '_blank', rel: 'noreferrer' } : {})}
                  style={{ background: '#151515', border: '1px solid #262626', borderRadius: '18px', overflow: 'hidden', display: 'block', textDecoration: 'none' }}
                >
                  {item.image_url ? (
                    <div
                      style={{ height: '220px', backgroundImage: `url(${item.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                  ) : (
                    <div style={{ height: '220px', background: 'linear-gradient(135deg,#1b1b1b,#2a2a2a)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#666', fontSize: '20px' }}>
                      Preview
                    </div>
                  )}

                  <div style={{ padding: '24px' }}>
                    <h3 style={{ color: '#fff', marginBottom: '10px' }}>{item.title}</h3>
                    <p style={{ color: '#888', lineHeight: 1.6, margin: 0 }}>{item.description}</p>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
