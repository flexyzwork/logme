import React from 'react'
import { ZustandProvider } from '@/context/ZustandProvider'
import { Suspense } from 'react'
import { Shell } from '@/components/layout/shell'
import QueryProvider from '@/context/QueryProvider'
import SessionProvider from '@/context/SessionProvider'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <QueryProvider>
        <ZustandProvider>
          <Suspense
            fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}
          >
            <Shell>{children}</Shell>
          </Suspense>
        </ZustandProvider>
      </QueryProvider>
    </SessionProvider>
  )
}

export default Providers
