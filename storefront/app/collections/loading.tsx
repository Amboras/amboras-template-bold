export default function CollectionsLoading() {
  return (
    <>
      <section className="bg-background py-section-sm lg:py-section">
        <div className="container-custom">
          <div className="max-w-3xl animate-pulse space-y-4">
            <div className="h-6 w-20 bg-muted rounded-full" />
            <div className="h-12 w-64 bg-muted rounded-md" />
            <div className="h-4 w-96 bg-muted rounded" />
          </div>
        </div>
      </section>

      <div className="container-custom pb-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-md bg-muted/40 p-8 space-y-3 animate-pulse">
              <div className="h-3 w-8 bg-muted rounded" />
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
