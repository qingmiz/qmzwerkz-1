"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewProductPage() {
  const [featured, setFeatured] = useState(false);
  const [newRelease, setNewRelease] = useState(true);

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
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ fontSize: 34, fontWeight: "bold" }}>
            New Product
          </h1>

          <p style={{ color: "#888", marginTop: 8 }}>
            Create a new product for the QMZWERKZ marketplace.
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
          ← Back to Products
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
        <input placeholder="Product Name" style={inputStyle} />

        <select style={inputStyle}>
          <option>FiveM</option>
          <option>IMVU</option>
          <option>Website</option>
        </select>

        <input placeholder="Category" style={inputStyle} />

        <input placeholder="Price" style={inputStyle} />

        <textarea
          placeholder="Short Description"
          rows={3}
          style={textareaStyle}
        />

        <textarea
          placeholder="Full Description"
          rows={6}
          style={textareaStyle}
        />

        <div style={uploadBox}>
          📸 Cover Image
          <br />
          <span style={{ color: "#888", fontSize: 14 }}>
            Drag & Drop or Click to Upload
          </span>
        </div>

        <div style={uploadBox}>
          🖼 Gallery Images
          <br />
          <span style={{ color: "#888", fontSize: 14 }}>
            Upload multiple screenshots
          </span>
        </div>

        <div style={uploadBox}>
          📦 ZIP File
          <br />
          <span style={{ color: "#888", fontSize: 14 }}>
            Upload the downloadable product
          </span>
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

        <button style={publishButton}>
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

const uploadBox = {
  border: "2px dashed #444",
  borderRadius: 12,
  padding: "30px",
  textAlign: "center" as const,
  color: "#fff",
};

const checkboxStyle = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const publishButton = {
  background: "#ec4899",
  border: "none",
  color: "#fff",
  padding: "16px",
  borderRadius: 12,
  fontWeight: "bold",
  cursor: "pointer",
};