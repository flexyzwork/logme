'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function Landing() {
  const getCurrentYear = () => {
    return new Date().getFullYear()
  }
  return (
    <main className="flex flex-col px-4 py-20 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-32">
        <h1 className="text-4xl font-bold mb-6">
          📝 누구나 만드는 블로그 <br />
          <br />
          Logme
        </h1>
        <p className="text-muted-foreground text-base mb-10">
          Notion, GitHub, Vercel 계정만 연결하면
          <br />
          자동으로 멋진 블로그가 생성됩니다.
        </p>
        <Button asChild>
          <Link href="/logme">지금 블로그 만들기</Link>
        </Button>
      </section>

      {/* Process Section */}
      <section className="mb-32 text-center">
        <h2 className="text-xl font-semibold mb-6">어떻게 작동하나요?</h2>
        <div className="grid sm:grid-cols-3 gap-6 text-center text-sm text-muted-foreground ">
          <div>
            <p className="text-base font-bold mb-1 ㅅㄷ">1단계</p>
            <p>Notion / GitHub / Vercel 계정을</p>
            연결합니다.
          </div>
          <div>
            <p className="text-base font-bold mb-1">2단계</p>
            <p>원하는 템플릿을 고르고 블로그를 설정합니다.</p>
            (현재 단일 템플릿이지만 추가 예정입니다!)
          </div>
          <div>
            <p className="text-base font-bold mb-1">3단계</p>
            <p>자동으로 배포된 블로그를 확인하세요. </p>
            놀라실 거예요 😎
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section className="mb-32 text-center">
        <h2 className="text-xl font-semibold mb-6">💻 블로그가 이렇게 바뀌어요</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Notion 문서 하나로, 완성형 블로그가 자동으로 만들어집니다.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-muted rounded-md p-4 flex flex-col items-center">
            <p className="text-sm font-medium mb-2">Notion 원본</p>
            <Image
              src="/examples/notion-preview-1.png"
              alt="Notion 페이지"
              width={400}
              height={250}
              className="rounded-md border"
            />
          </div>
          <div className="bg-muted rounded-md p-4 flex flex-col items-center">
            <p className="text-sm font-medium mb-2">변환된 블로그</p>
            <Image
              src="/examples/blog-preview.png"
              alt="변환된 블로그"
              width={400}
              height={250}
              className="rounded-md border"
            />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="mb-32 text-center">
        <h2 className="text-xl font-semibold mb-6">🚀 주요 특징</h2>
        <TooltipProvider>
          <div className="grid sm:grid-cols-3 gap-6 text-left text-sm text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-base font-bold mb-1">📱 모바일 완벽 대응</p>
                  <p>모든 템플릿은 모바일에서도 깔끔하게 보여집니다.</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <Image
                  src="/examples/blog-mobile.png"
                  alt="모바일 완벽 대응"
                  width={300}
                  height={200}
                  className="rounded border"
                />
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-base font-bold mb-1">🔍 프리뷰 자동 생성</p>
                  <p>
                    공유 시 썸네일(OG 이미지)이 자동으로 생성되어, 링크를 붙이기만 해도 예쁘게
                    보여요.
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <Image
                  src="/examples/blog-og.png"
                  alt="프리뷰 자동 생성"
                  width={300}
                  height={200}
                  className="rounded border"
                />
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-base font-bold mb-1">🖼️ 이미지 완전 지원</p>
                  <p>
                    Notion에 첨부된 이미지가 블로그에 그대로 반영됩니다. 해상도나 비율도 자동으로
                    최적화돼요.
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <Image
                  src="/examples/blog-preview.png"
                  alt="이미지 완전 지원"
                  width={300}
                  height={200}
                  className="rounded border"
                />
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </section>
      {/* Pricing Section */}
      <section className="mb-32 text-center">
        <h2 className="text-xl font-semibold mb-4">📦 가격 안내</h2>
        <p className="text-base text-muted-foreground">
          지금은 베타 서비스 기간으로{' '}
          <strong className="text-black dark:text-white">완전 무료</strong>로 사용하실 수 있어요!
        </p>
      </section>

      {/* Coffee Support Section */}
      <section className="mb-32 text-center">
        <h2 className="text-lg font-semibold mb-4">☕ 커피 한 잔으로 응원하기</h2>
        <p className="text-base text-muted-foreground">
          이 서비스가 마음에 드셨다면,{' '}
          <a
            href="https://buymeacoffee.com/flexyzworkr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-base text-muted-foreground hover:underline"
          >
            {' '}
            <strong className="text-black dark:text-white"> 커피 한 잔으로 응원</strong>
          </a>
          해 주세요!
        </p>
      </section>

      {/* Branding Section */}
      <section className="text-center">
        <p className="mt-12 text-xs text-muted-foreground">
          Logme는 Flexyz가 만든 블로그 자동화 도구입니다.
        </p>
        <p className="text-xs text-muted-foreground">
          © {getCurrentYear()} Flexyz. All rights reserved.
        </p>
      </section>
    </main>
  )
}
