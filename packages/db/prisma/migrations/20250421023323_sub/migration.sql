/*
  Warnings:

  - You are about to drop the column `slug` on the `Site` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sub]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sub` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Site_slug_idx";

-- DropIndex
DROP INDEX "Site_slug_key";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "slug",
ADD COLUMN     "sub" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Site_sub_key" ON "Site"("sub");

-- CreateIndex
CREATE INDEX "Site_sub_idx" ON "Site"("sub");
