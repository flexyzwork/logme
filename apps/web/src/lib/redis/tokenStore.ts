import { logger } from '@/lib/logger'
import { getRedisClient } from './client'

const TOKEN_PREFIX = 'token:'

export async function storeProviderToken(
  userId: string,
  provider: 'notion' | 'github' | 'vercel',
  accessToken: string,
) {
  const redis = getRedisClient()
  await redis.hset(`${TOKEN_PREFIX}${userId}`, {
    [provider]: accessToken,
  })
  await redis.expire(`${TOKEN_PREFIX}${userId}`, 1 * 60 * 60) // 1시간 TTL
}

export async function getProviderToken(
  userId: string,
  provider: 'notion' | 'github' | 'vercel',
) {
  const redis = getRedisClient()
  logger.debug(`[debug] fetching token from Redis: userId=${userId}, provider=${provider}`)
  const token = await redis.hget<string>(`${TOKEN_PREFIX}${userId}`, provider)
  logger.debug(`[debug] token result: ${token}`)
  return token
}

export async function getAllTokens(userId: string) {
  const redis = getRedisClient()
  return await redis.hgetall<{
    notion?: string
    github?: string
    vercel?: string
    githubApp?: string
  }>(`${TOKEN_PREFIX}${userId}`)
}

export async function deleteProviderToken(
  userId: string,
  provider: 'notion' | 'github' | 'vercel' | 'githubApp',
) {
  const redis = getRedisClient()
  return await redis.hdel(`${TOKEN_PREFIX}${userId}`, provider)
}

export async function deleteAllTokens(userId: string) {
  const redis = getRedisClient()
  return await redis.del(`${TOKEN_PREFIX}${userId}`)
}

export async function hasToken(userId: string) {
  const redis = getRedisClient()
  return await redis.exists(`${TOKEN_PREFIX}${userId}`)
}
