'use client'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Step {
  text: string
  image?: string
}

interface Guide {
  id: string
  title: string
  steps: Step[]
  link?: { text: string; url: string }
}

export default function GuideAccordion({
  guideData,
  title,
  defaultValue,
}: {
  guideData: Guide[]
  title: string
  defaultValue?: string
}) {
  const [activeValue, setActiveValue] = useState<string | undefined>(defaultValue)

  useEffect(() => {
    const hash = activeValue
    if (hash) {
      setActiveValue(hash)
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    }
    // }
  }, [])

  const openPopup = (url: string) => {
    const popupLeft = window.screenX + window.outerWidth
    const popupTop = window.screenY
    window.open(
      url,
      '_blank',
      `width=800,height=${window.innerHeight},left=${popupLeft},top=${popupTop}`
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      <Accordion type="single" collapsible defaultValue={activeValue}>
        {guideData.map((guide) => (
          <AccordionItem key={guide.id} value={guide.id}>
            <AccordionTrigger>{guide.title}</AccordionTrigger>
            <AccordionContent>
              {guide.link && (
                <div className="mb-4">
                  <a
                    href="#"
                    className="text-sm font-semibold underline"
                    onClick={(e) => {
                      e.preventDefault()
                      guide.link?.url && openPopup(guide.link.url)
                    }}
                  >
                    {guide.link.text}
                  </a>
                </div>
              )}

              {guide.steps.map((step, idx) => (
                <div key={idx} className="mb-6">
                  <p className="text-sm mb-2">{step.text}</p>
                  {step.image && (
                    <Image
                      src={step.image}
                      width={600}
                      height={300}
                      alt={typeof step.text === 'string' ? step.text : ''}
                      className="rounded border"
                    />
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}
