'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'
import { sendAlertFromClient } from '@/lib/alert'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState('')

  const accessKey = process.env.NEXT_PUBLIC_SEND_MAIL_ACCESS_KEY

  if (!accessKey) {
    throw new Error('NEXT_PUBLIC_SEND_MAIL_ACCESS_KEY is not defined')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResult('전송 중...')
    const formData = new FormData(event.currentTarget)
    formData.append('access_key', accessKey)

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      setName('')
      setEmail('')
      setMessage('')
      setResult('성공적으로 전송되었습니다.')
      setTimeout(() => setResult(''), 2000)
    } else {
      setResult('오류: ' + data.message)
      logger.error('Error', data.message)
      await sendAlertFromClient({
        type: 'error',
        message: '메시지 전송 오류',
        meta: { error: data.message },
      })
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">문의하기</h1>
      <p className="text-muted-foreground mb-8">
        Logme는 Flexyz가 만든 도구입니다. <br />
        궁금한 점, 아이디어 제안, 또는 인사하고 싶으시다면 아래 폼을 통해 연락해 주세요.
      </p>
      <div className="space-y-4 text-sm">
        <p>
          📧 이메일:{' '}
          <a href="mailto:contact@logme.dev" className="underline">
            contact@logme.dev
          </a>
        </p>
        <p>
          💻 GitHub:{' '}
          <a
            href="https://github.com/flexyzwork"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            github.com/flexyzwork
          </a>
        </p>
        <p>
          ☕ 지원:{' '}
          <a
            href="https://buymeacoffee.com/flexyzwork"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            buymeacoffee.com/flexyzwork
          </a>
        </p>
      </div>

      <br />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="name"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          name="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Textarea
          placeholder="메시지"
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          메시지 보내기
        </Button>
      </form>
      <p className="mt-4">{result}</p>
    </main>
  )
}
