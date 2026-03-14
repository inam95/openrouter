import { client } from "@/client";
import type { GetProfileResponse } from "@repo/contracts";

import { getResponseErrorMessage } from "./response-errors";

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
