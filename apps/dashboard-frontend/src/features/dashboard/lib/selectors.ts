import type { ApiKey } from "@repo/contracts";

export type CreditTier = "low" | "watch" | "healthy";

export function getCreditTier(credits: number): CreditTier {
  if (credits >= 250) {
    return "healthy";
  }

  if (credits >= 100) {
    return "watch";
  }

  return "low";
}

export function getReserveWidth(credits: number) {
  return Math.min(100, Math.max(10, (credits / 300) * 100));
}

export function getApiKeysSummary(apiKeys: ApiKey[]) {
  const activeKeys = apiKeys.filter((apiKey) => !apiKey.disabled);
  const disabledKeys = apiKeys.length - activeKeys.length;
  const totalSpend = apiKeys.reduce(
    (total, apiKey) => total + apiKey.creditConsumed,
    0
  );
  const highestSpendKey = apiKeys.reduce<ApiKey | undefined>((currentHighest, apiKey) => {
    if (!currentHighest || apiKey.creditConsumed > currentHighest.creditConsumed) {
      return apiKey;
    }

    return currentHighest;
  }, undefined);
  const latestActivity = apiKeys
    .filter((apiKey) => apiKey.lastUsed)
    .toSorted(
      (left, right) =>
        new Date(String(right.lastUsed)).getTime() -
        new Date(String(left.lastUsed)).getTime()
    )
    .slice(0, 3);

  return {
    activeKeys,
    activeKeyCount: activeKeys.length,
    disabledKeys,
    totalSpend,
    highestSpendKey,
    latestActivity,
  };
}
