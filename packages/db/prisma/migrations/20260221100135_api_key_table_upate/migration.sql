/*
  Warnings:

  - You are about to drop the column `apiKey` on the `api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `apiKeyId` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `inputTokenCount` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `modelProviderMappingId` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `outputTokenCount` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `inputTokenCost` on the `model_provider_mappings` table. All the data in the column will be lost.
  - You are about to drop the column `modelId` on the `model_provider_mappings` table. All the data in the column will be lost.
  - You are about to drop the column `outputTokenCost` on the `model_provider_mappings` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `model_provider_mappings` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `models` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `onramp_transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[api_key]` on the table `api_keys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `api_key` to the `api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_consumed` to the `api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `api_key_id` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input_token_count` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_provider_mapping_id` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output_token_count` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `input_token_cost` to the `model_provider_mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_id` to the `model_provider_mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `output_token_cost` to the `model_provider_mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_id` to the `model_provider_mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `models` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `onramp_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_userId_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_apiKeyId_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_modelProviderMappingId_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_userId_fkey";

-- DropForeignKey
ALTER TABLE "model_provider_mappings" DROP CONSTRAINT "model_provider_mappings_modelId_fkey";

-- DropForeignKey
ALTER TABLE "model_provider_mappings" DROP CONSTRAINT "model_provider_mappings_providerId_fkey";

-- DropForeignKey
ALTER TABLE "models" DROP CONSTRAINT "models_companyId_fkey";

-- DropForeignKey
ALTER TABLE "onramp_transactions" DROP CONSTRAINT "onramp_transactions_userId_fkey";

-- DropIndex
DROP INDEX "api_keys_apiKey_key";

-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "apiKey",
DROP COLUMN "userId",
ADD COLUMN     "api_key" TEXT NOT NULL,
ADD COLUMN     "credit_consumed" INTEGER NOT NULL,
ADD COLUMN     "last_used" TIMESTAMP(3),
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "apiKeyId",
DROP COLUMN "inputTokenCount",
DROP COLUMN "modelProviderMappingId",
DROP COLUMN "outputTokenCount",
DROP COLUMN "userId",
ADD COLUMN     "api_key_id" TEXT NOT NULL,
ADD COLUMN     "input_token_count" INTEGER NOT NULL,
ADD COLUMN     "model_provider_mapping_id" TEXT NOT NULL,
ADD COLUMN     "output_token_count" INTEGER NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "model_provider_mappings" DROP COLUMN "inputTokenCost",
DROP COLUMN "modelId",
DROP COLUMN "outputTokenCost",
DROP COLUMN "providerId",
ADD COLUMN     "input_token_cost" INTEGER NOT NULL,
ADD COLUMN     "model_id" TEXT NOT NULL,
ADD COLUMN     "output_token_cost" INTEGER NOT NULL,
ADD COLUMN     "provider_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "models" DROP COLUMN "companyId",
ADD COLUMN     "company_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "onramp_transactions" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_api_key_key" ON "api_keys"("api_key");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_provider_mappings" ADD CONSTRAINT "model_provider_mappings_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_provider_mappings" ADD CONSTRAINT "model_provider_mappings_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onramp_transactions" ADD CONSTRAINT "onramp_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "api_keys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_model_provider_mapping_id_fkey" FOREIGN KEY ("model_provider_mapping_id") REFERENCES "model_provider_mappings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
