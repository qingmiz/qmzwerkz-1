"use client";

export default function AnalyticsPage() {
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
        Analytics
      </h1>

      <p
        style={{
          color: "#888",
          marginBottom: "30px",
        }}
      >
        Monitor your marketplace performance.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {[
          "Revenue",
          "Orders",
          "Visitors",
          "Downloads",
        ].map((card) => (
          <div
            key={card}
            style={{
              background: "#151515",
              border: "1px solid #2b2b2b",
              borderRadius: "14px",
              padding: "24px",
            }}
          >
            <div style={{ color: "#999", marginBottom: "10px" }}>
              {card}
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#ec4899",
              }}
            >
              --
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#151515",
          border: "1px solid #2b2b2b",
          borderRadius: "14px",
          padding: "24px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>
          Sales Overview
        </h2>

        <p style={{ color: "#888" }}>
          Charts will appear here once analytics are connected.
        </p>
      </div>
    </main>
  );
}