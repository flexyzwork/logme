FROM node:22-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!


FROM base AS pruner
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 
# to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat && npm install -g turbo pnpm
# Set working directory
WORKDIR /app
COPY . .
# 필터링하지 말고 전체 터보 푸룬 도커
RUN turbo prune web --docker
# 아래는 잘못된 부분
# RUN turbo prune --scope=web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat && npm install -g pnpm
WORKDIR /app
# First install the dependencies (as they change less often)
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=pruner /app/out/full/ .
# 이게 없으면 빌드가 안됨 (경로 중요, web 폴더 안에 .env 파일이 있어야 함)
COPY ./apps/web/.env  ./apps/web/.env

# 아래는 틀렸던 부분
# COPY .env .env
# RUN pnpm add -D dotenv-cli --ignore-workspace-root-check

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Turborepo 전체에서 build 실행
RUN pnpm turbo run build
# 아래는 잘못된 부분
# RUN npx dotenv -e .env -- pnpm --filter web build



FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && apk add --no-cache curl

USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# 불필요한 캐시 제거 (의미 없음... 크기 변화 없음)
# RUN rm -rf .next/cache

CMD node apps/web/server.js
