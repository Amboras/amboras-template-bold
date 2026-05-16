import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPolicies } from '@/lib/get-policies'
import { PolicyMarkdown } from '@/components/policy-markdown'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our terms of service, including online store terms, pricing, and general conditions.',
}

export default async function TermsPage() {
  const policies = await getPolicies()

  const policy = policies?.terms_of_service
  const storeName = policies?.store_name || 'Store'
  const contactEmail = policies?.contact_email || 'legal@yourstore.com'
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'March 2026'

  const sections: { title: string; body: string }[] = [
    {
      title: 'Overview',
      body: `This site is operated by ${storeName}. Throughout the site, "we", "us" and "our" refer to ${storeName}. By using the site you accept the terms, conditions, policies and notices set out here.`,
    },
    {
      title: 'Online store terms',
      body: 'By agreeing to these Terms of Service, you confirm you are at least the age of majority in your region. You may not use our products for any unlawful purpose or violate any laws in your jurisdiction.',
    },
    {
      title: 'General conditions',
      body: 'We may refuse service to anyone for any reason at any time. Your content may be transferred unencrypted over various networks and adapted to meet technical requirements.',
    },
    {
      title: 'Accuracy of information',
      body: 'We are not responsible if information made available on this site is not accurate, complete, or current. Material here is for general information only and should not be the sole basis for decisions.',
    },
    {
      title: 'Products & pricing',
      body: 'Some products may be available online only and in limited quantities. They are subject to our Return Policy. We reserve the right to limit quantities, and all descriptions or prices may change at any time without notice.',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-background pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              Terms of service.
              <br />
              <span className="text-foreground/55">The fine print, in plain English.</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              The rules of the road for shopping with {storeName}. Short, fair, written by humans.
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
                      <p className="mt-3 sm:mt-4 sm:pl-[3.25rem] text-[14px] sm:text-[15px] text-foreground/65 leading-relaxed">
                        {s.body}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <aside className="lg:col-span-4">
              <div className="rounded-md border border-black/[0.06] p-5 sm:p-7 lg:p-8 lg:sticky lg:top-24">
                <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">
                  Legal questions
                </p>
                <h2 className="mt-3 font-body font-bold tracking-tight text-[clamp(1.25rem,2vw,1.5rem)] leading-snug">
                  Anything unclear?
                </h2>
                <p className="mt-3 text-[14px] text-foreground/60 leading-relaxed">
                  Reach us at <span className="text-foreground break-all">{contactEmail}</span> we&apos;re happy to walk you through it.
                </p>
                <div className="pt-5">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-5 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-6 active:scale-[0.98]"
                    prefetch={true}
                  >
                    <span>Contact us</span>
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
