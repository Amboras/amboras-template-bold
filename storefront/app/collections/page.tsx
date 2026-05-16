import { medusaServerClient } from '@/lib/medusa-client'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Collections' }

async function getCollections() {
  try {
    const response = await medusaServerClient.store.collection.list({ limit: 50 })
    return response.collections || []
  } catch {
    return []
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <>
      <section className="bg-background py-section-sm lg:py-section">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              Collections
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              Curated edits handpicked pieces grouped around a single mood, season, or theme.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom pb-section">
        {collections.length === 0 ? (
          <div className="rounded-md border border-dashed border-black/[0.08] p-12 text-center">
            <p className="text-sm text-muted-foreground">No collections available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {collections.map((collection: any, idx: number) => {
              const description =
                typeof collection.metadata?.description === 'string'
                  ? collection.metadata.description
                  : null
              const num = String(idx + 1).padStart(2, '0')
              const isHero = idx === 0
              const colSpan = isHero ? 'sm:col-span-2 lg:col-span-2' : ''
              const minH = isHero
                ? 'min-h-[420px] lg:min-h-[520px]'
                : 'min-h-[340px]'

              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className={`group relative flex flex-col rounded-md bg-muted/40 p-6 sm:p-8 lg:p-10 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-muted/60 animate-fade-in-up [animation-fill-mode:backwards] ${colSpan} ${minH}`}
                  style={{ animationDelay: `${Math.min(idx * 80, 400)}ms` }}
                  prefetch={true}
                >
                  {/* Top — number marker */}
                  <span className="text-[10px] font-medium uppercase tracking-[0.22em] tabular-nums text-foreground/45">
                    {num} / {String(collections.length).padStart(2, '0')}
                  </span>

                  {/* Middle — massive collection title + description */}
                  <div className="mt-auto pt-12 lg:pt-16">
                    <h2
                      className={`font-body font-bold tracking-tight leading-[1.02] text-balance ${
                        isHero
                          ? 'text-[clamp(2.5rem,5vw,4.5rem)]'
                          : 'text-[clamp(1.75rem,3vw,2.5rem)]'
                      }`}
                    >
                      {collection.title}
                    </h2>
                    {description && (
                      <p
                        className={`mt-3 max-w-md text-foreground/60 leading-relaxed line-clamp-2 ${
                          isHero ? 'text-base lg:text-[17px]' : 'text-[15px]'
                        }`}
                      >
                        {description}
                      </p>
                    )}
                  </div>

                  {/* Bottom — hairline + CTA */}
                  <div className="mt-8 lg:mt-10 flex items-center justify-between border-t border-black/[0.06] pt-5">
                    <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                      Browse the collection
                    </span>
                    <span
                      aria-hidden
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5"
                    >
                      <ArrowRight
                        className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0"
                        strokeWidth={2}
                      />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
