"use client";

export default function SettingsPage() {
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
        Settings
      </h1>

      <p
        style={{
          color: "#888",
          marginBottom: "30px",
        }}
      >
        Configure your QMZWERKZ marketplace.
      </p>

      <div
        style={{
          display: "grid",
          gap: "20px",
          maxWidth: "700px",
        }}
      >
        <div style={card}>
          <h2>Store Information</h2>
          <p style={text}>Marketplace name, branding and contact details.</p>
        </div>

        <div style={card}>
          <h2>Payments & Payouts</h2>
          <p style={text}>
            Checkout runs through Tebex - money from sales goes into your Tebex Wallet, not directly
            into this site. Store API keys/webhook secret are configured in Vercel.
          </p>
          <a
            href="https://creator.tebex.io/"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#ec4899', fontWeight: 700, fontSize: 13, marginTop: 12, display: 'inline-block' }}
          >
            Open Tebex Control Panel →
          </a>
          <p style={{ ...text, fontSize: 12 }}>
            Once there: Payments → Wallet. You'll need to complete identity verification once, then you can
            add PayPal or a bank account as your payout method (bank transfer availability varies by region -
            check the Wallet page for what's supported for Jamaica). Bank and PayPal details are entered
            directly with Tebex and never touch this site.
          </p>
        </div>

        <div style={card}>
          <h2>Downloads</h2>
          <p style={text}>Control download limits and customer access.</p>
        </div>

        <div style={card}>
          <h2>Security</h2>
          <p style={text}>Admin permissions, API keys and authentication.</p>
        </div>
      </div>
    </main>
  );
}

const card: React.CSSProperties = {
  background: "#151515",
  border: "1px solid #2b2b2b",
  borderRadius: "14px",
  padding: "24px",
};

const text: React.CSSProperties = {
  color: "#888",
  marginTop: "10px",
};