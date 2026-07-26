// Transactional email via Resend (https://resend.com).
// Required env var: RESEND_API_KEY (Resend dashboard -> API Keys)
// Optional env var: RESEND_FROM_EMAIL - defaults to Resend's shared test sender,
// which works immediately with no setup but looks less professional. Once you
// verify your own domain in Resend, set this to e.g. "QMZWERKZ <orders@qmzwerkz.zip>".

export async function sendOrderEmail(email: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set - skipping email send. Add it in Vercel to enable real emails.');
    return { success: false, skipped: true };
  }

  const from = process.env.RESEND_FROM_EMAIL || 'QMZWERKZ <onboarding@resend.dev>';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: email, subject, html }),
    });

    if (!res.ok) {
      console.error('Resend send failed:', res.status, await res.text());
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false };
  }
}

const emailWrapper = (title: string, bodyHtml: string) => `
  <div style="font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;padding:32px;color:#fff;">
    <div style="max-width:520px;margin:0 auto;background:#111;border:1px solid #262626;border-radius:16px;overflow:hidden;">
      <div style="background:#000;padding:24px;text-align:center;border-bottom:1px solid #262626;">
        <span style="font-size:20px;font-weight:900;">QMZ<span style="color:#ec4899;">WERKZ</span>.ZIP</span>
      </div>
      <div style="padding:32px;">
        <h2 style="margin:0 0 16px 0;color:#fff;">${title}</h2>
        ${bodyHtml}
      </div>
      <div style="padding:20px;text-align:center;border-top:1px solid #262626;color:#666;font-size:12px;">
        Need help? Visit our Discord support ticket channel.
      </div>
    </div>
  </div>
`;

export async function sendOrderConfirmationEmail(
  email: string,
  items: { name: string; price: number }[],
  orderTotal: number
) {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;color:#ccc;border-bottom:1px solid #222;">${item.name}</td>
        <td style="padding:10px 0;color:#fff;font-weight:700;text-align:right;border-bottom:1px solid #222;">$${item.price.toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const html = emailWrapper(
    'Payment Received 🎉',
    `
      <p style="color:#ccc;">Thanks for your purchase! Your order is confirmed and your downloads are ready.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        ${itemRows}
        <tr>
          <td style="padding:14px 0 0 0;color:#fff;font-weight:800;">Total</td>
          <td style="padding:14px 0 0 0;color:#ec4899;font-weight:800;text-align:right;">$${orderTotal.toFixed(2)}</td>
        </tr>
      </table>
      <a href="https://qmzwerkz-1.vercel.app/account" style="display:inline-block;background:#ec4899;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;">
        View My Downloads
      </a>
    `
  );

  return sendOrderEmail(email, 'Your QMZWERKZ order is confirmed', html);
}

export async function sendClaimEmail(email: string, claimCode: string, prize: string) {
  const html = emailWrapper(
    'Congratulations! 🏆',
    `
      <p style="color:#ccc;">You won on the QMZWERKZ Daily Spin:</p>
      <h3 style="color:#ec4899;font-size:22px;">${prize}</h3>
      <p style="color:#888;font-size:13px;margin-top:20px;">Your Claim Code</p>
      <div style="background:#000;padding:14px;border-radius:8px;font-family:monospace;font-size:18px;color:#fff;">${claimCode}</div>
      <p style="color:#888;font-size:13px;margin-top:16px;">Open a support ticket on Discord and paste this code to redeem your prize.</p>
    `
  );

  return sendOrderEmail(email, `Your QMZWERKZ Prize - ${prize}`, html);
}
