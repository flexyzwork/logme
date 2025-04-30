import { db } from '@repo/db'
import { JobData, JobType } from '@repo/queue'
import fetch from 'node-fetch'

const MAX_RETRIES = 10
const RETRY_DELAY_MS = 1000 * 15

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const runCheckDomain = async (data: JobData[JobType.CheckDomain]) => {
  const { domain, vercelProjectId, vercelToken } = data

  await new Promise((resolve) => setTimeout(resolve, 60 * 1000))
  console.log('🔍 Starting domain verification job with data:', { domain, vercelProjectId })

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

      console.log(`📦 Attempt ${attempt}: verified = ${isVerified}`)

      await db.domainVerification.updateMany({
        where: { subdomain: domain },
        data: {
          verified: isVerified,
          retries: { increment: 1 },
        },
      })

      if (isVerified) {
        console.log(`✅ Domain verified on attempt ${attempt}`)
        break
      } else if (attempt < MAX_RETRIES) {
        console.log(`⏳ Not verified yet. Retrying in ${RETRY_DELAY_MS / 1000}s...`)
        await sleep(RETRY_DELAY_MS)
      } else {
        console.log(`❌ Max retries reached. Domain not verified.`)
      }
    } catch (err) {
      console.error(`❌ Error on attempt ${attempt}:`, err)
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS)
      }
    }
  }
}
