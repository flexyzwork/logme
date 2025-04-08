/*
  Warnings:

  - The `plan` column on the `UserPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `theme` column on the `UserSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `language` column on the `UserSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('blog', 'resume', 'portfolio', 'custom');

-- CreateEnum
CREATE TYPE "SiteType" AS ENUM ('blog', 'resume', 'portfolio');

-- CreateEnum
CREATE TYPE "DomainType" AS ENUM ('sub', 'custom');

-- CreateEnum
CREATE TYPE "SiteStatus" AS ENUM ('draft', 'queued', 'published', 'error');

-- CreateEnum
CREATE TYPE "BuildStatus" AS ENUM ('queued', 'building', 'success', 'error');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('notion');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('light', 'dark', 'system');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('free', 'pro', 'team');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ko', 'en', 'ja', 'zh');

-- AlterTable
ALTER TABLE "UserPlan" DROP COLUMN "plan",
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'free';

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "theme",
ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'system',
DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'ko';

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "templatesType" "TemplateType" NOT NULL,
    "templateTitle" TEXT NOT NULL,
    "templateDescription" TEXT,
    "thumbnailUrl" TEXT,
    "templateSourceId" TEXT NOT NULL,
    "templateSourceUrl" TEXT NOT NULL,
    "templateAppId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateApp" (
    "id" TEXT NOT NULL,
    "appClientId" TEXT NOT NULL,
    "appClientSecret" TEXT NOT NULL,
    "appRedirectUri" TEXT NOT NULL,
    "appOwnerEmail" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "TemplateApp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "siteType" "SiteType" DEFAULT 'blog',
    "slug" TEXT NOT NULL,
    "siteTitle" TEXT,
    "siteDescription" TEXT,
    "userId" TEXT NOT NULL,
    "templateId" TEXT,
    "encryptedTemplateAppToken" TEXT,
    "contentSourceId" TEXT,
    "repoId" TEXT,
    "deployTargetId" TEXT,
    "domainType" "DomainType" NOT NULL DEFAULT 'sub',
    "domain" TEXT,
    "status" "SiteStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentSource" (
    "id" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL DEFAULT 'notion',
    "sourceId" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Build" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "status" "BuildStatus" NOT NULL,
    "logs" TEXT,
    "outputUrl" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_templateSourceId_key" ON "Template"("templateSourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Template_templateSourceUrl_key" ON "Template"("templateSourceUrl");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateApp_templateId_key" ON "TemplateApp"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_slug_key" ON "Site"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Site_contentSourceId_key" ON "Site"("contentSourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_repoId_key" ON "Site"("repoId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_deployTargetId_key" ON "Site"("deployTargetId");

-- CreateIndex
CREATE INDEX "Site_userId_idx" ON "Site"("userId");

-- CreateIndex
CREATE INDEX "Site_templateId_idx" ON "Site"("templateId");

-- CreateIndex
CREATE INDEX "Site_contentSourceId_idx" ON "Site"("contentSourceId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentSource_sourceId_key" ON "ContentSource"("sourceId");

-- AddForeignKey
ALTER TABLE "TemplateApp" ADD CONSTRAINT "TemplateApp_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_contentSourceId_fkey" FOREIGN KEY ("contentSourceId") REFERENCES "ContentSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
