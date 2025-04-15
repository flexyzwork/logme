'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

type Props = {
  provider: 'notion' | 'github' | 'vercel'
  connected: boolean
  onConnect: () => void
  onDisconnect: () => void
}

const providerLabel: Record<Props['provider'], string> = {
  notion: 'Notion',
  github: 'GitHub',
  vercel: 'Vercel',
}

export default function ConnectionStatus({ provider, connected, onConnect, onDisconnect }: Props) {
  const [open, setOpen] = useState(false)
  const label = providerLabel[provider]

  return (
    <TooltipProvider>
      <Tooltip>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button className="text-sm text-muted-foreground cursor-pointer">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-1 ${connected ? 'bg-green-500' : 'bg-yellow-400'}`}
                />
                {label} {connected ? '연결' : '미연결'}
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>

          <TooltipContent side="top">
            <p className="text-xs max-w-[200px]">
              {connected
                ? '현재 연결 상태입니다. 클릭하여 해제할 수 있습니다.'
                : '아직 연결되지 않았어요. 클릭하여 연결을 시작해보세요.'}
            </p>
          </TooltipContent>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {connected ? `${label} 연결을 해제할까요?` : `${label} 연결을 시작할까요?`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {connected
                  ? `연결을 해제하면 ${label} 관련 기능을 사용할 수 없습니다.`
                  : `연결을 시작하면 ${label} 콘텐츠를 활용할 수 있게 됩니다.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={connected ? onDisconnect : onConnect}>
                {connected ? '연결 해제' : '연결 시작'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Tooltip>
    </TooltipProvider>
  )
}
