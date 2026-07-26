// PayPal Orders API v2 integration.
// Required env vars (set in Vercel):
//   NEXT_PUBLIC_PAYPAL_CLIENT_ID - from PayPal Developer Dashboard -> your app
//   PAYPAL_CLIENT_SECRET         - same app, server-only
//   PAYPAL_MODE                  - "live" or "sandbox" (defaults to "live")

function getBaseUrl() {
  return process.env.PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
}

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal is not configured. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel.');
  }

  const res = await fetch(`${getBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

export async function createPayPalOrder(totalAmount: number, referenceId: string) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${getBaseUrl()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: referenceId,
          amount: {
            currency_code: 'USD',
            value: totalAmount.toFixed(2),
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`PayPal order creation failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${getBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`PayPal capture failed: ${res.status} ${JSON.stringify(data)}`);
  }

  return data;
}
