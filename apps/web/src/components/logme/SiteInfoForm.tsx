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
  onChange: (field: 'title' | 'description' | 'sub', value: string) => void
  onSave: () => void
  isSaving?: boolean
}) {
  const isTitleTooLong = title.length > 40
  const isAuthorTooLong = title.length > 10
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
          이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="예: 하늘이"
          required
        />
        {isAuthorTooLong && <p className="text-sm text-red-500 mt-1">10자 이내로 입력해주세요.</p>}
      </div>
      <div>
        <Label htmlFor="site-title">
          사이트 이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="site-title"
          value={title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="예: 나의 블로그, 개발 일지 등"
          required
        />
        {isTitleTooLong && <p className="text-sm text-red-500 mt-1">40자 이내로 입력해주세요.</p>}
      </div>

      <div>
        <Label htmlFor="site-description">
          사이트 설명 <span className="text-gray-400">(선택)</span>
        </Label>
        <Textarea
          id="site-description"
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="예: 기술 블로그, 여행기록 등"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="site-sub">
          도메인 주소 <span className="text-red-500">*</span>
          영문소문자,숫자,하이픈(-)가능{' '}
        </Label>
        <Input
          id="site-sub"
          value={sub}
          onChange={(e) => onChange('sub', e.target.value)}
          placeholder="예: my-blog12"
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
          {isSaving ? '저장 중...' : '저장 & 배포'}
        </Button>
      </div>
    </div>
  )
}
