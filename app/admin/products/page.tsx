"use client";

import Link from "next/link";

export default function ProductsPage() {
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
            <tr
              style={{
                background: "#1d1d1d",
              }}
            >
              <th style={th}>Product</th>
              <th style={th}>Platform</th>
              <th style={th}>Category</th>
              <th style={th}>Price</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={td}>No products yet.</td>
              <td style={td}>-</td>
              <td style={td}>-</td>
              <td style={td}>-</td>
              <td style={td}>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "16px",
  color: "#999",
};

const td: React.CSSProperties = {
  padding: "16px",
  borderTop: "1px solid #2b2b2b",
};