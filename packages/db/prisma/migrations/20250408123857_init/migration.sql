/*
  Warnings:

  - You are about to drop the column `deployTargetId` on the `Site` table. All the data in the column will be lost.
  - You are about to drop the column `repoId` on the `Site` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Site_deployTargetId_key";

-- DropIndex
DROP INDEX "Site_repoId_key";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "deployTargetId",
DROP COLUMN "repoId";
