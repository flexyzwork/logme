import { Skeleton } from "@/shared/components/ui/skeleton"

type Props = {
  // provider: 'notion' | 'github' | 'vercel'
  provider: 'github' | 'vercel'
  connected?: boolean
}

const providerLabel: Record<Props['provider'], string> = {
  // notion: 'Notion',
  github: 'GitHub',
  vercel: 'Vercel',
}

export default function ConnectionStatus({ provider, connected }: Props) {
  const label = providerLabel[provider]

  if (connected === undefined) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-400'}`} />
      <span className="text-sm text-muted-foreground">
        {label} {connected ? 'connected' : 'not connected'}
      </span>
    </div>
  )
}
