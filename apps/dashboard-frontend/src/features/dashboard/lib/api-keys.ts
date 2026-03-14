import { client } from "@/client";
import type { ApiKey, CreateApiKeyResponse } from "@repo/contracts";

import { getResponseErrorMessage } from "./response-errors";

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
