'use client'

import React from 'react'
import { cn } from '@/lib/utils'

const steps = [
  '템플릿 선택',
  '사이트 정보 입력',
  '노션 인증',
  '깃헙 & Vercel',
  '배포 중',
  '완료',
]

export default function ProgressSteps({ current }: { current: number }) {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < current
          const isActive = index === current

          return (
            <div key={index} className="flex-1 flex items-center relative">
              <div
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm z-10',
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                )}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-4 text-xs text-gray-600">
        {steps.map((step, index) => (
          <span
            key={index}
            className={cn(
              'w-20 text-center',
              index === current ? 'text-blue-600 font-medium' : ''
            )}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}