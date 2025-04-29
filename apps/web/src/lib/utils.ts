import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
