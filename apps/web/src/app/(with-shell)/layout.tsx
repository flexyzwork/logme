import { Shell } from '@/components/layout/shell'

export default function WithShellLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>
}
