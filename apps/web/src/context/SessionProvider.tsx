'use client'

import { SessionProvider } from 'next-auth/react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {

  return <SessionProvider >{children}</SessionProvider>
}