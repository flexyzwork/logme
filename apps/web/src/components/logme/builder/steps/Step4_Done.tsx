'use client'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useTemplatePageOpener } from '@/hooks/logme/template/useTemplatePageOpener'
import { useRouter } from 'next/navigation'
import ShareButton from '@/components/logme/common/ShareButton'

export default function Step6_Done() {
  const { siteId, notionPageId, sub } = useBuilderStore()
  const { openNotionPageUrl } = useTemplatePageOpener()
  const router = useRouter()

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center text-gray-700 text-sm">
        🎉 Your blog has been deployed to Vercel! <br />
        Check it out below.
      </p>
      <ShareButton url={`https://logme-${sub}.vercel.app`} />
      {sub ? (
        <Button
          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-sm"
          onClick={() => window.open(`https://logme-${sub}.vercel.app`, '_blank')}
        >
          🌍 View Blog
        </Button>
      ) : (
        <p className="text-center text-red-500">❌ Failed to generate blog URL.</p>
      )}

      <Button
        className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white text-sm"
        onClick={() => {
          openNotionPageUrl({
            siteId: siteId ?? '',
            notionPageId: notionPageId ?? '',
          })
        }}
      >
        📖 Edit Content
      </Button>

      <Button
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm"
        onClick={() => {
          router.push('/dashboard')
        }}
      >
        🔙 Go to Dashboard
      </Button>
    </div>
  )
}
