import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { ApiKeyService } from "./services";
import { AuthModel } from "../auth/models";
import { ApiKeyModel } from "./models";

export const app = new Elysia({ prefix: "api-keys" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .resolve(async ({ cookie, status, jwt }) => {
    if (!cookie.auth) {
      return status(401);
    }
    const decoded = await jwt.verify(cookie.auth.value as string);
    if (!decoded || !decoded.userId) {
      return status(401);
    }
    return {
      userId: decoded.userId as string,
    };
  })
  .post(
    "/",
    async ({ userId, body }) => {
      const { apiKey, id } = await ApiKeyService.createApiKey(
        body.name,
        userId
      );
      return {
        apiKey,
        id,
      };
    },
    {
      body: ApiKeyModel.createApiKeyBody,
      response: {
        200: ApiKeyModel.createApiKeyResponse,
      },
    }
  )
  .get(
    "/",
    async ({ userId }) => {
      const apiKeys = await ApiKeyService.getApiKeys(userId);
      return { apiKeys };
    },
    {
      response: {
        200: ApiKeyModel.getApiKeysResponse,
      },
    }
  )
  .put(
    ":id",
    async ({ params: { id }, userId, body: { disable }, status }) => {
      try {
        await ApiKeyService.updateApiKeyDisabled(id, userId, disable);
        return {
          message: "API key disabled successfully",
        };
      } catch (error) {
        return status(411, {
          message: "Error occurred while disabling API key",
        });
      }
    },
    {
      body: ApiKeyModel.updateApiKeyBody,
      response: {
        200: ApiKeyModel.updateApiKeyResponse,
        411: ApiKeyModel.updateApiKeyFailedResponse,
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, status, userId }) => {
      try {
        await ApiKeyService.deleteApiKey(id, userId);
        return {
          message: "API key deleted successfully",
        };
      } catch (error) {
        return status(411, {
          message: "Deleting API key unsuccessful",
        });
      }
    },
    {
      response: {
        200: ApiKeyModel.deleteApiKeyResponse,
        411: ApiKeyModel.deleteApiKeyFailedResponse,
      },
    }
  );
