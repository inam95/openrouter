import { z } from "zod";

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  website: z.string(),
});

export type Company = z.infer<typeof companySchema>;

export const modelSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  company: companySchema,
});

export type Model = z.infer<typeof modelSchema>;

export const getModelsResponseSchema = z.object({
  models: z.array(modelSchema),
});

export type GetModelsResponse = z.infer<typeof getModelsResponseSchema>;

export const providerSchema = z.object({
  id: z.string(),
  name: z.string(),
  website: z.string(),
});

export type Provider = z.infer<typeof providerSchema>;

export const getProvidersResponseSchema = z.object({
  providers: z.array(providerSchema),
});

export type GetProvidersResponse = z.infer<typeof getProvidersResponseSchema>;

export const modelProviderSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  providerWebsite: z.string(),
  inputTokenCost: z.number(),
  outputTokenCost: z.number(),
});

export type ModelProvider = z.infer<typeof modelProviderSchema>;

export const getModelProvidersResponseSchema = z.object({
  providers: z.array(modelProviderSchema),
});

export type GetModelProvidersResponse = z.infer<
  typeof getModelProvidersResponseSchema
>;
