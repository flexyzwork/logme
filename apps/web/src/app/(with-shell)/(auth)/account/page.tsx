import AccountPage from '@/components/logme/AccountPage'
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'

export default function Account() {
  const defaultApp = 'logme'

  return (
    <AccountLayout app={defaultApp}>
      <AccountPage />
    </AccountLayout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function AccountLayout({ children, app }: { children: React.ReactNode; app: string }) {
  const session = await getAuthSession()
  if (!session) redirect('/signin')
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 max-w-screen-xl mx-auto">
      {children}
    </div>
  )
}
