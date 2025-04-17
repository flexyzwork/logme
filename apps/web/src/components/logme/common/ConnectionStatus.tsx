// 'use client'

import { useState } from 'react'
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
import { Button } from '@/components/ui/button' // Assuming Button component is available

type Props = {
  provider: 'notion' | 'github' | 'vercel'
  connected: boolean
  // onConnect: () => void
  // onDisconnect: () => void
}

const providerLabel: Record<Props['provider'], string> = {
  notion: 'Notion',
  github: 'GitHub',
  vercel: 'Vercel',
}

export default function ConnectionStatus({ provider, connected }: Props) {
  const label = providerLabel[provider]

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-400'}`}
      />
      <span className="text-sm text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
