import {
  onrampFailedResponseSchema,
  onrampResponseSchema,
} from "@repo/contracts";

export namespace PaymentModel {
  export const onrampResponse = onrampResponseSchema;
  export type OnrampResponse = import("@repo/contracts").OnrampResponse;

  export const onrampFailedResponse = onrampFailedResponseSchema;
  export type OnrampFailedResponse =
    import("@repo/contracts").OnrampFailedResponse;
}
