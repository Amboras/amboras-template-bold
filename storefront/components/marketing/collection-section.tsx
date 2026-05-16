'use client'

import Link from 'next/link'
import ProductGrid from '@/components/product/product-grid'

interface CollectionSectionProps {
  collection: any
  alternate?: boolean
}

export default function CollectionSection({ collection, alternate }: CollectionSectionProps) {
  const description = collection.metadata?.description
  const hasDescription = typeof description === 'string' && description

  return (
    <section className={`py-section`}>
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 mb-10 sm:mb-12">
          <div>
            <h2 className="font-body font-bold tracking-tight text-balance text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.05]">
              {collection.title}
            </h2>
            <p className="mt-3 text-xl uppercase tracking-tight font-medium text-muted-foreground">
              Fresh selections
            </p>
            {hasDescription && (
              <p className="text-muted-foreground mt-4 max-w-lg">{description}</p>
            )}
          </div>
          <Link
            href={`/collections/${collection.handle}`}
            className="text-lg text-foreground border font-medium border-border rounded-full px-4 py-2 hover:border-foreground transition-colors duration-200 shrink-0 sm:mt-2"
            prefetch={true}
          >
            View more
          </Link>
        </div>
        <ProductGrid collectionId={collection.id} limit={3} columns={3} />
      </div>
    </section>
  )
}
