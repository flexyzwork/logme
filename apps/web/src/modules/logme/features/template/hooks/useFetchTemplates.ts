import type { Template, TemplateApp } from '@repo/db'
import { useQuery } from '@tanstack/react-query'

type TemplateWithApp = Template & {
  templateApp: TemplateApp
}

async function fetchTemplates(): Promise<TemplateWithApp[]> {
  const res = await fetch('/api/logme/templates', { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch template list')
  return res.json()
}

export const useFetchTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
  })
}
