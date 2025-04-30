import { Queue, QueueEvents } from 'bullmq'
import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
export const redis = new Redis(REDIS_URL, {
  ...(process.env.NODE_ENV === 'production' ? { tls: {} } : {}),
  maxRetriesPerRequest: null,
})

export const QUEUE_NAME = 'queue'
export const queue = new Queue(QUEUE_NAME, { connection: redis })

export enum JobType {
  CheckDomain = 'check-domain',
}

export type JobData = {
  [JobType.CheckDomain]: {
    domain: string
    vercelProjectId: string
    vercelToken: string
    providerId: string
  }
}

export async function enqueue<T extends JobType>(type: T, data: JobData[T]) {
  return queue.add(type, data)
}

const queueEvents = new QueueEvents(QUEUE_NAME)
export async function enqueueAndWait<T extends JobType>(type: T, data: JobData[T]) {
  const job = await enqueue(type, data)
  await job.waitUntilFinished(queueEvents)
  return job
}
