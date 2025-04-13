'use client'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import Image from 'next/image'
import guideData from '@/data/connection-guides.json'

export default function ConnectGuideAccordion() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">계정 연결 가이드</h2>
      <Accordion type="single" collapsible>
        {guideData.map((guide) => (
          <AccordionItem key={guide.id} value={guide.id}>
            <AccordionTrigger>{guide.title}</AccordionTrigger>
            <AccordionContent>
              {guide.steps.map((step, idx) => (
                <div key={idx} className="mb-6">
                  <p className="text-sm mb-2">{step.text}</p>
                  <Image
                    src={step.image}
                    width={600}
                    height={300}
                    alt={step.text}
                    className="rounded border"
                  />
                </div>
              ))}
              {guide.link && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    const popupLeft = window.screenX + window.outerWidth
                    const popupTop = window.screenY
                    window.open(
                      guide.link.url,
                      '_blank',
                      `width=800,height=${window.innerHeight},left=${popupLeft},top=${popupTop}`
                    )
                  }}
                >
                  {guide.link.text}
                </a>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}
