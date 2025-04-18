type Props = {
  provider: 'notion' | 'github' | 'vercel'
  connected: boolean
}

const providerLabel: Record<Props['provider'], string> = {
  notion: 'Notion',
  github: 'GitHub',
  vercel: 'Vercel',
}

export default function ConnectionStatus({ provider, connected }: Props) {
  const label = providerLabel[provider]

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-400'}`} />
      <span className="text-sm text-muted-foreground">{label} {connected ? '연결' : '미연결'}</span>
    </div>
  )
}
