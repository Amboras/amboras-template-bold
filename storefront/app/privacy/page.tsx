import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPolicies } from '@/lib/get-policies'
import { PolicyMarkdown } from '@/components/policy-markdown'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how we collect, use, and protect your personal information.',
}

export default async function PrivacyPage() {
  const policies = await getPolicies()

  const policy = policies?.privacy_policy
  const contactEmail = policies?.contact_email || 'privacy@yourstore.com'
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'March 2026'

  const sections: { title: string; body: string; bullets?: string[] }[] = [
    {
      title: 'Information we collect',
      body: 'When you visit our store, we collect device information, details of your interactions with the store, and the data needed to process your purchases. We may also collect information when you reach out for support.',
    },
    {
      title: 'How we use your information',
      body: 'We use the information we collect to:',
      bullets: [
        'Process and fulfill your orders',
        'Communicate with you about orders, products, and promotions',
        'Screen orders for potential risk or fraud',
        'Improve and optimize the store',
        'Send relevant updates about new products',
      ],
    },
    {
      title: 'Sharing your information',
      body: 'We share data only with the service providers that help us run the business — payment processors, shipping carriers, and analytics providers. Each operates under strict agreements.',
    },
    {
      title: 'Your rights',
      body: 'If you are an EU/EEA resident, you have the right to access, correct, update, or request deletion of personal data we hold about you. Reach out and we will respond promptly.',
    },
    {
      title: 'Data retention',
      body: 'We retain order information for our records unless and until you ask us to delete it. Accounts can be removed at any time.',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-background pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              Privacy policy.
              <br />
              <span className="text-foreground/55">Your data, your call.</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              What we collect, why we collect it, and how to take it back any time you want.
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
                  Data requests
                </p>
                <h2 className="mt-3 font-body font-bold tracking-tight text-[clamp(1.25rem,2vw,1.5rem)] leading-snug">
                  Want a copy or a deletion?
                </h2>
                <p className="mt-3 text-[14px] text-foreground/60 leading-relaxed">
                  Email <span className="text-foreground break-all">{contactEmail}</span> and we&apos;ll handle it within 30 days.
                </p>
                <div className="pt-5">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-5 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-6 active:scale-[0.98]"
                    prefetch={true}
                  >
                    <span>Get in touch</span>
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
