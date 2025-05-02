import cron from 'node-cron'
import { JobType, QUEUE_NAME, connection } from '@repo/queue'
import { Worker } from 'bullmq'
import { runCheckDomain } from './jobs/check-domain'
import { checkStats } from './youtube/checkStats'

cron.schedule('* */3 * * *', async () => {
  console.log('🔄 Running YouTube stats check...')
  await checkStats()
})

const runners = {
  [JobType.CheckDomain]: runCheckDomain,
}

new Worker(
  QUEUE_NAME,
  async (job) => {
    const runner = runners[job.name as JobType]
    if (!runner) {
      console.error(`Unknown job type`, job.name)
      throw new Error(`Unknown job type ${job.name}`)
    }

    console.log(`[${job.id}] ${job.name} - Running...`, job.data)
    await runner(job.data)
    console.log(`[${job.id}] ${job.name} - Completed`)
  },
  { connection }
)
