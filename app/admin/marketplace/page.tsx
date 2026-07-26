'use client';

import React, { useState } from 'react';

export default function AdminMarketplace() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [platform, setPlatform] = useState('FiveM');
  const [category, setCategory] = useState('Scripts');
  const [subcategory, setSubcategory] = useState('');

  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');

  const [productStatus, setProductStatus] = useState('published');

  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [newRelease, setNewRelease] = useState(false);
  const [freeProduct, setFreeProduct] = useState(false);

  const [version, setVersion] = useState('1.0.0');
  const [changelog, setChangelog] = useState('');
  const [tags, setTags] = useState('');
  const [tebexPackageId, setTebexPackageId] = useState('');

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [zipFileName, setZipFileName] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUploadAndPublish = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setStatus('Uploading assets...');

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('slug', slug);
      form.append('platform', platform);
      form.append('category', category);
      form.append('subcategory', subcategory);
      form.append('status', productStatus);
      form.append('short_description', description);
      form.append('description', fullDescription);
      form.append('price', price);
      form.append('sale_price', salePrice);
      form.append('featured', String(featured));
      form.append('bestseller', String(bestseller));
      form.append('new_release', String(newRelease));
      form.append('free_product', String(freeProduct));
      form.append('version', version);
      form.append('changelog', changelog);
      form.append('tags', tags);
      form.append('tebex_package_id', tebexPackageId);
      if (coverFile) form.append('cover', coverFile);
      if (zipFile) form.append('zip', zipFile);

      const res = await fetch('/api/admin/products', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to publish product.');

      setStatus('Product published successfully!');

      setName('');
      setPlatform('FiveM');
      setCategory('Scripts');
      setSubcategory('');
      setDescription('');
      setFullDescription('');
      setPrice('');
      setSalePrice('');
      setVersion('1.0.0');
      setChangelog('');

      setFeatured(false);
      setBestseller(false);
      setNewRelease(false);
      setFreeProduct(false);

      setCoverFile(null);
      setZipFile(null);
      setZipFileName('');
      setTebexPackageId('');
    } catch (err: any) {
      setStatus(err.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const discount =
    salePrice &&
    Number(price) > Number(salePrice)
      ? Math.round(
          ((Number(price) - Number(salePrice)) /
            Number(price)) *
            100
       )
     : 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 800,
          marginBottom: '8px',
        }}
      >
        QMZWERKZ Admin
      </h1>

      <p
        style={{
          color: '#888',
          marginBottom: '30px',
        }}
      >
        Publish products directly to your marketplace.
      </p>

      <form
        onSubmit={handleUploadAndPublish}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: '#111',
          padding: '25px',
          borderRadius: '12px',
          border: '1px solid #222',
        }}
      >
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => {
             const value = e.target.value;

             setName(value);

             setSlug( 
              value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')  
            );
          }}
          style={inputStyle}
        />
        <input
          placeholder="Product Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          style={inputStyle}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: '15px',
          }}
        >
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={inputStyle}
          >
            <option>FiveM</option>
            <option>IMVU</option>
            <option>Second Life</option>
            <option>Roblox</option>
          </select>

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            style={inputStyle}
          />
        </div>

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Sale Price"
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Full Description"
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          style={{
            ...inputStyle,
            minHeight: 150,
            resize: 'vertical',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
          }}
        >
          <input
            placeholder="Version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={inputStyle}
          />

          <select
            value={productStatus}
            onChange={(e) => setProductStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <textarea
          placeholder="Changelog"
          value={changelog}
          onChange={(e) => setChangelog(e.target.value)}
          style={{
            ...inputStyle,
            minHeight: 120,
            resize: 'vertical',
          }}
        />

        <div>
         <label
           style={{
             display: 'block',
             marginBottom: 8,
             fontWeight: 700,
           }}
         >
           Tags
         </label>

       <input
        type="text"
        placeholder="female, face, realistic, fivem"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        style={inputStyle}
      />

       <small
         style={{
           color: '#777',
           marginTop: 6,
           display: 'block',
         }}
       >
         Separate tags with commas.
       </small>
     </div>

        <div>
         <label
           style={{
             display: 'block',
             marginBottom: 8,
             fontWeight: 700,
           }}
         >
           Tebex Package ID
         </label>

       <input
        type="text"
        placeholder="e.g. 6234567"
        value={tebexPackageId}
        onChange={(e) => setTebexPackageId(e.target.value)}
        style={inputStyle}
      />

       <small
         style={{
           color: '#777',
           marginTop: 6,
           display: 'block',
         }}
       >
         From your Tebex dashboard → Packages. Required for checkout to work for this product.
       </small>
     </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: '15px',
          }}
        >
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>

          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
            />
            Best Seller
          </label>

          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={newRelease}
              onChange={(e) => setNewRelease(e.target.checked)}
            />
            New Release
          </label>

          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={freeProduct}
              onChange={(e) => setFreeProduct(e.target.checked)}
            />
            Free Product
          </label>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
          }}
        >
          <div>
            <p style={{ marginBottom: 8, fontWeight: 700 }}>Cover Image</p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setCoverFile(file);

                setCoverPreview(URL.createObjectURL(file));
              }}
            />

           {coverPreview && (
           <div
             style={{
               marginTop: 20,
               textAlign: 'center',
           }}
         >
          <img
            src={coverPreview}
            alt="Preview"
            style={{
              width: 250,
              borderRadius: 12,
              border: '2px solid #ec4899',
              boxShadow: '0 0 20px rgba(236,72,153,.35)',
           }}
         />

         <p
           style={{
            color: '#888',
            marginTop: 10,
           }}
         >
           Product Cover Preview
         </p>
       </div>
    )}
  </div>

          <div>
            <p style={{ marginBottom: 8, fontWeight: 700 }}>Product ZIP</p>

            <input
              type="file"
              accept=".zip"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setZipFile(file);
                setZipFileName(file.name);
              }}
            />

            {zipFileName && (
              <div
                style={{
                  marginTop: 20,
                  padding: '14px',
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 13, color: '#fff' }}>{zipFileName}</span>
                <span style={{ fontSize: 12, color: '#888' }}>
                  {zipFile ? `${(zipFile.size / 1024 / 1024).toFixed(1)}MB` : ''}
                </span>
              </div>
            )}

            <small
              style={{
                color: '#777',
                marginTop: 8,
                display: 'block',
              }}
            >
              This file is only released after a verified purchase.
            </small>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#ec4899',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          {loading ? 'Publishing...' : 'Publish Product'}
        </button>

        {status && (
          <div
            style={{
              background: '#161616',
              borderRadius: 8,
              padding: 12,
              textAlign: 'center',
            }}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  background: '#161616',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
};

const checkboxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: '#161616',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #2a2a2a',
  cursor: 'pointer',
};