/*
  Warnings:

  - You are about to drop the column `logUrl` on the `Deployment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deployId]` on the table `Deployment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deployId` to the `Deployment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "DeployStatus" ADD VALUE 'deploying';

-- AlterTable
ALTER TABLE "Deployment" DROP COLUMN "logUrl",
ADD COLUMN     "deployId" TEXT NOT NULL,
ADD COLUMN     "deployUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_deployId_key" ON "Deployment"("deployId");

-- CreateIndex
CREATE INDEX "Deployment_deployId_idx" ON "Deployment"("deployId");
