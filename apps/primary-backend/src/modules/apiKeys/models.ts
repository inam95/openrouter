import { t } from "elysia";

export namespace ApiKeyModel {
  export const createApiKeyBody = t.Object({
    name: t.String(),
  });

  export type CreateApiKeyBody = typeof createApiKeyBody.static;

  export const createApiKeyResponse = t.Object({
    id: t.String(),
    apiKey: t.String(),
  });

  export type CreateApiKeyResponse = typeof createApiKeyResponse.static;

  export const updateApiKeyBody = t.Object({
    disable: t.Boolean(),
  });

  export type UpdateApiKeyBody = typeof updateApiKeyBody.static;

  export const updateApiKeyResponse = t.Object({
    message: t.Literal("API key disabled successfully"),
  });

  export type UpdateApiKeyResponse = typeof updateApiKeyResponse.static;

  export const updateApiKeyFailedResponse = t.Object({
    message: t.Literal("Error occurred while disabling API key"),
  });

  export type UpdateApiKeyFailedResponse =
    typeof updateApiKeyFailedResponse.static;

  export const getApiKeysResponse = t.Object({
    apiKeys: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        apiKey: t.String(),
        lastUsed: t.Nullable(t.Date()),
        creditConsumed: t.Number(),
        disabled: t.Boolean(),
      })
    ),
  });

  export type GetApiKeysResponse = typeof getApiKeysResponse.static;

  export const deleteApiKeyResponse = t.Object({
    message: t.Literal("API key deleted successfully"),
  });

  export type DeleteApiKeyResponse = typeof deleteApiKeyResponse.static;

  export const deleteApiKeyFailedResponse = t.Object({
    message: t.Literal("Deleting API key unsuccessful"),
  });

  export type DeleteApiKeyFailedResponse =
    typeof deleteApiKeyFailedResponse.static;
}
