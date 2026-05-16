'use client'

import { usePolicies } from '@/hooks/use-policies'
import { ArrowRight, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const { policies, isLoading, error } = usePolicies()

  const contactEmail = policies?.contact_email
  const contactPhone = policies?.contact_phone
  const contactAddress = policies?.contact_address

  return (
    <>
      {/* Hero — editorial left-aligned */}
      <section className="bg-background pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-12">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              Let&apos;s talk.
              <br />
              <span className="text-foreground/55">We&apos;re listening.</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              Questions, requests, or just a hello write to us. We aim to reply within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="pb-10 sm:pb-14 lg:pb-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-5 lg:gap-6">
            {/* Form panel */}
            <div className="lg:col-span-7">
              <div className="rounded-md bg-muted/40 p-5 sm:p-8 lg:p-10">
                <h2 className="font-body font-bold tracking-tight text-[clamp(1.5rem,2.6vw,2rem)] leading-snug">
                  Send a message
                </h2>
                <p className="mt-2 text-[15px] text-foreground/60 max-w-md leading-relaxed">
                  Tell us what you need a curated reply lands in your inbox shortly.
                </p>

                <form className="mt-7 space-y-3.5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <input
                      type="text"
                      placeholder="First name"
                      className="w-full rounded-md bg-white/80 border border-black/[0.06] px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      className="w-full rounded-md bg-white/80 border border-black/[0.06] px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full rounded-md bg-white/80 border border-black/[0.06] px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                  />
                  <select
                    defaultValue=""
                    className="w-full rounded-md bg-white/80 border border-black/[0.06] px-4 py-3 text-sm text-foreground/80 focus:border-foreground/30 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="" disabled>Select a topic</option>
                    <option>Order inquiry</option>
                    <option>Product question</option>
                    <option>Returns & exchanges</option>
                    <option>Wholesale</option>
                    <option>Other</option>
                  </select>
                  <textarea
                    placeholder="Your message"
                    rows={5}
                    className="w-full rounded-md bg-white/80 border border-black/[0.06] px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors resize-none"
                  />

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-7 active:scale-[0.98]"
                    >
                      <span>Send message</span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                        <ArrowRight
                          className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0"
                          strokeWidth={1.75}
                        />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact info — numbered list */}
            <div className="lg:col-span-5">
              <div className="rounded-md border border-black/[0.06] p-5 sm:p-8 lg:p-10 h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <p className="text-sm text-muted-foreground">
                    Unable to load contact information. Please try again later.
                  </p>
                ) : (
                  <div className="space-y-7">
                    {contactEmail && (
                      <div className="space-y-1.5">
                        <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">01</p>
                        <h3 className="font-body font-bold tracking-tight text-lg leading-tight">Email</h3>
                        <a
                          href={`mailto:${contactEmail}`}
                          className="block text-[15px] text-foreground/80 hover:text-foreground transition-colors break-all"
                        >
                          {contactEmail}
                        </a>
                        <p className="text-[13px] text-foreground/55 leading-relaxed">
                          We respond within 24 hours.
                        </p>
                      </div>
                    )}

                    {contactPhone && (
                      <div className="space-y-1.5">
                        <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">02</p>
                        <h3 className="font-body font-bold tracking-tight text-lg leading-tight">Phone</h3>
                        <a
                          href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                          className="block text-[15px] text-foreground/80 hover:text-foreground transition-colors"
                        >
                          {contactPhone}
                        </a>
                        <p className="text-[13px] text-foreground/55 leading-relaxed">
                          Mon Fri, 9am to 6pm EST.
                        </p>
                      </div>
                    )}

                    {contactAddress && (
                      <div className="space-y-1.5">
                        <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">03</p>
                        <h3 className="font-body font-bold tracking-tight text-lg leading-tight">Studio</h3>
                        <p className="text-[15px] text-foreground/80 whitespace-pre-line leading-relaxed">
                          {contactAddress}
                        </p>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">
                        {String(
                          [contactEmail, contactPhone, contactAddress].filter(Boolean).length + 1,
                        ).padStart(2, '0')}
                      </p>
                      <h3 className="font-body font-bold tracking-tight text-lg leading-tight">Hours</h3>
                      <p className="text-[15px] text-foreground/80 leading-relaxed">
                        Mon Fri &middot; 9am to 6pm EST
                        <br />
                        Sat Sun &middot; 10am to 4pm EST
                      </p>
                    </div>

                    {!contactEmail && !contactPhone && !contactAddress && (
                      <p className="text-sm text-muted-foreground">
                        Contact information not yet configured.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
