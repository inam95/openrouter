import { client } from "@/client";
import type {
  ApiKey,
  CreateApiKeyResponse,
  GetProfileResponse,
  OnrampResponse,
} from "@repo/contracts";

export const dashboardQueryKeys = {
  profile: ["dashboard", "profile"] as const,
  apiKeys: ["dashboard", "api-keys"] as const,
};

export async function fetchProfile(): Promise<GetProfileResponse> {
  const response = await client.user.profile.get();

  if (response.status !== 200) {
    throw new Error(
      getResponseErrorMessage(
        response.error?.value,
        "We could not load your credit balance right now."
      )
    );
  }

  if (!response.data) {
    throw new Error("We could not load your credit balance right now.");
  }

  return response.data;
}

export async function fetchApiKeys(): Promise<{ apiKeys: ApiKey[] }> {
  const response = await client["api-keys"].get();

  if (response.status !== 200) {
    throw new Error(
      getResponseErrorMessage(
        response.error?.value,
        "We could not load your API keys."
      )
    );
  }

  if (!response.data) {
    throw new Error("We could not load your API keys.");
  }

  return response.data;
}

export async function createApiKey(name: string): Promise<CreateApiKeyResponse> {
  const response = await client["api-keys"].post({ name });

  if (response.status !== 200) {
    throw new Error(
      getResponseErrorMessage(
        response.error?.value,
        "We could not create your API key. Please try again."
      )
    );
  }

  if (!response.data) {
    throw new Error("We could not create your API key. Please try again.");
  }

  return response.data;
}

export async function onrampCredits(): Promise<OnrampResponse> {
  const response = await client.payments.onramp.post();

  if (response.status !== 200) {
    throw new Error(
      getResponseErrorMessage(
        response.error?.value,
        "We could not update your credits right now."
      )
    );
  }

  if (!response.data) {
    throw new Error("We could not update your credits right now.");
  }

  return response.data;
}

export function maskApiKey(apiKey: string) {
  if (apiKey.length <= 10) {
    return apiKey;
  }

  return `${apiKey.slice(0, 8)}••••${apiKey.slice(-4)}`;
}

export function formatCredits(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
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

function getResponseErrorMessage(errorValue: unknown, fallback: string) {
  if (typeof errorValue === "string") {
    return errorValue;
  }

  if (
    errorValue &&
    typeof errorValue === "object" &&
    "message" in errorValue &&
    typeof errorValue.message === "string"
  ) {
    return errorValue.message;
  }

  return fallback;
}
