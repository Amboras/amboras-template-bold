'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ProductAccordionProps {
  description?: string | null
  details?: Record<string, string>
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-black/[0.06] last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-5 text-left transition-colors"
      >
        <span className="text-lg font-body font-medium text-foreground">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-foreground/60 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={1.75}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen
            ? 'grid-rows-[1fr] opacity-100 pb-5'
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-base text-foreground/65 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductAccordion({ description }: ProductAccordionProps) {
  return (
    <div className="border-t border-black/[0.06]">
      {description && (
        <AccordionItem title="Product Details" defaultOpen>
          <div
            className="prose prose-sm max-w-none prose-p:my-2 prose-p:text-foreground/65 prose-ul:my-3 prose-ul:pl-5 prose-li:my-1 prose-li:text-foreground/65 prose-a:text-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </AccordionItem>
      )}

      <AccordionItem title="Size">
        <ul className="space-y-2">
          <li>Refer to the size guide for accurate measurements.</li>
          <li>Each piece is true to size unless noted otherwise.</li>
          <li>Contact support if you&apos;re between sizes.</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="Shipping and Returns">
        <ul className="space-y-2">
          <li>Free standard shipping on orders over $75.</li>
          <li>Express shipping available at checkout.</li>
          <li>Free returns within 30 days of delivery.</li>
          <li>Items must be unworn with original tags.</li>
        </ul>
      </AccordionItem>
    </div>
  )
}
