'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

function FaqItem({ q, a, num }: { q: string; a: string; num: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`rounded-md border transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        open ? 'border-black/[0.10] bg-muted/40' : 'border-black/[0.06] bg-transparent hover:bg-muted/30'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start gap-4 sm:gap-6 px-4 py-4 sm:px-6 sm:py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-xs sm:text-sm text-muted-foreground/70 font-medium tabular-nums pt-1">
          {num}
        </span>
        <span className="flex-1 text-[15px] sm:text-base font-medium tracking-tight pr-2 leading-snug">
          {q}
        </span>
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.04]"
        >
          <Plus
            className={`h-3.5 w-3.5 text-foreground/70 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? 'rotate-45' : 'rotate-0'
            }`}
            strokeWidth={1.75}
          />
        </span>
      </button>
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[14px] sm:text-[15px] text-foreground/65 leading-relaxed px-4 pb-5 sm:px-6 sm:pb-6 sm:pl-[4.25rem]">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="space-y-2.5">
      {faqs.map((faq, i) => (
        <FaqItem
          key={i}
          num={String(i + 1).padStart(2, '0')}
          {...faq}
        />
      ))}
    </div>
  )
}
