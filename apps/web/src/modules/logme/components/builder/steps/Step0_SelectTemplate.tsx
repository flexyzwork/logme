'use client'

import { generateOAuthState } from '@/shared/lib/utils'
import { useCreateSite } from '@/modules/logme/features/site/hooks/useCreateSite'
import { useFetchTemplates } from '@/modules/logme/features/template/hooks/useFetchTemplates'
import { useAuthStore } from '@/shared/stores'
import { useBuilderStore } from '@/modules/logme/features/site/stores/builderStore'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'

import { createId } from '@paralleldrive/cuid2'
import Image from 'next/image'

export default function Step0_SelectTemplate() {
  const { setSiteId, userId, setTemplateId } = useBuilderStore()
  const { mutateAsync: createSiteDB } = useCreateSite()

  const handleSelect = (id: string, clientId: string, redirectUri: string) => {
    const siteId = createId()

    const { setNotionAuthState } = useAuthStore.getState()

    createSiteDB({
      id: siteId,
      siteTitle: '',
      siteDescription: '',
      templateId: id,
      userId: userId || '',
      sub: siteId,
    })

    setSiteId(siteId)
    setTemplateId(id)

    const stateType = `notion:${clientId}:`
    const state = generateOAuthState(stateType)
    setNotionAuthState(state)

    const params = new URLSearchParams({
      client_id: clientId ?? '',
      redirect_uri: redirectUri ?? '',
      response_type: 'code',
      owner: 'user',
      state,
    })

    window.location.href = `https://api.notion.com/v1/oauth/authorize?${params.toString()}`
  }
  const { data, isLoading } = useFetchTemplates()

  if (isLoading) return <p className="text-center">Loading templates...</p>

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
        {data?.map((tpl) => (
          <Card
            key={tpl.id}
            className="hover:shadow-lg transition cursor-pointer"
            onClick={() => {
              if (tpl?.templateApp?.appClientId && tpl.templateApp?.appRedirectUri) {
                handleSelect(tpl.id, tpl.templateApp.appClientId, tpl.templateApp.appRedirectUri)
              } else {
                console.warn('Template app information is missing:', tpl)
              }
            }}
          >
            <Image
              src={tpl.thumbnailUrl || '/placeholder.png'}
              alt={tpl.templateTitle}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-t"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{tpl.templateTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {tpl.templateDescription || 'No description available.'}
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Select
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
