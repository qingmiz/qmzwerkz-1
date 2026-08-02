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
  subcategory?: string;
  gender?: string;
  gender_detail?: string;
  short_description: string;
  price: number;
  cover_image?: string;
  zip_file?: string;
  created_at?: string;
}

// Platform -> FiveM > Skins > Faces/Tattoos > Male/Female/LGBTQ -> Fem-Masc/Masc-Fem.
// These only drive the optional pill filters below - they never replace the
// existing substring category/platform match, so old links keep working.
const PLATFORMS = ['FiveM', 'IMVU', 'Other', 'Second Life', 'Roblox'];
const COMING_SOON_PLATFORMS = ['Second Life', 'Roblox'];
const KNOWN_PLATFORMS = ['fivem', 'imvu', 'second life', 'roblox'];
const FIVEM_CATEGORIES = ['Skins', 'Scripts', 'Road Mods', 'Custom Weapons'];
const SKIN_SUBCATEGORIES = ['Faces', 'Tattoos'];
const GENDERS = ['Male', 'Female', 'LGBTQ'];
const LGBTQ_PRESENTATIONS = ['Fem-Masc', 'Masc-Fem'];

export default function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = (searchParams.get('q') || '').toLowerCase().trim();
  const categoryFilter = (searchParams.get('category') || '').toLowerCase().trim();
  const platformFilter = (searchParams.get('platform') || '').toLowerCase().trim();
  const subcategoryFilter = (searchParams.get('subcategory') || '').toLowerCase().trim();
  const genderFilter = (searchParams.get('gender') || '').toLowerCase().trim();
  const genderDetailFilter = (searchParams.get('gender_detail') || '').toLowerCase().trim();

  // Raw (non-lowercased) values, used only to highlight the active pill and
  // to decide which rows of pills to show.
  const rawPlatform = searchParams.get('platform') || '';
  const rawCategory = searchParams.get('category') || '';
  const rawSubcategory = searchParams.get('subcategory') || '';
  const rawGender = searchParams.get('gender') || '';
  const selectedPlatform = PLATFORMS.find((p) => p.toLowerCase() === rawPlatform.toLowerCase()) || '';
  const selectedCategory = FIVEM_CATEGORIES.find((c) => c.toLowerCase() === rawCategory.toLowerCase()) || '';
  const selectedSubcategory = SKIN_SUBCATEGORIES.find((s) => s.toLowerCase() === rawSubcategory.toLowerCase()) || '';
  const selectedGender = GENDERS.find((g) => g.toLowerCase() === rawGender.toLowerCase()) || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState<Product | null>(null);

  function setParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : '/shop');
  }

  function selectPlatform(p: string) {
    setParams({ platform: p || undefined, category: undefined, subcategory: undefined, gender: undefined, gender_detail: undefined });
  }
  function selectCategory(cat: string) {
    setParams({ category: cat || undefined, subcategory: undefined, gender: undefined, gender_detail: undefined });
  }
  function selectSubcategory(sub: string) {
    setParams({ subcategory: sub || undefined, gender: undefined, gender_detail: undefined });
  }
  function selectGender(g: string) {
    setParams({ gender: g || undefined, gender_detail: undefined });
  }
  function selectGenderDetail(d: string) {
    setParams({ gender_detail: d || undefined });
  }

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
    window.dispatchEvent(new Event('cart-updated'));
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
    )
    .filter((p) => {
      if (!platformFilter) return true;
      const productPlatform = (p.platform || '').toLowerCase();
      if (platformFilter === 'other') return !KNOWN_PLATFORMS.includes(productPlatform);
      return productPlatform === platformFilter;
    })
    .filter((p) => (subcategoryFilter ? (p.subcategory || '').toLowerCase() === subcategoryFilter : true))
    .filter((p) => (genderFilter ? (p.gender || '').toLowerCase() === genderFilter : true))
    .filter((p) => (genderDetailFilter ? (p.gender_detail || '').toLowerCase() === genderDetailFilter : true));

  return (
    <div style={{ minHeight: 'calc(100vh - 73px)', padding: '40px', maxWidth: '1200px', margin: '0 auto', background: '#000', color: '#fff' }}>
      <header style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}>QMZ WERKZ // Storefront</h1>
        <p style={{ color: '#888888', fontSize: '14px', margin: '0 0 20px 0' }}>
          {query
            ? `Showing results for "${searchParams.get('q')}"`
            : selectedPlatform
            ? `Platform: ${selectedPlatform}`
            : categoryFilter
            ? `Category: ${searchParams.get('category')}`
            : 'Browse available FiveM assets and custom releases.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <PillRow
            label="Platform"
            options={PLATFORMS}
            selected={selectedPlatform}
            onSelect={selectPlatform}
            optionLabels={Object.fromEntries(COMING_SOON_PLATFORMS.map((p) => [p, `${p} (Soon)`]))}
            mutedOptions={COMING_SOON_PLATFORMS}
          />

          {selectedPlatform === 'FiveM' && (
            <PillRow
              label="Category"
              options={FIVEM_CATEGORIES}
              selected={selectedCategory}
              onSelect={selectCategory}
            />
          )}

          {selectedPlatform === 'FiveM' && selectedCategory === 'Skins' && (
            <PillRow
              label="Type"
              options={SKIN_SUBCATEGORIES}
              selected={selectedSubcategory}
              onSelect={selectSubcategory}
            />
          )}

          {selectedPlatform === 'FiveM' && selectedCategory === 'Skins' && (selectedSubcategory === 'Faces' || selectedSubcategory === 'Tattoos') && (
            <PillRow
              label="Gender"
              options={GENDERS}
              selected={selectedGender}
              onSelect={selectGender}
            />
          )}

          {selectedGender === 'LGBTQ' && (
            <PillRow
              label="Presentation"
              options={LGBTQ_PRESENTATIONS}
              selected={LGBTQ_PRESENTATIONS.find((d) => d.toLowerCase() === (searchParams.get('gender_detail') || '').toLowerCase()) || ''}
              onSelect={selectGenderDetail}
            />
          )}
        </div>
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
                <div style={{ width: '100%', height: '180px', background: `url("${p.cover_image}") center/cover no-repeat #161616` }} />
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
                onClick={() => router.push('/cart')}
                style={{ background: '#222', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: 14, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
              >
                View Cart / Remove Items
              </button>
              <button
                onClick={() => { setJustAdded(null); router.push('/shop'); }}
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

function PillRow({
  label,
  options,
  selected,
  onSelect,
  optionLabels,
  mutedOptions,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  optionLabels?: Record<string, string>;
  mutedOptions?: string[];
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '11px', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: '70px' }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onSelect('')}
          style={{
            background: selected === '' ? '#ec4899' : '#151515',
            color: '#fff',
            border: `1px solid ${selected === '' ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          All
        </button>
        {options.map((opt) => {
          const isMuted = mutedOptions?.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                background: selected === opt ? '#ec4899' : '#151515',
                color: isMuted && selected !== opt ? '#666' : '#fff',
                border: `1px solid ${selected === opt ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {optionLabels?.[opt] || opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
