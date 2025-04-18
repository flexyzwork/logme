import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
    
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'files.readme.io',]

  },
}

module.exports = nextConfig

export default nextConfig
