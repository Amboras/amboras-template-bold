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
              Curated edits — handpicked pieces grouped around a single mood, season, or theme.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom pb-section">
        {collections.length === 0 ? (
          <p className="text-center text-muted-foreground">No collections available yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection: any, idx: number) => {
              const description = typeof collection.metadata?.description === 'string'
                ? collection.metadata.description
                : null
              const num = String(idx + 1).padStart(2, '0')

              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group block rounded-md bg-muted/40 p-8 transition-all hover:-translate-y-0.5"
                >
                  <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">{num}</p>
                  <h2 className="mt-4 text-2xl font-body font-bold tracking-tight leading-snug group-hover:underline underline-offset-4">
                    {collection.title}
                  </h2>
                  {description && (
                    <p className="mt-2 text-[15px] text-foreground/60 leading-relaxed line-clamp-2">{description}</p>
                  )}
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                    Shop now
                    <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover:rotate-0" strokeWidth={1.75} />
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
