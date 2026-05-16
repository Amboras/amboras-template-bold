import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPolicies } from '@/lib/get-policies'
import { PolicyMarkdown } from '@/components/policy-markdown'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How we use cookies, third-party cookies, and how to manage your preferences.',
}

export default async function CookiePolicyPage() {
  const policies = await getPolicies()

  const policy = policies?.cookie_policy
  const contactEmail = policies?.contact_email || 'privacy@yourstore.com'
  const updatedAt = policies?.updated_at
    ? new Date(policies.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'March 2026'

  const sections = [
    {
      title: 'What are cookies',
      body: "Cookies are small text files placed on your computer or mobile device when you visit our site. They help the site work efficiently and give us a sense of how it's being used.",
    },
    {
      title: 'How we use cookies',
      body: 'We use cookies for a few purposes — keeping your cart and checkout working (essential), understanding aggregate usage (analytics), showing you relevant ads (marketing), and remembering your preferences across visits.',
    },
    {
      title: 'Third-party cookies',
      body: 'We rely on trusted partners — analytics tools and payment processors — that may set their own cookies. These are governed by their respective policies.',
    },
    {
      title: 'Managing cookies',
      body: 'You can control cookies through your browser settings. Note that disabling essential cookies will break parts of the store, including the cart and checkout flow.',
    },
    {
      title: 'Your consent',
      body: 'By using the site, you consent to cookies as outlined here. You can withdraw consent at any time using the "Manage cookies" option in the footer.',
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-background pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              Cookie policy.
              <br />
              <span className="text-foreground/55">Plain and human.</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              What we store on your device, why we store it, and how you stay in control.
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
            {/* Content */}
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

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="rounded-md border border-black/[0.06] p-5 sm:p-7 lg:p-8 lg:sticky lg:top-24">
                <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">
                  Need help?
                </p>
                <h2 className="mt-3 font-body font-bold tracking-tight text-[clamp(1.25rem,2vw,1.5rem)] leading-snug">
                  Questions about cookies?
                </h2>
                <p className="mt-3 text-[14px] text-foreground/60 leading-relaxed">
                  Write to <span className="text-foreground break-all">{contactEmail}</span> and we&apos;ll walk you through it.
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
