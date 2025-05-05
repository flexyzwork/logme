import { JobType, QUEUE_NAME, connection } from '@repo/queue'
import { Worker } from 'bullmq'
import { runCheckDomain } from './jobs/check-domain'
import { logger, logtail } from './logger'

const runners = {
  [JobType.CheckDomain]: runCheckDomain,
}

new Worker(
  QUEUE_NAME,
  async (job) => {
    const runner = runners[job.name as JobType]
    if (!runner) {
      logger.error(`Unknown job type`, job.name)
      logtail.flush()
      throw new Error(`Unknown job type ${job.name}`)
    }

    logger.info(`[${job.id}] ${job.name} - Running...`)
    logtail.flush()
    await runner(job.data)
    logger.info(`[${job.id}] ${job.name} - Completed`)
    logtail.flush()
  },
  {
    connection,
    drainDelay: 60000,
    stalledInterval: 60000, 
  }
)
