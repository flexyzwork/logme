import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const Tools = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-customgreys-primarybg text-white-50 px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-12 ">
        <h1 className="text-4xl font-extrabold text-primary-700">Flexyz</h1>
        <p className="text-gray-300 mt-4 text-sm md:text-base">
        플렉시즈의 기술은 조용히 창작과 표현을 돕습니다.
        </p>
      </div>

      {/* Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-12">
        <a
          href="/logme"
          // target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <Card className="h-full transition-transform hover:scale-[1.02] hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold text-primary-700 mb-2">🚀 Logme - 블로그 빌더</h2>
              <p className="text-sm text-gray-300">
                노션으로 콘텐츠를 작성하고, <br />깃헙과 Vercel로 직접 운영하세요.
              </p>
            </CardContent>
          </Card>
        </a>

        <a
          href="/page"
          // target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <Card className="h-full transition-transform hover:scale-[1.02] hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold text-primary-700 mb-2">🌍 Page - 정적 퍼블리셔</h2>
              <p className="text-sm text-gray-300">
                이벤트, 포트폴리오, 링크 모음... <br />당신의 한 페이지를 엣지있게 만드세요.
              </p>
            </CardContent>
          </Card>
        </a>

        <Card className="h-full transition-transform hover:scale-[1.02] hover:shadow-xl cursor-default">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-primary-700 mb-2">💡 More...</h2>
            <p className="text-sm text-gray-300">
              flexyz는 계속 확장 중입니다. <br />더 많은 도구들이 곧 찾아갑니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-400 text-xs"></footer>
    </div>
  )
}

export default Tools
