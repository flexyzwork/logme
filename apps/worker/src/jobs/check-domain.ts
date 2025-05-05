import { db } from '@repo/db'
import { JobData, JobType } from '@repo/queue'
import fetch from 'node-fetch'
import { logger, logtail } from '../logger'

const MAX_RETRIES = 10
const RETRY_DELAY_MS = 1000 * 60

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const runCheckDomain = async (data: JobData[JobType.CheckDomain]) => {
  const { domain, vercelProjectId, vercelToken } = data

  logger.info('🔍 Starting domain verification job with data:', { domain, vercelProjectId })
  logtail.flush()
  logger.info('🔁 Triggering domain verification...')
  logtail.flush()
  await fetch(`https://api.vercel.com/v9/projects/${vercelProjectId}/domains/${domain}/verify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    },
  })

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(
        `https://api.vercel.com/v9/projects/${vercelProjectId}/domains/${domain}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      interface VercelDomainResponse {
        verified: boolean
        // Add other expected properties here if needed
      }

      const result = (await res.json()) as VercelDomainResponse
      const isVerified = result.verified === true

      logger.info(`📦 Attempt ${attempt}: verified = ${isVerified}`)
      logtail.flush()

      await db.domainVerification.updateMany({
        where: { subdomain: domain },
        data: {
          verified: isVerified,
          retries: { increment: 1 },
        },
      })

      if (isVerified) {
        logger.info(`Domain verified on attempt ${attempt}`)
        logtail.flush()
        break
      } else if (attempt < MAX_RETRIES) {
        logger.info(`⏳ Not verified yet. Retrying in ${RETRY_DELAY_MS / 1000}s...`)
        logtail.flush()
        await sleep(RETRY_DELAY_MS)
      } else {
        logger.info(`❌ Max retries reached. Domain not verified.`)
        logtail.flush()
      }
    } catch (err) {
      logger.error(`❌ Error on attempt ${attempt}:`, err)
      logtail.flush()
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS)
      }
    }
  }
}
