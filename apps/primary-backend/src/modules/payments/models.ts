import { t } from "elysia";

export namespace PaymentModel {
  export const onrampResponse = t.Object({
    message: t.Literal("Onramp successful"),
    credits: t.Number(),
  });

  export type OnrampResponse = typeof onrampResponse.static;

  export const onrampFailedResponse = t.Object({
    message: t.Literal("Onramp failed"),
  });

  export type OnrampFailedResponse = typeof onrampFailedResponse.static;
}
