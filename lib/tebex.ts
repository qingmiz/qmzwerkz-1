// Tebex Headless API integration.
// Docs: https://docs.tebex.io/developers/headless-api/overview
//
// Required env vars (set in Vercel, NOT committed to the repo):
//   TEBEX_WEBSTORE_TOKEN   - your store's public webstore token (Tebex dashboard -> API Keys)
//   TEBEX_WEBHOOK_SECRET   - your store's Webhook Signature Secret (Tebex dashboard -> Webhooks)

const HEADLESS_BASE = 'https://headless.tebex.io/api';

function getWebstoreToken() {
  const token = process.env.TEBEX_WEBSTORE_TOKEN;
  if (!token) {
    throw new Error('TEBEX_WEBSTORE_TOKEN is not set. Add it in Vercel → Project → Settings → Environment Variables.');
  }
  return token;
}

interface CreateBasketParams {
  completeUrl: string;
  cancelUrl: string;
  custom: Record<string, unknown>;
}

export async function createBasket({ completeUrl, cancelUrl, custom }: CreateBasketParams) {
  const token = getWebstoreToken();

  const res = await fetch(`${HEADLESS_BASE}/accounts/${token}/baskets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      complete_url: completeUrl,
      cancel_url: cancelUrl,
      complete_auto_redirect: true,
      custom,
    }),
  });

  if (!res.ok) {
    throw new Error(`Tebex basket creation failed: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  return json.data as { ident: string; links: { checkout?: string } };
}

export async function addPackageToBasket(basketIdent: string, packageId: number, quantity = 1) {
  const token = getWebstoreToken();

  const res = await fetch(`${HEADLESS_BASE}/accounts/${token}/baskets/${basketIdent}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ package_id: packageId, quantity }),
  });

  if (!res.ok) {
    throw new Error(`Tebex add-package failed: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  return json.data as { ident: string; links: { checkout?: string } };
}

// Verifies the X-Tebex-Signature header: HMAC-SHA256(rawBody, webhookSecret).
// IMPORTANT: rawBody must be the exact, unparsed request body string.
export function verifyTebexWebhookSignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.TEBEX_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error('TEBEX_WEBHOOK_SECRET is not set. Add it in Vercel → Project → Settings → Environment Variables.');
  }
  if (!signatureHeader) return false;

  const crypto = require('crypto');
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}
