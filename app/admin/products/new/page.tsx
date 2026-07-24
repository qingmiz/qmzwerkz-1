"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";

export default function NewProductPage() {
  const [form, setForm] = useState({
    name: "",
    platform: "FiveM",
    category: "",
    price: "",
    shortDescription: "",
    fullDescription: "",
  });

  const [featured, setFeatured] = useState(false);
  const [newRelease, setNewRelease] = useState(true);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const publishProduct = () => {
    console.log({
      ...form,
      featured,
      newRelease,
      coverImage,
      galleryImages,
      zipFile,
    });

    alert(
      "Publish logic will be connected to Supabase next.\n\nFor now this confirms the form is working."
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090909",
        color: "#fff",
        padding: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h1 style={{ fontSize: 34, fontWeight: "bold" }}>
            New Product
          </h1>

          <p style={{ color: "#888", marginTop: 8 }}>
            Create a new marketplace product.
          </p>
        </div>

        <Link
          href="/admin/products"
          style={{
            color: "#ec4899",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back
        </Link>
      </div>

      <div
        style={{
          background: "#151515",
          border: "1px solid #2b2b2b",
          borderRadius: 14,
          padding: 30,
          display: "grid",
          gap: 20,
        }}
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          style={inputStyle}
        />

        <select
          name="platform"
          value={form.platform}
          onChange={handleChange}
          style={inputStyle}
        >
          <option>FiveM</option>
          <option>IMVU</option>
          <option>Website</option>
        </select>

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          style={inputStyle}
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          style={inputStyle}
        />

        <textarea
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          placeholder="Short Description"
          rows={3}
          style={textareaStyle}
        />

        <textarea
          name="fullDescription"
          value={form.fullDescription}
          onChange={handleChange}
          placeholder="Full Description"
          rows={6}
          style={textareaStyle}
        />

        <div style={uploadCard}>
          <h3>📸 Cover Image</h3>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCoverImage(e.target.files?.[0] || null)
            }
          />

          {coverImage && (
            <p style={fileText}>
              ✔ {coverImage.name}
            </p>
          )}
        </div>

        <div style={uploadCard}>
          <h3>🖼 Gallery Images</h3>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setGalleryImages(Array.from(e.target.files || []))
            }
          />

          {galleryImages.map((file) => (
            <p key={file.name} style={fileText}>
              ✔ {file.name}
            </p>
          ))}
        </div>

        <div style={uploadCard}>
          <h3>📦 ZIP File</h3>

          <input
            type="file"
            accept=".zip"
            onChange={(e) =>
              setZipFile(e.target.files?.[0] || null)
            }
          />

          {zipFile && (
            <p style={fileText}>
              ✔ {zipFile.name}
            </p>
          )}
        </div>

        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={featured}
            onChange={() => setFeatured(!featured)}
          />
          Featured Product
        </label>

        <label style={checkboxStyle}>
          <input
            type="checkbox"
            checked={newRelease}
            onChange={() => setNewRelease(!newRelease)}
          />
          New Release
        </label>

        <button
          onClick={publishProduct}
          style={publishButton}
        >
          Publish Product
        </button>
      </div>
    </main>
  );
}

const inputStyle = {
  background: "#1d1d1d",
  border: "1px solid #333",
  borderRadius: 10,
  padding: "14px",
  color: "#fff",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical" as const,
};

const uploadCard = {
  background: "#1b1b1b",
  border: "2px dashed #444",
  borderRadius: 12,
  padding: 25,
};

const checkboxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const fileText = {
  color: "#22c55e",
  marginTop: 10,
};

const publishButton = {
  background: "#ec4899",
  border: "none",
  color: "#fff",
  padding: "16px",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};