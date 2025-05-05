import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export function SiteInfoForm({
  author,
  title,
  description = '',
  sub = '',
  onChange,
  onSave,
  isSaving = false,
}: {
  author: string
  title: string
  description?: string
  sub: string
  onChange: (field:  'author' | 'title' | 'description' | 'sub', value: string) => void
  onSave: () => void
  isSaving?: boolean
}) {
  const isTitleTooLong = title.length > 40
  const isAuthorTooLong = author.length > 10
  const isDisabled = title.trim() === '' || isTitleTooLong || isAuthorTooLong || sub.trim() === ''

  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    if (justSaved) {
      const timer = setTimeout(() => setJustSaved(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [justSaved])

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div>
        <Label htmlFor="author">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => onChange('author', e.target.value)}
          placeholder="e.g. Skyler"
          required
        />
        {isAuthorTooLong && <p className="text-sm text-red-500 mt-1">Please enter 10 characters or fewer.</p>}
      </div>
      <div>
        <Label htmlFor="site-title">
          Site Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="site-title"
          value={title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g. My blog, Dev notes"
          required
        />
        {isTitleTooLong && <p className="text-sm text-red-500 mt-1">Please enter 40 characters or fewer.</p>}
      </div>

      <div>
        <Label htmlFor="site-description">
          Site Description <span className="text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="site-description"
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="e.g. Tech blog, Travel journal"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="site-sub">
          Subdomain <span className="text-red-500">*</span> (lowercase letters, numbers, hyphens allowed)
        </Label>
        <Input
          id="site-sub"
          value={sub}
          onChange={(e) => onChange('sub', e.target.value)}
          placeholder="e.g. my-blog12"
          required
        />
      </div>

      <div className="text-right pt-4 flex items-center justify-end gap-2">
        {justSaved && <CheckCircle className="text-green-500 w-5 h-5" />}
        <Button
          onClick={() => {
            onSave()
            setJustSaved(true)
          }}
          disabled={isDisabled || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save & Deploy'}
        </Button>
      </div>
    </div>
  )
}
