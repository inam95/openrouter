const creditsFormatter = new Intl.NumberFormat("en-US");

export function maskApiKey(apiKey: string) {
  if (apiKey.length <= 10) {
    return apiKey;
  }

  return `${apiKey.slice(0, 8)}••••${apiKey.slice(-4)}`;
}

export function formatCredits(value: number) {
  return creditsFormatter.format(value);
}

export function formatLastUsed(value: Date | string | null) {
  if (!value) {
    return "Never used";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown activity";
  }

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    return "Moments ago";
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString();
}
