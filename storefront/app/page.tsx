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

      {/* Editorial / Brand Story Section */}
      <section className="py-section bg-muted/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden relative">
              <Image
                src={LIFESTYLE_PLACEHOLDER}
                alt="Lifestyle - Our Philosophy"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 lg:max-w-md">
              <p
                className="text-sm uppercase tracking-[0.2em] font-bold"
                style={{ color: 'hsl(var(--accent))' }}
              >
                Why Bold
              </p>
              <h2 className="text-h2 font-heading font-bold uppercase">
                Quiet Is Overrated
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every product in our collection is chosen for its quality, design, and the story behind it.
                We believe in fewer, better things — pieces that last and bring joy to everyday moments.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide link-underline pb-0.5"
                prefetch={true}
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Features Bar */}
      {/* <section className="py-section-sm border-y">
        <div className="container-custom">
          
        </div>
      </section> */}

      {/* Newsletter */}
      <section className="py-section">
        <div className="container-custom max-w-xl text-center">
          <h2 className="text-h2 font-heading font-semibold">Stay in Touch</h2>
          <p className="mt-3 text-muted-foreground">
            Be the first to know about new arrivals, exclusive offers, and more.
          </p>
          <form className="mt-8 flex gap-2" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 border-b border-foreground/30 bg-transparent px-1 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-foreground text-background px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
