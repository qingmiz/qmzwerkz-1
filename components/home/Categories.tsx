export default function Categories() {
  const categories = [
    { title: "FiveM", icon: "🚗" },
    { title: "IMVU", icon: "💎" },
    { title: "Web Development", icon: "💻" },
    { title: "Custom Weapons", icon: "🔫" },
    { title: "Road Mods", icon: "🛣️" },
    { title: "Maps & MLOs", icon: "🏙️" },
  ];

  return (
    <section
      style={{
        background: "#0b0b0b",
        padding: "100px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: "42px",
            marginBottom: "15px",
          }}
        >
          Browse Categories
        </h2>

        <p
          style={{
            color: "#888",
            marginBottom: "50px",
          }}
        >
          Everything you need to build your community.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "25px",
          }}
        >
          {categories.map((cat) => (
            <a
              key={cat.title}
              href={`/shop?category=${encodeURIComponent(cat.title)}`}
              style={{
                background: "#151515",
                border: "1px solid #262626",
                borderRadius: "18px",
                padding: "35px",
                textAlign: "center",
                transition: ".25s",
                display: "block",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "15px",
                }}
              >
                {cat.icon}
              </div>

              <h3
                style={{
                  color: "#fff",
                  margin: 0,
                }}
              >
                {cat.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}