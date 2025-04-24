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
    setResult('Sending....')
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
      setResult('Form Submitted Successfully')
      setTimeout(() => setResult(''), 2000)
    } else {
      setResult('Error: ' + data.message)
      logger.error('Error', data.message)
      await sendAlertFromClient({
        type: 'error',
        message: 'Error sending message',
        meta: { error: data.message },
      })
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Contact</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Logme is a tool built by <strong>Flexyz</strong>. If you have questions, ideas, or just want
        to say hello — feel free to reach out using the form below.
      </p>
      <div className="space-y-4 text-sm">
        <p>
          📧 Email:{' '}
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
          ☕ Support:{' '}
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
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          name="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Textarea
          placeholder="Your message"
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
      <p className="mt-4">{result}</p>
    </main>
  )
}
