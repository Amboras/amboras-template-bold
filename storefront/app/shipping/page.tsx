import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPolicies } from '@/lib/get-policies'
import { PolicyMarkdown } from '@/components/policy-markdown'

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'Shipping methods, delivery times, return policy, and exchange information.',
}

const SHIPPING_ROWS = [
  { method: 'Standard', time: '5 7 business days', cost: 'Free over $75 / $5.99' },
  { method: 'Express', time: '2 3 business days', cost: '$12.00' },
  { method: 'Overnight', time: '1 business day', cost: '$25.00' },
  { method: 'International', time: '10 14 business days', cost: 'Calculated at checkout' },
]

const RETURNS = [
  'Items must be unworn, unwashed, and in original condition with tags attached.',
  'Sale items are final sale and cannot be returned.',
  'Return shipping is free for domestic orders.',
  'Refunds are processed within 5 7 business days after we receive the return.',
]

export default async function ShippingPage() {
  const policies = await getPolicies()

  const shippingPolicy = policies?.shipping_policy
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null

  return (
    <>
      {/* Hero */}
      <section className="bg-background pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              Shipping & returns.
              <br />
              <span className="text-foreground/55">Simple, on purpose.</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              How your order travels, how long it takes, and what to do if it isn&apos;t right.
            </p>
            {updatedAt && (
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-foreground/45 font-medium">
                Last updated &middot; {updatedAt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-10 sm:pb-14 lg:pb-20">
        <div className="container-custom">
          {shippingPolicy ? (
            <div className="rounded-md bg-muted/40 p-5 sm:p-8 lg:p-12 max-w-3xl">
              <div className="prose prose-sm max-w-none text-foreground/70 leading-relaxed">
                <PolicyMarkdown content={shippingPolicy} />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-5 lg:gap-6">
              {/* Shipping panel */}
              <div className="lg:col-span-7">
                <div className="rounded-md bg-muted/40 p-5 sm:p-8 lg:p-10">
                  <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">01</p>
                  <h2 className="mt-3 font-body font-bold tracking-tight text-[clamp(1.5rem,2.6vw,2rem)] leading-snug">
                    Shipping
                  </h2>
                  <p className="mt-3 text-[15px] text-foreground/60 max-w-md leading-relaxed">
                    Free standard shipping on every order over $75. Orders ship within 1 2 business days.
                  </p>

                  {/* Table — card-style on mobile, table on desktop */}
                  <div className="mt-6 rounded-md border border-black/[0.06] bg-background overflow-hidden">
                    {/* Header — desktop */}
                    <div className="hidden sm:grid grid-cols-[1.1fr_1.4fr_1.4fr] gap-4 px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-foreground/55 bg-muted/30">
                      <span>Method</span>
                      <span>Delivery</span>
                      <span>Cost</span>
                    </div>
                    <ul className="divide-y divide-black/[0.05]">
                      {SHIPPING_ROWS.map((r) => (
                        <li
                          key={r.method}
                          className="grid grid-cols-1 sm:grid-cols-[1.1fr_1.4fr_1.4fr] gap-1 sm:gap-4 px-5 py-4 text-[14px]"
                        >
                          <span className="font-medium text-foreground">{r.method}</span>
                          <span className="text-foreground/65">{r.time}</span>
                          <span className="text-foreground/65">{r.cost}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-5 text-[14px] text-foreground/55 leading-relaxed">
                    Tracking is emailed the moment your order ships no chasing required.
                  </p>
                </div>
              </div>

              {/* Returns + Exchanges stacked */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-5 lg:gap-6">
                <div className="rounded-md bg-muted/40 p-5 sm:p-8 lg:p-10">
                  <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">02</p>
                  <h2 className="mt-3 font-body font-bold tracking-tight text-[clamp(1.5rem,2.6vw,2rem)] leading-snug">
                    Returns
                  </h2>
                  <p className="mt-3 text-[15px] text-foreground/60 leading-relaxed">
                    Not right? Send it back within 30 days of delivery.
                  </p>
                  <ul className="mt-5 space-y-3">
                    {RETURNS.map((line, i) => (
                      <li key={i} className="flex gap-3 text-[14px] text-foreground/70 leading-relaxed">
                        <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-foreground/40" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-md border border-black/[0.06] p-5 sm:p-8 lg:p-10">
                  <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">03</p>
                  <h2 className="mt-3 font-body font-bold tracking-tight text-[clamp(1.5rem,2.6vw,2rem)] leading-snug">
                    Exchanges
                  </h2>
                  <p className="mt-3 text-[15px] text-foreground/60 leading-relaxed">
                    Free exchanges on full-price items size, colour, whatever fits better. Start one from your account.
                  </p>
                  <div className="pt-6">
                    <Link
                      href="/account/orders"
                      className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-7 active:scale-[0.98]"
                      prefetch={true}
                    >
                      <span>Start an exchange</span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                        <ArrowRight
                          className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0"
                          strokeWidth={1.75}
                        />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
