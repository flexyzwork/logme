'use client'

import { Button } from '@/components/ui/button'
import logger from '@/lib/logger'
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
      toast.success('링크가 복사되었습니다!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      logger.log('error', '링크 복사 실패', { error })
      toast.error('링크 복사에 실패했습니다')
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleCopy}>
      <Copy className="mr-1 h-4 w-4" />
      {copied ? '복사됨!' : '공유하기'}
    </Button>
  )
}
