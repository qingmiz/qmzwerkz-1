export async function sendOrderEmail(
  email: string,
  subject: string,
  html: string
) {
  // TODO:
  // Resend
  // SendGrid
  // SMTP
  // Postmark

  console.log('Sending email to:', email);

  return {
    success: true,
  };
}

export async function sendClaimEmail(
  email: string,
  claimCode: string,
  prize: string
) {
  return sendOrderEmail(
    email,
    `Your QMZWERKZ Prize - ${prize}`,
    `
      <h2>Congratulations!</h2>

      <p>You won:</p>

      <h3>${prize}</h3>

      <p>Your Claim Code:</p>

      <h2>${claimCode}</h2>

      <p>Thank you for playing QMZWERKZ Daily Spin.</p>
    `
  );
}