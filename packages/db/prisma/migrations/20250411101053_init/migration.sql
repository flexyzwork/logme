/*
  Warnings:

  - A unique constraint covering the columns `[repoId]` on the table `Site` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deployTargetId]` on the table `Site` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DeployStatus" AS ENUM ('pending', 'success', 'error', 'cancelled');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('github', 'notion', 'vercel', 'google');

-- CreateEnum
CREATE TYPE "RepoType" AS ENUM ('github', 'gitlab', 'bitbucket');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('vercel', 'netlify', 'aws', 'cloudflare', 'custom');

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "deployTargetId" TEXT,
ADD COLUMN     "repoId" TEXT;

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "deployTargetId" TEXT NOT NULL,
    "status" "DeployStatus",
    "logUrl" TEXT,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "providerType" "ProviderType" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderExtended" (
    "id" TEXT NOT NULL,
    "providerType" "ProviderType" NOT NULL,
    "extendedKey" TEXT NOT NULL,
    "extendedValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "providerId" TEXT NOT NULL,

    CONSTRAINT "ProviderExtended_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Repo" (
    "id" TEXT NOT NULL,
    "repoType" "RepoType" NOT NULL DEFAULT 'github',
    "repoId" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "repoUrl" TEXT,
    "repoOwner" TEXT NOT NULL,
    "repoBranch" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeployTarget" (
    "id" TEXT NOT NULL,
    "targetType" "TargetType" NOT NULL DEFAULT 'vercel',
    "targetId" TEXT NOT NULL,
    "targetName" TEXT NOT NULL,
    "targetUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeployTarget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Deployment_deployTargetId_idx" ON "Deployment"("deployTargetId");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_providerType_providerUserId_key" ON "Provider"("providerType", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderExtended_providerId_extendedKey_key" ON "ProviderExtended"("providerId", "extendedKey");

-- CreateIndex
CREATE UNIQUE INDEX "ContentSource_sourceId_key" ON "ContentSource"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Repo_repoId_key" ON "Repo"("repoId");

-- CreateIndex
CREATE UNIQUE INDEX "DeployTarget_targetId_key" ON "DeployTarget"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_repoId_key" ON "Site"("repoId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_deployTargetId_key" ON "Site"("deployTargetId");

-- CreateIndex
CREATE INDEX "Site_contentSourceId_idx" ON "Site"("contentSourceId");

-- CreateIndex
CREATE INDEX "Site_repoId_idx" ON "Site"("repoId");

-- CreateIndex
CREATE INDEX "Site_deployTargetId_idx" ON "Site"("deployTargetId");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_deployTargetId_fkey" FOREIGN KEY ("deployTargetId") REFERENCES "DeployTarget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_deployTargetId_fkey" FOREIGN KEY ("deployTargetId") REFERENCES "DeployTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderExtended" ADD CONSTRAINT "ProviderExtended_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
