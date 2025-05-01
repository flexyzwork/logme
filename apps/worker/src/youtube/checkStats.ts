import { google } from 'googleapis'
import { db } from '@repo/db'
import 'dotenv/config'

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID!
const API_KEY = process.env.YOUTUBE_API_KEY!
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!

if (!CHANNEL_ID || !API_KEY) {
  throw new Error('환경변수 YOUTUBE_CHANNEL_ID 또는 YOUTUBE_API_KEY가 설정되지 않았습니다.')
}

const yt = google.youtube({
  version: 'v3',
  auth: API_KEY,
})

const SUB_DELTA_THRESHOLD = parseInt(process.env.YOUTUBE_ALERT_SUB_DELTA || '2')
const VIEW_DELTA_THRESHOLD = parseInt(process.env.YOUTUBE_ALERT_VIEW_DELTA || '20')

export async function checkStats() {
  try {
    const statRes = await yt.channels.list({
      part: ['statistics'],
      id: [CHANNEL_ID],
    })
    const stats = statRes.data.items?.[0]?.statistics
    if (!stats) throw new Error('No stats found')

    const newSubs = parseInt(stats.subscriberCount || '0')
    let newViews = 0
    let newVideos = 0

    const last = await db.youtubeChannelStats.findFirst({
      where: { channelId: CHANNEL_ID },
      orderBy: { checked_at: 'desc' },
    })

    const lastSubs = last?.subscriber_count || 0
    const lastViews = last?.view_count || 0
    const deltaSubs = newSubs - lastSubs

    const recentChannelAlert = await db.youtubeAlertLog.findFirst({
      where: { type: 'channel', targetId: CHANNEL_ID },
      orderBy: { notifiedAt: 'desc' },
    })

    const lastAlertTime = recentChannelAlert?.notifiedAt ?? new Date(0)
    const lastStatTime = last?.checked_at ?? new Date(0)

    const contentRes = await yt.channels.list({
      part: ['contentDetails'],
      id: [CHANNEL_ID],
    })
    const uploadsPlaylistId = contentRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
    if (!uploadsPlaylistId) throw new Error('No uploads playlist found')

    const playlistRes = await yt.playlistItems.list({
      part: ['contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults: 10,
    })

    const videoIds =
      playlistRes.data.items
        ?.map((item) => item.contentDetails?.videoId)
        .filter((id): id is string => !!id) || []
    if (videoIds.length === 0) throw new Error('No video IDs found')

    const videoRes = await yt.videos.list({
      part: ['snippet', 'statistics'],
      id: videoIds,
    })

    let aggregatedViews = 0
    for (const item of videoRes.data.items || []) {
      const videoId = item.id!
      const title = item.snippet?.title || ''
      const views = parseInt(item.statistics?.viewCount || '0')
      const likes = parseInt(item.statistics?.likeCount || '0')
      const comments = parseInt(item.statistics?.commentCount || '0')

      aggregatedViews += views

      const prev = await db.youtubeVideoStats.findFirst({
        where: { videoId },
        orderBy: { checked_at: 'desc' },
      })

      const prevViews = prev?.view_count || 0
      const delta = views - prevViews

      const recentVideoAlert = await db.youtubeAlertLog.findFirst({
        where: { type: 'video', targetId: videoId },
        orderBy: { notifiedAt: 'desc' },
      })

      const lastVideoAlertTime = recentVideoAlert?.notifiedAt ?? new Date(0)
      const lastVideoStatTime = prev?.checked_at ?? new Date(0)

      const shouldVideoNotify = delta >= 100 && lastVideoStatTime > lastVideoAlertTime
      if (shouldVideoNotify) {
        const message = `📹 영상 조회수 급등\n"${title}"\n조회수: +${delta} (${prevViews} → ${views})`
        await fetch(SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: message }),
        })

        await db.youtubeAlertLog.create({
          data: {
            type: 'video',
            targetId: videoId,
            message,
          },
        })
      }

      await db.youtubeVideoStats.create({
        data: {
          videoId,
          channelId: CHANNEL_ID,
          title,
          view_count: views,
          like_count: likes,
          comment_count: comments,
        },
      })
    }

    newViews = aggregatedViews
    newVideos = videoIds.length

    const deltaViews = newViews - lastViews
    const shouldNotify =
      (deltaSubs >= SUB_DELTA_THRESHOLD || deltaViews >= VIEW_DELTA_THRESHOLD) &&
      lastStatTime > lastAlertTime

    if (shouldNotify) {
      const text =
        `📊 YouTube 채널 변화 알림\n` +
        (deltaSubs >= SUB_DELTA_THRESHOLD
          ? `📈 구독자: +${deltaSubs} (${lastSubs} → ${newSubs})\n`
          : '') +
        (deltaViews >= VIEW_DELTA_THRESHOLD
          ? `👁 조회수: +${deltaViews} (${lastViews} → ${newViews})\n`
          : '')

      await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      await db.youtubeAlertLog.create({
        data: {
          type: 'channel',
          targetId: CHANNEL_ID,
          message: text,
        },
      })
    }

    await db.youtubeChannelStats.create({
      data: {
        channelId: CHANNEL_ID,
        subscriber_count: newSubs,
        view_count: newViews,
        video_count: newVideos,
      },
    })

    console.log('✅ YouTube stats check complete', {
      delta: { subscribers: deltaSubs, views: deltaViews },
      notified: shouldNotify,
    })
  } catch (err) {
    console.error('❌ Failed to fetch stats', err)
  }
}
