import { client } from "@/client";
import type { OnrampResponse } from "@repo/contracts";

import { getResponseErrorMessage } from "./response-errors";

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
