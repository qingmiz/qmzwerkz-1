export default function DashboardPage() {
  const cards = [
    { title: "Total Revenue", value: "$0.00" },
    { title: "Orders", value: "0" },
    { title: "Products", value: "0" },
    { title: "Customers", value: "0" },
  ];

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
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        QMZWERKZ Admin Dashboard
      </h1>

      <p
        style={{
          color: "#888",
          marginBottom: 40,
        }}
      >
        Welcome back. Here's what's happening with your marketplace.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 20,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#151515",
              border: "1px solid #2b2b2b",
              borderRadius: 14,
              padding: 25,
            }}
          >
            <div
              style={{
                color: "#999",
                marginBottom: 12,
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: "bold",
                color: "#ec4899",
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 40,
          background: "#151515",
          borderRadius: 14,
          border: "1px solid #2b2b2b",
          padding: 25,
        }}
      >
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Recent Activity
        </h2>

        <p style={{ color: "#888" }}>
          No activity yet.
        </p>
      </div>
    </main>
  );
}