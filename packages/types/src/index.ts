// src/prisma-types.ts

// 템플릿 타입
export enum TemplateType {
  blog = 'blog',
  resume = 'resume',
  portfolio = 'portfolio',
  custom = 'custom',
}

// 사이트 타입
export enum SiteType {
  blog = 'blog',
  resume = 'resume',
  portfolio = 'portfolio',
}

// 도메인 타입
export enum DomainType {
  sub = 'sub',      // 서브도메인 (예: xxx.logme.click)
  custom = 'custom', // 사용자 커스텀 도메인
}

// 사이트 상태
export enum SiteStatus {
  draft = 'draft',
  published = 'published',
  error = 'error',
}

// 빌드 상태
export enum BuildStatus {
  pending = 'pending',
  queued = 'queued',
  building = 'building',
  retrying = 'retrying',
  success = 'success',
  error = 'error',
}

// 소스 타입
export enum SourceType {
  notion = 'notion',
}

// 테마
export enum Theme {
  light = 'light',
  dark = 'dark',
  system = 'system',
}

// 요금제
export enum Plan {
  free = 'free',
  pro = 'pro',
  team = 'team',
}

// 언어
export enum Language {
  ko = 'ko',
  en = 'en',
  ja = 'ja',
  zh = 'zh',
}

// 배포 상태
export enum DeployStatus {
  pending = 'pending',
  deploying = 'deploying',
  success = 'success',
  error = 'error',
  cancelled = 'cancelled',
}

// 제공자 타입
export enum ProviderType {
  github = 'github',
  notion = 'notion',
  vercel = 'vercel',
  google = 'google',
}

// 저장소 타입
export enum RepoType {
  github = 'github',
  gitlab = 'gitlab',
  bitbucket = 'bitbucket',
}

// 타겟 타입
export enum TargetType {
  vercel = 'vercel',
  netlify = 'netlify',
  aws = 'aws',
  cloudflare = 'cloudflare',
  custom = 'custom',
}