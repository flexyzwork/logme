'use client'

import { terms } from '@/modules/logme/contents'
import React from 'react'

const TermsOfService = () => {
  const content = terms.en

  return (
    <div className="flex flex-col justify-center items-center bg-customgreys-primarybg text-white-50 px-6 py-12">
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary-700">{content.title}</h1>
        <p className="text-gray-300 mt-4 text-sm md:text-base">
          These are the basic terms of service for using Logme.
        </p>
      </div>

      <div className="max-w-4xl bg-customgreys-secondarybg p-8 md:p-12 rounded-xl shadow-lg w-full">
        {content.sections.map((section, idx) => (
          <section className="mb-8" key={idx}>
            <h2 className="text-lg font-semibold text-primary-700 mb-3">{section.title}</h2>
            {section.content.map((line, i) => (
              <p key={i} className="text-sm text-gray-300 leading-relaxed">
                {line}
              </p>
            ))}
          </section>
        ))}
      </div>

      <footer className="mt-12 text-gray-400 text-xs">Last updated: {content.lastUpdated}</footer>
    </div>
  )
}

export default TermsOfService
