import { t } from "elysia";

export namespace ModelsModel {
  export const getModelsResponse = t.Object({
    models: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        slug: t.String(),
        company: t.Object({
          id: t.String(),
          name: t.String(),
          website: t.String(),
        }),
      })
    ),
  });

  export type GetModelsResponse = typeof getModelsResponse.static;

  export const getProvidersResponse = t.Object({
    providers: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        website: t.String(),
      })
    ),
  });

  export type GetProvidersResponse = typeof getProvidersResponse.static;

  export const getModelProvidersResponse = t.Object({
    providers: t.Array(
      t.Object({
        id: t.String(),
        providerId: t.String(),
        providerName: t.String(),
        providerWebsite: t.String(),
        inputTokenCost: t.Number(),
        outputTokenCost: t.Number(),
      })
    ),
  });
}
