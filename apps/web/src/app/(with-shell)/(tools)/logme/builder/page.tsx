import SiteBuilder from '@/components/logme/builder/SiteBuilder'
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'

export default function NewSitePage() {
  const defaultApp = 'logme' // 나중에 dynamic 가능

  return (
    <BuilderLayout app={defaultApp}>
      <SiteBuilder />
    </BuilderLayout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function BuilderLayout({ children, app }: { children: React.ReactNode; app: string }) {
  const session = await getAuthSession()
  if (!session) redirect('/signin')
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-screen-xl mx-auto">
      {children}
    </div>
  )
}
