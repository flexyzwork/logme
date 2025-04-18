import LogmeDashboard from '@/components/logme/LogmeDashboard'
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'

export default function Dashboard() {
  const defaultApp = 'logme' // 나중에 dynamic 가능

  return (
    <DashboardLayout app={defaultApp}>
      <LogmeDashboard />
    </DashboardLayout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function DashboardLayout({ children, app }: { children: React.ReactNode; app: string }) {
  const session = await getAuthSession()
    if (!session) redirect('/signin')
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-screen-xl mx-auto">
      {children}
    </div>
  )
}
