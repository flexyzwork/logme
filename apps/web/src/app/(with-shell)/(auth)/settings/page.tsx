'use client'

import { GuideDialogTriggerButton } from '@/components/logme/common/GuideDialogTriggerButton'
import ConnectionStatus from '@/components/logme/common/ConnectionStatus'
import { useRouter } from 'next/navigation'

export default function Settings() {
  const router = useRouter()

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">계정 관리</h1>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <div className="flex flex-wrap gap-3 items-center">
          <ConnectionStatus
            provider="notion"
            connected={true}
            // onConnect={() => router.push('/logme/providers/notion')}
            // onDisconnect={() => console.log('Notion 해제')}
          />
          <ConnectionStatus
            provider="github"
            connected={true}
            // onConnect={() => router.push('/logme/providers/github')}
            // onDisconnect={() => console.log('GitHub 해제')}
          />
          <ConnectionStatus
            provider="vercel"
            connected={false}
            // onConnect={() => router.push('/logme/providers/vercel')}
            // onDisconnect={() => console.log('Vercel 해제')}
          />
        </div>
        <div className="flex gap-2">
          <GuideDialogTriggerButton />
        </div>
      </div>
    </div>
  )
}
