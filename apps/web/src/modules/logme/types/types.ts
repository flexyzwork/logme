export interface ProviderUser {
  providerType: 'notion' | 'github' | 'vercel' | string
  providerUserId: string
  name: string
  email?: string
  image?: string
}

export interface ProviderExtended {
  providerType: 'notion' | 'github' | 'vercel' | string
  templateId?: string
  extendedKey: string
  extendedValue: string
}

export type ProviderType = 'notion' | 'github' | 'vercel'
