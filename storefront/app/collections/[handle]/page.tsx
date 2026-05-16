import { notFound } from 'next/navigation'
import { medusaServerClient } from '@/lib/medusa-client'
import ProductGrid from '@/components/product/product-grid'
import { PluginSlot } from '@/components/PluginSlot'

async function getCollection(handle: string) {
  try {
    const response = await medusaServerClient.store.collection.list({
      handle: [handle],
    })
    return response.collections?.[0] || null
  } catch (error) {
    console.error('Error fetching collection:', error)
    return null
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const collection = await getCollection(handle)

  if (!collection) {
    notFound()
  }

  const description = collection.metadata?.description
  const hasDescription = typeof description === 'string' && description

  return (
    <>
      <section className="bg-background py-section-sm lg:py-section">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              {collection.title}
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              {hasDescription
                ? (description as string)
                : `Handpicked pieces from the ${collection.title} collection - quietly considered, made to last.`}
            </p>
          </div>
        </div>
      </section>
      <div className="container-custom pb-section">
        {/* Filter enhancements, promo banners */}
        <PluginSlot
          name="collectionAboveGrid"
          context={{ collectionId: collection.id, collectionTitle: collection.title }}
        />
        <ProductGrid collectionId={collection.id} limit={100} columns={3} />
        {/* Load-more extensions, banners */}
        <PluginSlot name="collectionBelowGrid" context={{ collectionId: collection.id }} />
      </div>
    </>
  )
}
