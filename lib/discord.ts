export const DISCORD_SERVER =
  process.env.NEXT_PUBLIC_DISCORD_SERVER!;

export const DISCORD_WEBHOOK =
  process.env.DISCORD_WEBHOOK_URL!;

export const DISCORD_TICKET_CHANNEL =
  process.env.NEXT_PUBLIC_DISCORD_TICKET_CHANNEL!;

export function openDiscordServer() {
  if (typeof window !== 'undefined') {
    window.open(DISCORD_SERVER, '_blank');
  }
}

export function openClaimTicket(claimCode: string) {
  if (typeof window === 'undefined') return;

  const url = `${DISCORD_SERVER}`;

  navigator.clipboard.writeText(claimCode).catch(() => {});

  window.open(url, '_blank');
}