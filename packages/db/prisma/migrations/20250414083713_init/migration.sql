/*
  Warnings:

  - A unique constraint covering the columns `[contentSourceId]` on the table `Site` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Site_contentSourceId_key" ON "Site"("contentSourceId");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_contentSourceId_fkey" FOREIGN KEY ("contentSourceId") REFERENCES "ContentSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
