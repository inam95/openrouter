import { z } from "zod";

export const onrampResponseSchema = z.object({
  message: z.string(),
  credits: z.number(),
});

export type OnrampResponse = z.infer<typeof onrampResponseSchema>;

export const onrampFailedResponseSchema = z.object({
  message: z.string(),
});

export type OnrampFailedResponse = z.infer<typeof onrampFailedResponseSchema>;
