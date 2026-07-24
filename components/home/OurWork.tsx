export default function OurWork() {
  return (
    <section
      style={{
        background: "#090909",
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
          Our Work
        </h2>

        <p
          style={{
            color: "#888",
            marginBottom: "50px",
          }}
        >
          Explore some of the premium digital products created by QMZWERKZ.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "30px",
          }}
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                background: "#151515",
                border: "1px solid #262626",
                borderRadius: "18px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "220px",
                  background:
                    "linear-gradient(135deg,#1b1b1b,#2a2a2a)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#666",
                  fontSize: "20px",
                }}
              >
                Preview
              </div>

              <div style={{ padding: "24px" }}>
                <h3
                  style={{
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                >
                  Project {item}
                </h3>

                <p
                  style={{
                    color: "#888",
                    lineHeight: 1.6,
                  }}
                >
                  Replace this with screenshots of your skins,
                  websites, weapons, or other custom work.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}