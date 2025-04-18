// import { getAuthSession } from '@/lib/auth'
import { Shell } from '@/components/layout/shell'
// import { redirect } from 'next/navigation'

export default async function WithShellLayout({ children }: { children: React.ReactNode }) {
  // const session = await getAuthSession()
  // if (!session) redirect('/signin')
  return <Shell>{children}</Shell>
}
