import { Shell } from "@/shared/components/layout/shell";

export default async function WithShellLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>
}
