import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { db } from '@repo/db'
import slugify from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getUniqueSlug(title: string): Promise<string> {
  const base = slugify(title, { lower: true, strict: true })
  let slug = base
  let counter = 1

  while (true) {
    const existing = await db.site.findUnique({ where: { slug } })
    if (!existing) break
    slug = `${base}-${counter}`
    counter++
  }

  return slug
}

// ✅ 이메일 없을 때 자동 생성
export function generateFallbackEmail(providerType: string, providerUserId: string) {
  return `${providerType}-${providerUserId}@generated.email`
}

// ✅ 에러 로깅 + 변환 유틸
export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

export function generateOAuthState(stateType: string = 'state'): string {
  return `${stateType}${crypto.randomUUID()}`
}
