import {
  createApiKeyBodySchema,
  createApiKeyResponseSchema,
  deleteApiKeyFailedResponseSchema,
  deleteApiKeyResponseSchema,
  getApiKeysResponseSchema,
  updateApiKeyBodySchema,
  updateApiKeyFailedResponseSchema,
  updateApiKeyResponseSchema,
} from "@repo/contracts";

export namespace ApiKeyModel {
  export const createApiKeyBody = createApiKeyBodySchema;
  export type CreateApiKeyBody = import("@repo/contracts").CreateApiKeyBody;

  export const createApiKeyResponse = createApiKeyResponseSchema;
  export type CreateApiKeyResponse =
    import("@repo/contracts").CreateApiKeyResponse;

  export const updateApiKeyBody = updateApiKeyBodySchema;
  export type UpdateApiKeyBody = import("@repo/contracts").UpdateApiKeyBody;

  export const updateApiKeyResponse = updateApiKeyResponseSchema;
  export type UpdateApiKeyResponse =
    import("@repo/contracts").UpdateApiKeyResponse;

  export const updateApiKeyFailedResponse = updateApiKeyFailedResponseSchema;
  export type UpdateApiKeyFailedResponse =
    import("@repo/contracts").UpdateApiKeyFailedResponse;

  export const getApiKeysResponse = getApiKeysResponseSchema;
  export type GetApiKeysResponse =
    import("@repo/contracts").GetApiKeysResponse;

  export const deleteApiKeyResponse = deleteApiKeyResponseSchema;
  export type DeleteApiKeyResponse =
    import("@repo/contracts").DeleteApiKeyResponse;

  export const deleteApiKeyFailedResponse = deleteApiKeyFailedResponseSchema;
  export type DeleteApiKeyFailedResponse =
    import("@repo/contracts").DeleteApiKeyFailedResponse;
}
