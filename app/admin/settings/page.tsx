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
          <p style={text}>
            Store name, branding, and colors are currently set directly in the code
            (components/layout/Navbar.tsx, Footer.tsx). Let me know if you'd like this made editable
            here instead - it's a real feature I can build, just not wired up yet.
          </p>
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
          <p style={text}>
            Downloads are already purchase-gated automatically: a customer can only download a file
            after their order is marked "completed" (verified by Tebex or PayPal). There are no
            download limits or expiry currently - every completed order gets unlimited re-downloads
            via My Account. Let me know if you want limits added.
          </p>
        </div>

        <div style={card}>
          <h2>Security</h2>
          <p style={text}>
            Admin access is controlled by the <code style={{ color: '#ec4899' }}>admin_users</code> table
            in Supabase - only accounts listed there can sign in at /admin/login. To add or remove an
            admin, run a SQL insert/delete on that table directly in the Supabase dashboard.
          </p>
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