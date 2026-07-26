// Posts a winner announcement to a Discord channel via an Incoming Webhook.
// Set DISCORD_WINNERS_WEBHOOK_URL in Vercel: create it in your Discord server
// under Channel Settings -> Integrations -> Webhooks -> New Webhook, then
// copy the Webhook URL. No bot application or bot token needed.
export async function notifyDiscordWinner(params: {
  discordId: string;
  prize: string;
  claimCode: string;
  spinUrl: string;
}) {
  const webhookUrl = process.env.DISCORD_WINNERS_WEBHOOK_URL;
  if (!webhookUrl) return; // Not configured yet - fail silently, spins still work.

  const { discordId, prize, claimCode, spinUrl } = params;

  const body = {
    content: `🎉 Congratulations <@${discordId}>!\n🏆 A new winner has claimed today's spin!`,
    embeds: [
      {
        title: '🎡 QMZWERKZ DAILY SPIN',
        description: "🎉 WE HAVE A WINNER!\n\nThanks for playing the QMZWERKZ Daily Spin!",
        color: 0xec4899,
        fields: [
          { name: '🏆 Prize Won', value: prize, inline: true },
          { name: '🎟️ Claim Code', value: `\`${claimCode}\``, inline: true },
          { name: '📩 Redeem Your Prize', value: 'Open a support ticket and paste your claim code to redeem it.' },
          { name: '🌐 Spin Again Tomorrow', value: spinUrl },
        ],
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('Discord webhook notification failed:', err);
  }
}
