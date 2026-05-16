import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPolicies } from '@/lib/get-policies'
import { PolicyMarkdown } from '@/components/policy-markdown'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Our refund policy including eligibility, processing times, and non-refundable items.',
}

export default async function RefundPolicyPage() {
  const policies = await getPolicies()

  const policy = policies?.refund_policy
  const contactEmail = policies?.contact_email || 'support@yourstore.com'
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'March 2026'

  const sections: { title: string; body: string; bullets?: string[] }[] = [
    {
      title: 'Refund eligibility',
      body: 'We accept returns and offer full refunds within 30 days of delivery, provided the item meets our return criteria.',
      bullets: [
        'Items must be in original condition with tags attached',
        'Items must be unworn, unwashed, and undamaged',
        'Original packaging should be included when possible',
      ],
    },
    {
      title: 'Non-refundable items',
      body: 'A few categories are final sale and cannot be refunded:',
      bullets: [
        'Sale or clearance items',
        'Gift cards',
        'Downloadable products',
        'Personal care items',
      ],
    },
    {
      title: 'Refund processing',
      body: 'Once we receive and inspect your return, we let you know whether the refund is approved. Approved refunds land back on the original payment method within 5 to 7 business days.',
    },
    {
      title: 'Late or missing refunds',
      body: "If it's been more than 7 business days, double-check your bank account, then contact your card issuer. Still nothing? Email us and we'll trace it.",
    },
    {
      title: 'Exchanges',
      body: 'Need a different size or colour? Start a return and place a new order for the piece you want — that way the right one ships the moment we get the old one back.',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-background pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              Refund policy.
              <br />
              <span className="text-foreground/55">No drama, no friction.</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              30 days, original condition, money back where it came from. That&apos;s the deal.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-foreground/45 font-medium">
              Last updated &middot; {updatedAt}
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-10 sm:pb-14 lg:pb-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-5 lg:gap-6">
            <div className="lg:col-span-8">
              {policy ? (
                <div className="rounded-md bg-muted/40 p-5 sm:p-8 lg:p-10">
                  <div className="prose prose-sm max-w-none text-foreground/70 leading-relaxed">
                    <PolicyMarkdown content={policy} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-3.5">
                  {sections.map((s, i) => (
                    <article
                      key={s.title}
                      className="rounded-md bg-muted/40 p-5 sm:p-7 lg:p-8"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span className="text-sm text-muted-foreground/70 font-medium tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h2 className="font-body font-bold tracking-tight text-[clamp(1.125rem,1.8vw,1.375rem)] leading-snug">
                          {s.title}
                        </h2>
                      </div>
                      <div className="mt-3 sm:mt-4 sm:pl-[3.25rem] text-[14px] sm:text-[15px] text-foreground/65 leading-relaxed space-y-3">
                        <p>{s.body}</p>
                        {s.bullets && (
                          <ul className="space-y-2">
                            {s.bullets.map((b) => (
                              <li key={b} className="flex gap-3">
                                <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-foreground/40" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <aside className="lg:col-span-4">
              <div className="rounded-md border border-black/[0.06] p-5 sm:p-7 lg:p-8 lg:sticky lg:top-24">
                <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">
                  Need a return?
                </p>
                <h2 className="mt-3 font-body font-bold tracking-tight text-[clamp(1.25rem,2vw,1.5rem)] leading-snug">
                  Start it from your account.
                </h2>
                <p className="mt-3 text-[14px] text-foreground/60 leading-relaxed">
                  Or email <span className="text-foreground break-all">{contactEmail}</span> and we&apos;ll set it up for you.
                </p>
                <div className="pt-5">
                  <Link
                    href="/account/orders"
                    className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-5 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-6 active:scale-[0.98]"
                    prefetch={true}
                  >
                    <span>Open an order</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                      <ArrowRight
                        className="h-3.5 w-3.5 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0"
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
