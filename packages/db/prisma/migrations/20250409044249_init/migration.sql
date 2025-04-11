/*
  Warnings:

  - The values [queued] on the enum `SiteStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SiteStatus_new" AS ENUM ('draft', 'published', 'error');
ALTER TABLE "Site" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Site" ALTER COLUMN "status" TYPE "SiteStatus_new" USING ("status"::text::"SiteStatus_new");
ALTER TYPE "SiteStatus" RENAME TO "SiteStatus_old";
ALTER TYPE "SiteStatus_new" RENAME TO "SiteStatus";
DROP TYPE "SiteStatus_old";
ALTER TABLE "Site" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;
