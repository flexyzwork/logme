// app/(with-shell)/contact/page.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Send to your API or 3rd party service
    setSubmitted(true)
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
          <a href="mailto:hello@flexyz.work" className="underline">
            hello@flexyz.work
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

      {submitted ? (
        <div className="text-center text-green-600 font-medium">
          Thank you! We'll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Textarea
            placeholder="Your message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      )}
    </main>
  )
}
