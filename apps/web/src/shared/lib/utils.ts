import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Generates a fallback email address for users without email, based on provider type and user ID.
 */
export function generateFallbackEmail(providerType: string, providerUserId: string) {
  return `${providerType}-${providerUserId}@generated.email`
}

/**
 * Converts an unknown error into a readable string.
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

/**
 * Generates a unique OAuth state string using the given prefix.
 */
export function generateOAuthState(stateType: string = 'state'): string {
  return `${stateType}${crypto.randomUUID()}`
}
