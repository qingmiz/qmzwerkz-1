"use client";

export default function OrdersPage() {
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
        Orders
      </h1>

      <p
        style={{
          color: "#888",
          marginBottom: "30px",
        }}
      >
        View and manage customer purchases.
      </p>

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
              <th style={th}>Order ID</th>
              <th style={th}>Customer</th>
              <th style={th}>Product</th>
              <th style={th}>Amount</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={td}>No orders yet.</td>
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