/*
  Warnings:

  - A unique constraint covering the columns `[providerId,extendedKey,templateId]` on the table `ProviderExtended` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProviderExtended_providerId_extendedKey_key";

-- CreateIndex
CREATE UNIQUE INDEX "ProviderExtended_providerId_extendedKey_templateId_key" ON "ProviderExtended"("providerId", "extendedKey", "templateId");
