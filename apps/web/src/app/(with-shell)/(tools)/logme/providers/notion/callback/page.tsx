'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useCreateProvider } from '@/hooks/logme/provider/useCreateProvider'
// import { storeProviderToken } from '@/lib/redis/tokenStore'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'
import { useCreateContentSource } from '@/hooks/logme/contentSource/useCreateContentSource'
import { useAuthStore } from '@/stores/logme/authStore'
import { useSession } from 'next-auth/react'
import { encrypt } from '@/lib/crypto'
import { trackEvent } from '@/lib/tracking'
import { logger } from '@/lib/logger'
import { sendAlertFromClient } from '@/lib/alert'
import { useCreateProviderExtended } from '@/hooks/logme/provider/useCreateProviderExtended'

export default function NotionCallbackPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const {
    siteId,
    templateId,
    isNotionFetching,
    notionLastProcessedCode,
    setBuilderStep,
    setNotionPageId,
    setUserId,
    setSiteId,
    setNotionLastProcessedCode,
    setIsNotionFetching,
  } = useBuilderStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { notion } = useAuthStore()
  const { mutateAsync: storeProviderUser } = useCreateProvider()
  const { mutateAsync: createContentSourceDB } = useCreateContentSource()
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const storeProviderExtended = useCreateProviderExtended()
  const executedRef = useRef(false)

  useEffect(() => {
    if (executedRef.current || status !== 'authenticated') return
    executedRef.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      setError('Authorization code is missing')
      setLoading(false)
      return
    }

    if (!state || state !== notion?.authState) {
      console.warn('❌ 유효하지 않은 인증 요청입니다. (state 없거나 불일치)')
      setError('❌ 유효하지 않은 인증 요청입니다. (state 불일치)')
      setLoading(false)
      sendAlertFromClient({
        type: 'error',
        message: '❌ 유효하지 않은 인증 요청입니다. (state 불일치)',
        meta: {
          state,
          notionAuthState: notion?.authState,
          sessionUserId: session?.user.id,
        },
      })
      return
    }

    if (isNotionFetching || notionLastProcessedCode === code) {
      setLoading(false)
      return
    }

    const fetchToken = async () => {
      let currentUserId = session.user?.id

      try {
        router.replace('/logme/builder', { scroll: false })
        setIsNotionFetching(true)
        setBuilderStep(1)

        const response = await fetch('/api/logme/providers/notion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        })

        const data = await response.json()

        logger.info('Notion 인증 응답:', { data })

        if (data.access_token && data.duplicated_template_id) {
          const accessToken = data.access_token

          const providerUser = {
            providerType: 'notion',
            providerUserId: data.owner?.user?.id ?? '',
            name: data.owner?.user?.name ?? 'Unknown',
            email: data.owner?.user?.person?.email ?? '',
            avatar_url: data.owner?.user?.avatar_url ?? '',
            userId: currentUserId,
          }

          const res = await storeProviderUser(providerUser)
          const newUserId = res.userId

          if (!currentUserId || currentUserId !== newUserId) {
            currentUserId = newUserId
          }

          const encryptedToken = encrypt(accessToken)

          // storeProviderToken(currentUserId!, 'notion', encryptedToken)
          await storeProviderExtended.mutateAsync({
            providerType: 'notion',
            templateId: templateId ?? '',
            extendedKey: 'token',
            extendedValue: encryptedToken,
          })

          logger.info('✅ Notion 인증 완료:', {
            userId: currentUserId,
            providerUserId: data.owner?.user?.id,
            accessToken: encryptedToken,
          })
          await trackEvent({
            userId: session?.user.id,
            event: 'notion_connected',
            meta: { pageId: data.duplicated_template_id, method: 'oauth' },
          })

          setUserId(currentUserId)
          setNotionPageId(data.duplicated_template_id)
          setNotionLastProcessedCode(code)

          const contentSourceData = {
            sourceId: data.duplicated_template_id,
          }
          const contentSource = await createContentSourceDB(contentSourceData)
          logger.info('✅ Content Source 생성:', contentSource)

          if (siteId) {
            await updateSiteDB({
              id: siteId,
              contentSourceId: contentSource.id,
            })
            logger.info('✅ Site 업데이트 완료:', { siteId, contentSourceId: contentSource.id })
          } else {
            setError('Failed to get site ID')
            logger.error('❌ Site ID가 없습니다.')
            await sendAlertFromClient({
              type: 'error',
              message: 'Vercel 토큰 저장 실패',
              meta: { siteId, error: '❌ Site ID가 없습니다.' },
            })
          }
        } else {
          setError('Failed to get access token or template ID')
        }
      } catch (err) {
        logger.error('❌ Notion 인증 중 오류:', { err })
        setError('Internal server error')
        await sendAlertFromClient({
          type: 'error',
          message: 'Notion 인증 중 오류',
          meta: { err },
        })
      } finally {
        setIsNotionFetching(false)
        setLoading(false)
      }
    }

    fetchToken()
  }, [
    session,
    status,
    searchParams,
    router,
    setBuilderStep,
    isNotionFetching,
    setIsNotionFetching,
    setNotionLastProcessedCode,
    notionLastProcessedCode,
    setSiteId,
    storeProviderUser,
    setUserId,
    notion?.authState,
    createContentSourceDB,
    siteId,
    updateSiteDB,
    setNotionPageId,
  ])

  if (status === 'loading' || loading) return <p>Loading...</p>
  if (!session) return <p>로그인이 필요합니다</p>
  if (error) return <p>Error: {error}</p>

  return null
}
