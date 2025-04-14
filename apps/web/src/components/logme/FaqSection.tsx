'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import faqs from '@/data/faqs.json'

export default function FaqSection() {
  return (
    <section className="max-w-2xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">자주 묻는 질문</h2>
      <Accordion type="single" collapsible>
        {faqs.map((item, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
