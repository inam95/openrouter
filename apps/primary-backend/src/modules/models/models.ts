import {
  getModelProvidersResponseSchema,
  getModelsResponseSchema,
  getProvidersResponseSchema,
} from "@repo/contracts";

export namespace ModelsModel {
  export const getModelsResponse = getModelsResponseSchema;
  export type GetModelsResponse = import("@repo/contracts").GetModelsResponse;

  export const getProvidersResponse = getProvidersResponseSchema;
  export type GetProvidersResponse =
    import("@repo/contracts").GetProvidersResponse;

  export const getModelProvidersResponse = getModelProvidersResponseSchema;
  export type GetModelProvidersResponse =
    import("@repo/contracts").GetModelProvidersResponse;
}
