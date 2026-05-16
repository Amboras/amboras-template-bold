import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FaqAccordion } from './faq-accordion'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about orders, shipping, returns, and more.',
}

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days within the US. Express shipping (2-3 business days) is available at checkout. International orders typically arrive within 10-14 business days.' },
  { q: 'Do you ship internationally?', a: 'Yes — we ship to most countries worldwide. International shipping rates and delivery times vary by destination. You\'ll see the exact cost at checkout.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can also check your order status anytime through your account dashboard.' },
  { q: 'Are your products sustainably made?', a: 'We prioritize working with artisans and manufacturers who use ethical practices and sustainable materials. All packaging is recycled and recyclable, and we offset carbon emissions from every shipment.' },
  { q: 'Can I modify or cancel my order?', a: 'Orders can be modified or cancelled within 2 hours of placement. After that, we begin processing and may not be able to make changes. Contact us immediately if you need help.' },
  { q: 'Do you offer gift wrapping?', a: 'Yes, we offer complimentary gift wrapping on all orders. Simply select the gift wrap option at checkout and include a personalized message.' },
  { q: 'How do I care for my products?', a: 'Care instructions are included with every product and available on each product page. When in doubt, follow the care label attached to the item or contact us for guidance.' },
]

export default function FaqPage() {
  return (
    <>
      {/* Hero — editorial left-aligned */}
      <section className="bg-background pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              Questions, answered.
              <br />
              <span className="text-foreground/55">No tiny print.</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              The shortlist of what most people ask before they buy from us. Still curious? Reach out we like the conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section className="pb-10 sm:pb-14 lg:pb-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-5 lg:gap-6">
            <div className="lg:col-span-8">
              <FaqAccordion faqs={faqs} />
            </div>

            {/* Sticky help card */}
            <aside className="lg:col-span-4">
              <div className="rounded-md bg-muted/40 p-5 sm:p-8 lg:p-9 lg:sticky lg:top-24">
                <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">
                  Still stuck?
                </p>
                <h2 className="mt-3 font-body font-bold tracking-tight text-[clamp(1.5rem,2.4vw,1.875rem)] leading-snug">
                  Talk to a real human.
                </h2>
                <p className="mt-3 text-[15px] text-foreground/60 leading-relaxed max-w-sm">
                  Our team replies within one business day every email goes to a person, not a queue.
                </p>
                <div className="pt-6">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-7 active:scale-[0.98]"
                    prefetch={true}
                  >
                    <span>Contact us</span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                      <ArrowRight
                        className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0"
                        strokeWidth={1.75}
                      />
                    </span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
