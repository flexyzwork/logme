/*
  Warnings:

  - You are about to drop the column `encryptedTemplateAppToken` on the `Site` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProviderExtended" ADD COLUMN     "templateId" TEXT;

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "encryptedTemplateAppToken";
