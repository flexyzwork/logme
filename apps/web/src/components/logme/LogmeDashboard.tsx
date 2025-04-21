/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useFetchSites } from '@/hooks/logme/site/useFetchSites'
import { Button } from '@/components/ui/button'
import { useDeleteSite } from '@/hooks/logme/site/useDeleteSite'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'
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
import { useRouter } from 'next/navigation'
import ShareButton from '@/components/logme/common/ShareButton'

export default function LogmeDashboard() {
  const { data: sites, isLoading, error } = useFetchSites()
  const deleteSite = useDeleteSite()
  const updateSite = useUpdateSite()
  const [editingSite, setEditingSite] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')
  const router = useRouter()

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ) : sites && sites.length > 0 ? (
        <>
          <div className="flex items-center justify-end mb-6">
            <Button className="text-sm mt-1" onClick={() => router.push('/logme')}>
              + 새 블로그 만들기
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sites.map((site: any) => (
              <div key={site.id} className="border rounded-md p-4 shadow flex items-center min-w-[360px]">
                <Image
                  src="/placeholder.png"
                  alt="Site preview"
                  width={320}
                  height={200}
                  className="w-48 rounded border object-cover"
                />
                <div className="ml-4 flex-1">
                  {editingSite === site.id ? (
                    <>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        placeholder="사이트 제목"
                        className="w-full p-1 border rounded mb-2"
                      />
                      <textarea
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        placeholder="사이트 설명"
                        className="w-full p-1 border rounded mb-2"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            updateSite.mutate({
                              id: site.id,
                              siteTitle: editingTitle,
                              siteDescription: editingDescription,
                            })
                            setEditingSite(null)
                          }}
                        >
                          확인
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingSite(null)}>
                          취소
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="font-semibold text-lg">{site.siteTitle}</h2>
                      {site.siteDescription && (
                        <p className="mt-1 text-sm text-gray-600">{site.siteDescription}</p>
                      )}
                    </>
                  )}

                  {editingSite !== site.id && (
                    <>
                      <p className="mt-2 text-sm">상태: {site.status}</p>
                      {site.domainType === 'sub' && site.sub && (
                        <p className="mt-1 text-sm">
                          도메인:{' '}
                          <a
                            href={`https://${site.sub}.logme.click`}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`${site.sub}.logme.click`}
                          </a>
                        </p>
                      )}

                      {site.template && (
                        <p className="mt-1 text-sm">템플릿: {site.template.templateTitle}</p>
                      )}
                      {site.contentSource && (
                        <p className="mt-1 text-sm">
                          컨텐츠:{' '}
                          <a
                            href={site.contentSource.sourceUrl}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {site.contentSource.sourceId}
                          </a>
                        </p>
                      )}
                      {site.repo && (
                        <p className="mt-1 text-sm">
                          저장소:{' '}
                          <a
                            href={site.repo.repoUrl}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {site.repo.repoName}
                          </a>
                        </p>
                      )}
                      {site.deployTarget?.deployments[0]?.deployUrl && (
                        <p className="mt-1 text-sm">
                          배포:{' '}
                          <a
                            href={site.deployTarget.deployments[0]?.deployUrl}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {site.deployTarget.targetName}
                          </a>
                        </p>
                      )}
                      {site.contentSourceId && (
                        <p className="mt-1 text-sm">
                          컨텐츠:{' '}
                          <a
                            href={`https://www.notion.so/${site.contentSourceId}`}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Notion 링크
                          </a>
                        </p>
                      )}

                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingSite(site.id)
                            setEditingTitle(site.siteTitle || '')
                            setEditingDescription(site.siteDescription || '')
                          }}
                        >
                          수정
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              삭제
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
                              <AlertDialogDescription>
                                이 작업은 되돌릴 수 없습니다. GitHub 저장소, Vercel 배포 프로젝트 등 사이트와 관련된 모든 정보가 삭제됩니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteSite.mutate(site.id)}>
                                삭제
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <ShareButton url={`https://${site.sub}.logme.click`} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-end">
            <Button className="text-sm mt-1" onClick={() => router.push('/logme')}>
              + 새 블로그 만들기
            </Button>
          </div>
          <div className="border rounded-md p-6 text-center text-sm text-muted-foreground">
            아직 생성된 사이트가 없습니다.
          </div>
        </div>
      )}
    </div>
  )
}