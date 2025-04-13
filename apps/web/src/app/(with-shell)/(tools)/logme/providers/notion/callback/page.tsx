'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useBuilderStore } from '@/stores/logme/builderStore'
import { useCreateProvider } from '@/hooks/logme/provider/useCreateProvider'
import { storeProviderToken } from '@/lib/redis/tokenStore'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'
import { useCreateContentSource } from '@/hooks/logme/contentSource/useCreateContentSource'
import { useAuthStore } from '@/stores/logme/authStore'
// import { useCreateSession } from '@/hooks/logme/session/useCreateSession'
// import { useCreateSite } from '@/hooks/logme/site/useCreateSite'
// import { createId } from '@paralleldrive/cuid2'
import { useSession } from 'next-auth/react'

export default function NotionCallbackPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const {
    siteId,
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
  // const { mutateAsync: createSite } = useCreateSite()
  const { mutateAsync: createContentSourceDB } = useCreateContentSource()
  const { mutateAsync: updateSiteDB } = useUpdateSite()
  const executedRef = useRef(false)

  useEffect(() => {
    if (executedRef.current || status !== 'authenticated') return
    executedRef.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    console.log('🔹 code:', code)
    console.log('🔹 state:', state)
    console.log('✅ userId:', session.user?.id)

    if (!code) {
      setError('Authorization code is missing')
      setLoading(false)
      return
    }

    if (!state || state !== notion?.authState) {
      console.warn('❌ 유효하지 않은 인증 요청입니다. (state 없거나 불일치)')
      setError('❌ 유효하지 않은 인증 요청입니다. (state 불일치)')
      setLoading(false)
      return
    }

    if (isNotionFetching || notionLastProcessedCode === code) {
      console.log('🚀 중복 실행 방지됨:', code)
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
        console.log('✅ Notion 인증 성공:', data)

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

          console.log('🔑 newUserId:', newUserId)

          if (!currentUserId || currentUserId !== newUserId) {
            currentUserId = newUserId
          }

          storeProviderToken(currentUserId!, 'notion', accessToken)

          // const siteId = createId()

          setUserId(currentUserId)
          // setSiteId(siteId)
          setNotionPageId(data.duplicated_template_id)
          setNotionLastProcessedCode(code)

          const contentSourceData = {
            sourceId: data.duplicated_template_id,
          }
          const contentSource = await createContentSourceDB(contentSourceData)
          console.log('✅ Content Source 생성:', contentSource)

          if (siteId) {
            await updateSiteDB({
              id: siteId,
              contentSourceId: contentSource.id,
            })
            console.log('✅ Site 업데이트:', contentSource.id)
          } else {
            console.error('❌ Site ID가 없습니다.')
          }
        } else {
          setError('Failed to get access token or template ID')
        }
      } catch (err) {
        console.error('❌ Notion 인증 중 오류:', err)
        setError('Internal server error')
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
    // createSite,
    setUserId,
    notion?.authState,
    createContentSourceDB,
    siteId,
    updateSiteDB,
  ])

  if (status === 'loading' || loading) return <p>Loading...</p>
  if (!session) return <p>로그인이 필요합니다</p>
  if (error) return <p>Error: {error}</p>

  return null
}
