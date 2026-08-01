'use client';

import { adminFetch } from '@/lib/admin-fetch';
import { supabase } from '@/lib/supabase';

import React, { useState } from 'react';

// FiveM category taxonomy. Skins is the only category with subcategories,
// and Faces/Tattoos are the only subcategories that differentiate by
// gender. Other platforms (IMVU, etc.) keep free-text category/subcategory
// fields, unchanged.
const FIVEM_CATEGORIES = ['Scripts', 'Skins', 'Road Mods', 'Custom Weapons'];
const SKIN_SUBCATEGORIES = ['Faces', 'Tattoos'];
const GENDERS = ['Male', 'Female', 'LGBTQ'];
// Only shown when gender === 'LGBTQ'.
const LGBTQ_PRESENTATIONS = ['Fem-Masc', 'Masc-Fem'];

export default function AdminMarketplace() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [platform, setPlatform] = useState('FiveM');
  const [category, setCategory] = useState('Scripts');
  const [subcategory, setSubcategory] = useState('');
  const [gender, setGender] = useState('');
  const [genderDetail, setGenderDetail] = useState('');

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
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);
  const [previewVideoName, setPreviewVideoName] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUploadAndPublish = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setStatus('Uploading assets...');

    try {
      setStatus('Uploading files directly to storage...');

      let cover_image = '';
      let zip_file = '';
      let gallery_images: string[] = [];

      if (coverFile) {
        const fileName = `${Date.now()}-${coverFile.name}`;
        const { error: upErr } = await supabase.storage.from('product-images').upload(fileName, coverFile);
        if (upErr) throw new Error(`Cover upload failed: ${upErr.message}`);
        cover_image = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
      }

      if (zipFile) {
        setStatus('Requesting upload URL...');
        const urlRes = await adminFetch('/api/admin/r2-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: zipFile.name, contentType: zipFile.type || 'application/zip' }),
        });
        const urlData = await urlRes.json();
        if (!urlRes.ok) throw new Error(urlData.error || 'Could not start ZIP upload.');

        setStatus('Uploading ZIP (this can take a while for large files)...');
        const putRes = await fetch(urlData.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': zipFile.type || 'application/zip' },
          body: zipFile,
        });
        if (!putRes.ok) throw new Error('ZIP upload to storage failed.');

        zip_file = `r2:${urlData.key}`; // R2-hosted - see /api/download for how this is resolved
      }

      let preview_video = '';
      if (previewVideoFile) {
        setStatus('Uploading preview video...');
        const urlRes = await adminFetch('/api/admin/r2-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: previewVideoFile.name,
            contentType: previewVideoFile.type || 'video/mp4',
            type: 'video',
          }),
        });
        const urlData = await urlRes.json();
        if (!urlRes.ok) throw new Error(urlData.error || 'Could not start video upload.');

        const putRes = await fetch(urlData.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': previewVideoFile.type || 'video/mp4' },
          body: previewVideoFile,
        });
        if (!putRes.ok) throw new Error('Video upload to storage failed.');

        preview_video = urlData.publicUrl;
      }

      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
          const { error: upErr } = await supabase.storage.from('product-images').upload(fileName, file);
          if (upErr) throw new Error(`Gallery upload failed: ${upErr.message}`);
          gallery_images.push(supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl);
        }
      }

      setStatus('Saving product...');

      const res = await adminFetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          platform,
          category,
          subcategory,
          gender,
          gender_detail: genderDetail,
          status: productStatus,
          short_description: description,
          description: fullDescription,
          price,
          sale_price: salePrice,
          featured,
          bestseller,
          new_release: newRelease,
          free_product: freeProduct,
          version,
          changelog,
          tags,
          tebex_package_id: tebexPackageId,
          cover_image,
          zip_file,
          gallery_images,
          preview_video,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to publish product.');

      setStatus('Product published successfully!');

      setName('');
      setPlatform('FiveM');
      setCategory('Scripts');
      setSubcategory('');
      setGender('');
      setGenderDetail('');
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
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setPreviewVideoFile(null);
      setPreviewVideoName('');
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
            onChange={(e) => {
              const value = e.target.value;
              setPlatform(value);
              // Reset category/subcategory/gender when switching platforms so a
              // stale FiveM-only combo (e.g. category="Skins") can't get saved
              // against a different platform.
              setCategory(value === 'FiveM' ? 'Scripts' : '');
              setSubcategory('');
              setGender('');
              setGenderDetail('');
            }}
            style={inputStyle}
          >
            <option>FiveM</option>
            <option>IMVU</option>
            <option>Second Life</option>
            <option>Roblox</option>
          </select>

          {platform === 'FiveM' ? (
            <select
              value={FIVEM_CATEGORIES.includes(category) ? category : 'Scripts'}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory('');
                setGender('');
                setGenderDetail('');
              }}
              style={inputStyle}
            >
              {FIVEM_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          ) : (
            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            />
          )}

          {platform === 'FiveM' && category === 'Skins' ? (
            <select
              value={SKIN_SUBCATEGORIES.includes(subcategory) ? subcategory : 'Faces'}
              onChange={(e) => {
                setSubcategory(e.target.value);
                setGender('');
                setGenderDetail('');
              }}
              style={inputStyle}
            >
              {SKIN_SUBCATEGORIES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          ) : platform !== 'FiveM' ? (
            <input
              placeholder="Subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              style={inputStyle}
            />
          ) : null}
        </div>

        {platform === 'FiveM' && category === 'Skins' && (
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Gender</label>
            <select
              value={GENDERS.includes(gender) ? gender : ''}
              onChange={(e) => {
                setGender(e.target.value);
                setGenderDetail('');
              }}
              style={inputStyle}
            >
              <option value="">Select gender...</option>
              {GENDERS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        )}

        {platform === 'FiveM' && category === 'Skins' && gender === 'LGBTQ' && (
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 700 }}>Presentation</label>
            <select
              value={LGBTQ_PRESENTATIONS.includes(genderDetail) ? genderDetail : ''}
              onChange={(e) => setGenderDetail(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select presentation...</option>
              {LGBTQ_PRESENTATIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        )}

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

        <div>
          <p style={{ marginBottom: 8, fontWeight: 700 }}>Gallery Images (optional, multiple)</p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;
              setGalleryFiles(files);
              setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
            }}
          />

          {galleryPreviews.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              {galleryPreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, border: '1px solid #2a2a2a' }}
                />
              ))}
            </div>
          )}

          <small style={{ color: '#777', marginTop: 8, display: 'block' }}>
            Additional screenshots shown on the product page.
          </small>
        </div>

        <div>
          <p style={{ marginBottom: 8, fontWeight: 700 }}>Preview Video (optional)</p>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPreviewVideoFile(file);
              setPreviewVideoName(file.name);
            }}
          />

          {previewVideoName && (
            <div
              style={{
                marginTop: 16,
                padding: '14px',
                background: '#161616',
                border: '1px solid #2a2a2a',
                borderRadius: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, color: '#fff' }}>{previewVideoName}</span>
              <span style={{ fontSize: 12, color: '#888' }}>
                {previewVideoFile ? `${(previewVideoFile.size / 1024 / 1024).toFixed(1)}MB` : ''}
              </span>
            </div>
          )}

          <small style={{ color: '#777', marginTop: 8, display: 'block' }}>
            A short demo/preview clip shown publicly on the product page (not gated behind purchase).
          </small>
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