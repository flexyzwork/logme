-- CreateTable
CREATE TABLE "YoutubeChannelStats" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "subscriber_count" INTEGER NOT NULL,
    "view_count" INTEGER,
    "video_count" INTEGER,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YoutubeChannelStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeVideoStats" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "view_count" INTEGER,
    "like_count" INTEGER,
    "comment_count" INTEGER,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YoutubeVideoStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeAlertLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "message" TEXT,
    "notifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YoutubeAlertLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "YoutubeChannelStats_channelId_checked_at_idx" ON "YoutubeChannelStats"("channelId", "checked_at");

-- CreateIndex
CREATE INDEX "YoutubeVideoStats_videoId_checked_at_idx" ON "YoutubeVideoStats"("videoId", "checked_at");

-- CreateIndex
CREATE INDEX "YoutubeAlertLog_type_targetId_idx" ON "YoutubeAlertLog"("type", "targetId");
