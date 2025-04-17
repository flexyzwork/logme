'use client'

// import { useRouter } from 'next/navigation'

export default function Settings() {
  // const router = useRouter()

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">설정</h1>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <div className="flex flex-wrap gap-3 items-center"></div>
        <div className="flex gap-2"></div>
      </div>
    </div>
  )
}
