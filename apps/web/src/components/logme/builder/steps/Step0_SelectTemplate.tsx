'use client'

import { useFetchTemplates } from '@/hooks/logme/template/useFetchTemplates'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generateOAuthState } from '@/lib/utils'
import { useAuthStore } from '@/stores/logme/authStore'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useCreateSite } from '@/hooks/logme/site/useCreateSite'
import { createId } from '@paralleldrive/cuid2'
import Image from 'next/image'

export default function Step0_SelectTemplate() {
  const { setSiteId, userId } = useBuilderStore()
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
      slug: siteId,
    })

    setSiteId(siteId)

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

  if (isLoading) return <p className="text-center">불러오는 중...</p>

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
        {data?.map((tpl) => (
          <Card
            key={tpl.id}
            className="hover:shadow-lg transition cursor-pointer"
            onClick={() => {
              if (tpl?.templateApp?.appClientId && tpl.templateApp?.appRedirectUri) {
                handleSelect(tpl.id, tpl.templateApp.appClientId, tpl.templateApp.appRedirectUri)
              } else {
                console.warn('템플릿의 앱 정보가 부족합니다:', tpl)
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
                {tpl.templateDescription || '설명이 없습니다.'}
              </p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                선택하기
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
