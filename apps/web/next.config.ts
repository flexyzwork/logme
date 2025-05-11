import { withSentryConfig } from '@sentry/nextjs'
import { withBetterStack } from '@logtail/next'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/db', '@repo/typescript-config', '@repo/eslint-config'],
  output: 'standalone',
  env: {
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
    DEBUG: process.env.DEBUG,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'files.readme.io'],
  },
  // Next.js 15.3.1 관련 기본 설정
  // Sentry를 위한 필수 설정
  serverExternalPackages: ['@sentry/nextjs'],

  // 실험적 기능 - 최소한으로 유지
  experimental: {
    // 서버 코드 최소화 활성화
    serverMinification: true,
  },


}

const sentryConfig = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'flexyz',
  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
})

// Use proper ES module exports for TypeScript config
export default withBetterStack(sentryConfig)
