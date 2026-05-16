'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { HERO_PLACEHOLDER, LIFESTYLE_PLACEHOLDER } from '@/lib/utils/placeholder-images'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
  }

  return (
    <>
      {/* Hero — image-led editorial, single focal point */}
      <section className="bg-background pt-4 pb-10 sm:pt-6 lg:pt-8 lg:pb-16">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-md aspect-[4/5] sm:aspect-[16/9] lg:aspect-[2.1/1] min-h-[460px] lg:min-h-[560px] animate-fade-in">
            <Image
              src={HERO_PLACEHOLDER}
              alt="Hero - New Collection"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />

            {/* Bottom gradient for legibility */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
            />

            {/* Bottom-left: pill CTA pair */}
            <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 flex items-center gap-2">
              <Link
                href="/products"
                className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                prefetch={true}
              >
                Shop now
              </Link>
              <Link
                href="/products"
                aria-label="Browse products"
                className="group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                prefetch={true}
              >
                <ArrowRight
                  className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:-rotate-[15deg]"
                  strokeWidth={2}
                />
              </Link>
            </div>

            {/* Bottom-right: headline + subcopy */}
            <div className="absolute bottom-6 right-5 left-5 sm:bottom-8 sm:right-8 sm:left-auto lg:bottom-10 lg:right-12 max-w-lg sm:text-right text-white animate-fade-in-up">
              <h1 className="font-heading font-semibold leading-[1.04] tracking-tight text-balance text-[clamp(2.25rem,5.4vw,4rem)]">
                Designed to stand out
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed sm:ml-auto sm:max-w-md">
                High-contrast pieces for people who refuse to blend in shop the loudest drop of the season.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* homeHero slot — social proof, countdown timers */}
      <ClientPluginSlot name="homeHero" />

      {/* Collections */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      {/* homeBelowFeatured slot — recently viewed, newsletter plugins */}
      <ClientPluginSlot name="homeBelowFeatured" />

      {/* Feature triplet — numbered values grid */}
      <section className="py-section border-y border-border/60">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:gap-16">
            {[
              {
                num: '01',
                title: 'Deliver with quality',
                body: 'Every product is crafted with care and attention to detail, ensuring the best for your customers.',
              },
              {
                num: '02',
                title: 'Designed to impress',
                body: 'A sleek, modern store that enhances your brand and creates a memorable shopping experience.',
              },
              {
                num: '03',
                title: 'Curated for you',
                body: 'Handpicked selections that reflect the latest trends and timeless essentials.',
              },
            ].map((item) => (
              <div key={item.num} className="space-y-4">
                <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">
                  {item.num}
                </p>
                <h3 className="text-2xl font-body font-bold tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xs">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial / Brand Story — cozy editorial luxury */}
      <section className="py-section">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-lg bg-muted/40 p-6 sm:p-10 lg:p-16">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Image — nested concentric radii (double-bezel) */}
              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-md aspect-[4/5] bg-muted shadow-[0_24px_60px_-30px_rgba(70,50,30,0.22)]">
                  <Image
                    src={LIFESTYLE_PLACEHOLDER}
                    alt="Lifestyle - Our Philosophy"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03]"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="lg:col-span-6 space-y-6 lg:pl-4 xl:pl-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-black/[0.06] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-foreground/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Our philosophy
                </span>

                <h2 className="font-heading font-semibold leading-[1.05] tracking-tight text-balance text-[clamp(2rem,4vw,3.25rem)]">
                  Quiet is overrated.
                  <br />
                  <span className="text-foreground/55">Comfort wins.</span>
                </h2>

                <p className="text-base lg:text-[17px] text-foreground/65 leading-relaxed max-w-md">
                  Every piece is chosen for its quality, design, and the story behind it. We believe in fewer, better things — pieces that last and bring joy to everyday moments.
                </p>

                <div className="pt-2">
                  <Link
                    href="/about"
                    className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-7 active:scale-[0.98]"
                    prefetch={true}
                  >
                    <span>Read our story</span>
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
        </div>
      </section>

      {/* Trust / Features Bar */}
      {/* <section className="py-section-sm border-y">
        <div className="container-custom">
          
        </div>
      </section> */}

      {/* Newsletter — cozy cream panel, form left, image right */}
      <section className="py-section">
        <div className="container-custom">
          <div className="overflow-hidden rounded-md bg-foreground p-6 sm:p-10 lg:p-14">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Text + form */}
              <div className="lg:col-span-6 space-y-6 lg:pr-6">
                <h2 className="font-body font-bold tracking-tight text-background text-balance leading-[1.08] text-[clamp(1.875rem,3.6vw,2.75rem)]">
                  Stay ahead with exclusive deals!
                </h2>
                <p className="text-[15px] text-background/60 leading-relaxed max-w-md">
                  Be the first to know about special offers. Join our newsletter and get exclusive perks delivered straight to your inbox!
                </p>
                <form
                  className="flex flex-wrap items-center gap-3 pt-2"
                  onSubmit={handleNewsletterSubmit}
                >
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-[220px] rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="border border-background/90 hover:border-background rounded-full text-lg font-medium px-4 py-2 text-background hover:opacity-70 transition-opacity"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Image right */}
              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-md w-full h-[377px] bg-muted shadow-[0_20px_50px_-25px_rgba(70,50,30,0.2)]">
                  <Image
                    src="/media/placeholders/email.avif"
                    alt="Stay ahead with exclusive deals"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
