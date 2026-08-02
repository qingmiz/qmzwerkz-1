"use client";

import { adminFetch } from "@/lib/admin-fetch";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [platformFilter, setPlatformFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load products:", error);
        return;
      }

      setProducts(data ?? []);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    const res = await adminFetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(`Failed to delete: ${data.error || 'Unknown error'}`);
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  const platforms = Array.from(new Set(products.map((p) => p.platform).filter(Boolean))).sort();
  const categories = Array.from(
    new Set(
      products
        .filter((p) => (platformFilter ? p.platform === platformFilter : true))
        .map((p) => p.category)
        .filter(Boolean)
    )
  ).sort();
  const subcategories = Array.from(
    new Set(
      products
        .filter((p) => (platformFilter ? p.platform === platformFilter : true))
        .filter((p) => (categoryFilter ? p.category === categoryFilter : true))
        .map((p) => p.subcategory)
        .filter(Boolean)
    )
  ).sort();
  const genders = Array.from(
    new Set(
      products
        .filter((p) => (platformFilter ? p.platform === platformFilter : true))
        .filter((p) => (categoryFilter ? p.category === categoryFilter : true))
        .filter((p) => (subcategoryFilter ? p.subcategory === subcategoryFilter : true))
        .map((p) => p.gender)
        .filter(Boolean)
    )
  ).sort();

  const filteredProducts = products
    .filter((p) => (platformFilter ? p.platform === platformFilter : true))
    .filter((p) => (categoryFilter ? p.category === categoryFilter : true))
    .filter((p) => (subcategoryFilter ? p.subcategory === subcategoryFilter : true))
    .filter((p) => (genderFilter ? p.gender === genderFilter : true));

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
          <h1 style={{ fontSize: "34px", fontWeight: "bold" }}>
            Products
          </h1>

          <p style={{ color: "#888", marginTop: "8px" }}>
            Manage everything sold on QMZWERKZ.
          </p>
        </div>

        <Link
          href="/admin/marketplace"
          style={{
            background: "#ec4899",
            color: "#fff",
            textDecoration: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          + New Product
        </Link>
      </div>

      {products.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value);
              setCategoryFilter("");
              setSubcategoryFilter("");
              setGenderFilter("");
            }}
            style={selectStyle}
          >
            <option value="">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubcategoryFilter("");
              setGenderFilter("");
            }}
            style={selectStyle}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {subcategories.length > 0 && (
            <select
              value={subcategoryFilter}
              onChange={(e) => {
                setSubcategoryFilter(e.target.value);
                setGenderFilter("");
              }}
              style={selectStyle}
            >
              <option value="">All Types</option>
              {subcategories.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          {genders.length > 0 && (
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Genders</option>
              {genders.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div
        style={{
          background: "#151515",
          border: "1px solid #2b2b2b",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#1d1d1d" }}>
              <th style={th}>Product</th>
              <th style={th}>Platform</th>
              <th style={th}>Category</th>
              <th style={th}>Price</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td style={td}>No products yet.</td>
                <td style={td}>-</td>
                <td style={td}>-</td>
                <td style={td}>-</td>
                <td style={td}>-</td>
                <td style={td}>-</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td style={td}>No products match the selected filters.</td>
                <td style={td}>-</td>
                <td style={td}>-</td>
                <td style={td}>-</td>
                <td style={td}>-</td>
                <td style={td}>-</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={td}>{product.name}</td>
                  <td style={td}>{product.platform}</td>
                  <td style={td}>{product.category}</td>
                  <td style={td}>${product.price}</td>

                  <td style={td}>
                    {product.status === "published" ? (
                      <span
                        style={{
                          color: "#22c55e",
                          fontWeight: "bold",
                        }}
                      >
                        Published
                      </span>
                    ) : product.status === "coming_soon" ? (
                      <span
                        style={{
                          color: "#3b82f6",
                          fontWeight: "bold",
                        }}
                      >
                        Coming Soon
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#f59e0b",
                          fontWeight: "bold",
                        }}
                      >
                        Draft
                      </span>
                    )}
                  </td>

                  <td style={td}>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                      }}
                    >
                      <Link
                        href={`/admin/products/${product.id}`}
                        style={{
                          color: "#ec4899",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Delete
                      </button>
                    </div>
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

const th: CSSProperties = {
  textAlign: "left",
  padding: "16px",
  color: "#999",
};

const td: CSSProperties = {
  padding: "16px",
  borderTop: "1px solid #2b2b2b",
};

const selectStyle: CSSProperties = {
  background: "#151515",
  color: "#fff",
  border: "1px solid #2b2b2b",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "13px",
  fontWeight: "600",
};