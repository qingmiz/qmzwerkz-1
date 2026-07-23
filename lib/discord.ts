export async function sendDiscordNotification(title: string, description: string, color: number = 15728880) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [
          {
            title: `QMZWERKZ // ${title}`,
            description: description,
            color: color,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (err) {
    console.error('Failed to dispatch Discord webhook:', err);
  }
}