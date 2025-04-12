import { Button } from '@/components/ui/button'
import { useCallback } from 'react'

interface NotionButtonProps {
  text?: string
}

const NotionButton = ({
  text = '📝 노션으로 시작하기',
}: NotionButtonProps) => {
  const handleLogin = useCallback(() => {
    window.location.href = process.env.NEXT_PUBLIC_NOTION_AUTH_URL ?? ''
  }, [])

  return (
    <div className="text-center mt-5">
      <Button onClick={handleLogin} className="w-full max-w-[200px]" size="sm">
        {text}
      </Button>
    </div>
  )
}

export default NotionButton
