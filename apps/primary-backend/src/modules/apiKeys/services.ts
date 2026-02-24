import { prisma } from "db";

const API_KEY_LENGTH = 20;
const ALPHABET_SET =
  "zxcvbnmasdfghjklqwertyuiopASDFGHJKLZXCVBNQWERTYUIOP123456789=";

export abstract class ApiKeyService {
  static createRandomApiKey() {
    let suffixKey = "";
    for (let i = 0; i < API_KEY_LENGTH; i++) {
      suffixKey +=
        ALPHABET_SET[Math.floor(Math.random() * ALPHABET_SET.length)];
    }

    return `sk-or-v1-${suffixKey}`;
  }

  static async createApiKey(
    name: string,
    userId: string
  ): Promise<{ id: string; apiKey: string }> {
    const apiKey = ApiKeyService.createRandomApiKey();
    const apiKeyDb = await prisma.apiKey.create({
      data: {
        name,
        apiKey,
        userId,
      },
    });

    return {
      id: apiKeyDb.id,
      apiKey,
    };
  }

  static async getApiKeys(userId: string) {
    const apiKeys = prisma.apiKey.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        apiKey: true,
        name: true,
        lastUsed: true,
        creditConsumed: true,
        disabled: true,
      },
    });
    return apiKeys;
  }

  static async updateApiKeyDisabled(
    apiKeyId: string,
    userId: string,
    disable: boolean
  ) {
    await prisma.apiKey.update({
      where: {
        id: apiKeyId,
        userId,
      },
      data: {
        disabled: true,
      },
    });
  }

  static async deleteApiKey(id: string, userId: string) {
    await prisma.apiKey.update({
      where: {
        id,
        userId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
