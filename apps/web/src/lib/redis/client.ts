import { Redis } from '@upstash/redis'
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '@/lib/config/server'

export function getRedisClient() {
  return new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  })
}
