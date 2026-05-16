export default function CollectionDetailLoading() {
  return (
    <>
      <div className="container-custom pt-6">
        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
      </div>

      <section className="bg-background py-section-sm lg:py-section">
        <div className="container-custom">
          <div className="max-w-3xl animate-pulse space-y-4">
            <div className="h-6 w-24 bg-muted rounded-full" />
            <div className="h-12 w-64 bg-muted rounded-md" />
            <div className="h-4 w-96 bg-muted rounded" />
          </div>
        </div>
      </section>

      <div className="container-custom pb-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
