"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

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
          href="/admin/products/new"
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
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td style={td}>{product.name}</td>
                  <td style={td}>{product.platform}</td>
                  <td style={td}>{product.category}</td>
                  <td style={td}>${product.price}</td>

                  <td style={td}>
                    {product.published ? (
                      <span
                        style={{
                          color: "#22c55e",
                          fontWeight: "bold",
                        }}
                      >
                        Published
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