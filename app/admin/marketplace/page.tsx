'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminMarketplace() {
  const [name, setName] = useState('');
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

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUploadAndPublish = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setStatus('Uploading assets...');

    try {
      let coverImageUrl = '';
      let zipFileUrl = '';

      if (coverFile) {
        const fileName = `${Date.now()}-${coverFile.name}`;

        const { error } = await supabase.storage
          .from('product-images')
          .upload(fileName, coverFile);

        if (error) throw error;

        coverImageUrl = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName).data.publicUrl;
      }

      if (zipFile) {
        const zipName = `${Date.now()}-${zipFile.name}`;

        const { error } = await supabase.storage
          .from('product-files')
          .upload(zipName, zipFile);

        if (error) throw error;

        zipFileUrl = supabase.storage
          .from('product-files')
          .getPublicUrl(zipName).data.publicUrl;
      }

      const { error } = await supabase.from('products').insert([
        {
          tags: tags
             .split(',')
             .map((tag) => tag.trim())
             .filter(Boolean),
          name,
          platform,
          category,
          subcategory,
          status: productStatus,

          short_description: description,
          description: fullDescription,

          price: parseFloat(price) || 0,
          sale_price: parseFloat(salePrice) || null,

          featured,
          bestseller,
          new_release: newRelease,
          free_product: freeProduct,

          version,
          changelog,

          cover_image: coverImageUrl,
          zip_file: zipFileUrl,
        },
      ]);

      if (error) throw error;
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
          onChange={(e) => setName(e.target.value)}
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
            <p style={{ marginBottom: 8 }}>Cover Image</p>

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
          </div>

          <div>
            <p style={{ marginBottom: 8 }}>Cover Preview</p>

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