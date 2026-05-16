'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search as SearchIcon, ArrowRight, X } from 'lucide-react'
import ProductGrid from '@/components/product/product-grid'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'

const SUGGESTIONS = ['New arrivals', 'Best sellers', 'Linen', 'Outerwear', 'Sale']

export default function SearchPage() {
  const [query, setQuery] = useState('')

  return (
    <>
      {/* Hero search */}
      <section className="bg-background pt-8 pb-6 sm:pt-10 sm:pb-8 lg:pt-14 lg:pb-10">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              Find it fast.
              <br />
              <span className="text-foreground/55">Type something good.</span>
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              Search the whole catalogue products, materials, collections. Hit enter or just look.
            </p>
          </div>

          {/* Search field — pill */}
          <div className="mt-7 sm:mt-9 max-w-3xl">
            <div className="relative rounded-md bg-muted/40 border border-black/[0.06] focus-within:border-foreground/20 transition-colors">
              <SearchIcon
                className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-foreground/45"
                strokeWidth={1.75}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, collections, materials"
                autoFocus
                className="w-full bg-transparent rounded-md pl-11 sm:pl-14 pr-12 sm:pr-14 py-3.5 sm:py-4 text-base sm:text-lg placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.05] hover:bg-foreground/[0.1] transition-colors"
                >
                  <X className="h-3.5 w-3.5 text-foreground/70" strokeWidth={1.75} />
                </button>
              )}
            </div>

            {/* Quick suggestions */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-foreground/45 font-medium mr-1">
                Try
              </span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-black/[0.08] bg-background hover:bg-muted/60 hover:border-foreground/20 px-3 py-1.5 text-xs font-medium text-foreground/75 transition-colors duration-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-10 sm:pb-14 lg:pb-20">
        <div className="container-custom">
          {query ? (
            <>
              <div className="flex items-baseline justify-between gap-4 mb-5 sm:mb-7">
                <p className="text-[13px] sm:text-sm text-foreground/60">
                  Results for <span className="text-foreground font-medium">&ldquo;{query}&rdquo;</span>
                </p>
              </div>
              <ClientPluginSlot name="searchAboveResults" context={{ query }} />
              <ProductGrid limit={20} query={query} />
            </>
          ) : (
            <div className="rounded-md bg-muted/40 p-6 sm:p-10 lg:p-14 text-center">
              <div className="mx-auto inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-background border border-black/[0.06]">
                <SearchIcon className="h-5 w-5 text-foreground/55" strokeWidth={1.5} />
              </div>
              <h2 className="mt-5 font-body font-bold tracking-tight text-[clamp(1.375rem,2.4vw,1.875rem)] leading-snug">
                Start with a word.
              </h2>
              <p className="mt-2 text-[14px] sm:text-[15px] text-foreground/60 max-w-md mx-auto leading-relaxed">
                Or browse the full catalogue everything we make, in one place.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-7 active:scale-[0.98]"
                  prefetch={true}
                >
                  <span>Browse all products</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                    <ArrowRight
                      className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0"
                      strokeWidth={1.75}
                    />
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
