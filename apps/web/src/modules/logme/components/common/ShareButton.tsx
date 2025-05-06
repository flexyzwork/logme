'use client'

import { Button } from '@/shared/components/ui/button'
import logger from '@/shared/lib/logger'
import { Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ShareButtonProps {
  url: string
}

export default function ShareButton({ url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      logger.log('error', 'Failed to copy link', { error })
      toast.error('Failed to copy the link')
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleCopy}>
      <Copy className="mr-1 h-4 w-4" />
      {copied ? 'Copied!' : 'Share'}
    </Button>
  )
}
