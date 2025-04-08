/*
  Warnings:

  - You are about to drop the `ContentSource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_contentSourceId_fkey";

-- DropTable
DROP TABLE "ContentSource";
