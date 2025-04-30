-- CreateTable
CREATE TABLE "DomainVerification" (
    "id" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "vercelProjectId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DomainVerification_pkey" PRIMARY KEY ("id")
);
