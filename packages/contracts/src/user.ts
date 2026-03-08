import { z } from "zod";

export const getProfileResponseSchema = z.object({
  credits: z.number(),
});

export type GetProfileResponse = z.infer<typeof getProfileResponseSchema>;

export const getProfileFailedResponseSchema = z.object({
  message: z.string(),
});

export type GetProfileFailedResponse = z.infer<
  typeof getProfileFailedResponseSchema
>;
