/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useFetchSites } from '@/hooks/logme/site/useFetchSites'
import { Button } from '@/components/ui/button'
import { useDeleteSite } from '@/hooks/logme/site/useDeleteSite'
import { useUpdateSite } from '@/hooks/logme/site/useUpdateSite'
import { GuideDialogTriggerButton } from '@/components/logme/GuideDialogTriggerButton'
import GithubButton from '@/components/logme/GithubButton'

export default function LogmeDashboard() {
  const { data: sites, isLoading, error } = useFetchSites()

  const [viewMode, setViewMode] = useState('card')
  const deleteSite = useDeleteSite()
  const updateSite = useUpdateSite()
  const [editingSite, setEditingSite] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingDescription, setEditingDescription] = useState('')

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">대시보드</h1>

      <div className="mb-4 flex gap-4 items-center">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-muted-foreground">Notion 연결됨</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-muted-foreground">GitHub 연결됨</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-sm text-muted-foreground">Vercel 미연결</span>
        </div>

        <GuideDialogTriggerButton />
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ) : sites && sites.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === 'card' ? 'default' : 'outline'}
                onClick={() => setViewMode('card')}
              >
                카드 보기
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                목록 보기
              </Button>
            </div>
            <GithubButton text="+ 새 블로그 만들기" stateType="github:builder:" />
          </div>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
              {sites.map((site: any) => (
                <div
                  key={site.id}
                  className="border rounded-md p-4 shadow flex items-center min-w-[360px]"
                >
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
                        <p className="mt-2">상태: {site.status}</p>
                        {site.template && (
                          <p className="mt-1">템플릿: {site.template.templateTitle}</p>
                        )}
                        {site.repo && (
                          <p className="mt-1">
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
                        {site.deployTarget && (
                          <p className="mt-1">
                            배포:{' '}
                            <a
                              href={site.deployTarget.targetUrl}
                              className="text-blue-500 underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {site.deployTarget.targetName}
                            </a>
                          </p>
                        )}
                        {site.contentSourceId && (
                          <p className="mt-1">
                            콘텐츠:{' '}
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
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteSite.mutate(site.id)}
                          >
                            삭제
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sites.map((site: any) => (
                <div key={site.id} className="relative border rounded-md p-4">
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
                      <h2 className="font-semibold">{site.siteTitle}</h2>
                      {site.siteDescription && (
                        <p className="mt-1 text-sm text-gray-600">{site.siteDescription}</p>
                      )}
                    </>
                  )}
                  {editingSite !== site.id && (
                    <>
                      <p className="mt-2">상태: {site.status}</p>
                      {site.template && (
                        <p className="mt-1">템플릿: {site.template.templateTitle}</p>
                      )}
                      {site.repo && (
                        <p className="mt-1">
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
                      {site.deployTarget && (
                        <p className="mt-1">
                          배포:{' '}
                          <a
                            href={site.deployTarget.targetUrl}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {site.deployTarget.targetName}
                          </a>
                        </p>
                      )}
                      {site.contentSourceId && (
                        <p className="mt-1">
                          콘텐츠:{' '}
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
                      <div className="absolute top-4 right-4 flex gap-2">
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
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSite.mutate(site.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="border rounded-md p-6 text-center text-sm text-muted-foreground">
          아직 생성된 사이트가 없습니다.
        </div>
      )}
    </div>
  )
}
