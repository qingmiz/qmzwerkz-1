"use client";

export default function PromoCodesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#090909",
        color: "#fff",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "34px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        Promo Codes
      </h1>

      <p
        style={{
          color: "#888",
          marginBottom: "30px",
        }}
      >
        Create and manage discounts for your marketplace.
      </p>

      <button
        style={{
          background: "#ec4899",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "25px",
        }}
      >
        + Create Promo Code
      </button>

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
              <th style={th}>Code</th>
              <th style={th}>Discount</th>
              <th style={th}>Uses</th>
              <th style={th}>Expires</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={td}>No promo codes yet.</td>
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
  padding: "16px",
  textAlign: "left",
  color: "#999",
};

const td: React.CSSProperties = {
  padding: "16px",
  borderTop: "1px solid #2b2b2b",
};