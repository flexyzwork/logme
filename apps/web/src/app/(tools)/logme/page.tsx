'use client'

import GithubButton from '@/components/logme/GithubButton'

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">📝 Logme</h1>
        <p className="text-lg text-gray-600 max-w-xl mb-12 text-center">
          <br />
          Notion 기반으로 누구나 쉽게 사이트를 만들고 배포할 수 있도록 도와줍니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <div className="flex flex-col justify-center items-center text-center border rounded-xl shadow-sm p-4 bg-white dark:bg-zinc-900 text-black dark:text-white hover:shadow-md transition-shadow min-h-[340px]">
            <h2 className="text-lg font-semibold mb-2">처음이신가요?</h2>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              템플릿을 선택하거나 빈 화면에서 시작해보세요. 
              <br />
              GitHub 인증으로 계정이 생성됩니다.
            </p>
            <GithubButton text="지금 시작하기" stateType="github:builder:" />
          </div>

          <div className="flex flex-col justify-center items-center text-center border rounded-xl shadow-sm p-4 bg-white dark:bg-zinc-900 text-black dark:text-white hover:shadow-md transition-shadow min-h-[340px]">
            <h2 className="text-lg font-semibold mb-2">Logme 사이트가 있으세요?</h2>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              GitHub 계정으로 로그인하고
              <br />
              사이트를 관리할 수 있습니다.
            </p>
            <GithubButton text="🔧 내 사이트 관리하기" stateType="github:login:" />
          </div>
        </div>
      </main>

    </div>
  )
}

