import React from 'react'
import { ZustandProvider } from '@/context/ZustandProvider'
import { Suspense } from 'react'
import QueryProvider from '@/context/QueryProvider'
import SessionProvider from '@/context/SessionProvider'
import { Toaster } from 'sonner'
import { AuthTracker } from '@/components/system/AuthTracker'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <QueryProvider>
        <ZustandProvider>
          <Suspense
            fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}
          >
            <Toaster />
            <AuthTracker />
            {children}
          </Suspense>
        </ZustandProvider>
      </QueryProvider>
    </SessionProvider>
  )
}

export default Providers
