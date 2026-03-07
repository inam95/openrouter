import { z } from "zod";

export const createApiKeyBodySchema = z.object({
  name: z.string(),
});

export type CreateApiKeyBody = z.infer<typeof createApiKeyBodySchema>;

export const createApiKeyResponseSchema = z.object({
  id: z.string(),
  apiKey: z.string(),
});

export type CreateApiKeyResponse = z.infer<typeof createApiKeyResponseSchema>;

export const updateApiKeyBodySchema = z.object({
  disable: z.boolean(),
});

export type UpdateApiKeyBody = z.infer<typeof updateApiKeyBodySchema>;

export const updateApiKeyResponseSchema = z.object({
  message: z.string(),
});

export type UpdateApiKeyResponse = z.infer<typeof updateApiKeyResponseSchema>;

export const updateApiKeyFailedResponseSchema = z.object({
  message: z.string(),
});

export type UpdateApiKeyFailedResponse = z.infer<
  typeof updateApiKeyFailedResponseSchema
>;

export const apiKeySchema = z.object({
  id: z.string(),
  name: z.string(),
  apiKey: z.string(),
  lastUsed: z.date().nullable(),
  creditConsumed: z.number(),
  disabled: z.boolean(),
});

export type ApiKey = z.infer<typeof apiKeySchema>;

export const getApiKeysResponseSchema = z.object({
  apiKeys: z.array(apiKeySchema),
});

export type GetApiKeysResponse = z.infer<typeof getApiKeysResponseSchema>;

export const deleteApiKeyResponseSchema = z.object({
  message: z.string(),
});

export type DeleteApiKeyResponse = z.infer<typeof deleteApiKeyResponseSchema>;

export const deleteApiKeyFailedResponseSchema = z.object({
  message: z.string(),
});

export type DeleteApiKeyFailedResponse = z.infer<
  typeof deleteApiKeyFailedResponseSchema
>;
