'use client'

import { useState } from 'react'
import ProductGrid from '@/components/product/product-grid'
import { useQuery } from '@tanstack/react-query'
import { getMedusaClient } from '@/lib/medusa-client'
import { SlidersHorizontal, Search, ChevronDown } from 'lucide-react'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getMedusaClient().store.category.list({ limit: 100 })
      return response.product_categories
    },
  })

  const allCategories = categories || []

  return (
    <>
      {/* Page Header */}
      <section className="bg-background pt-8 lg:pt-14 pb-6 lg:pb-10">
        <div className="container-custom">
          <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2rem,4.5vw,3.5rem)]">
            Explore our shop
          </h1>
          <p className="mt-3 text-[15px] text-foreground/65 leading-relaxed max-w-md">
            Discover handpicked products made just for you.
          </p>
        </div>
      </section>

      <div className="container-custom pb-section">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-4 py-2 text-sm font-medium"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div>
                <label
                  htmlFor="product-search"
                  className="block text-xs text-muted-foreground mb-2.5"
                >
                  Search by product
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <input
                    id="product-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="w-full rounded-full bg-white border border-black/[0.06] pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Collections */}
              <div>
                <p className="text-xs text-muted-foreground mb-3">Collections</p>
                {loadingCategories ? (
                  <div className="space-y-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-9 bg-muted rounded-md animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                        !selectedCategory
                          ? 'bg-muted/40 text-foreground font-medium'
                          : 'text-foreground/70 hover:bg-muted/40'
                      }`}
                    >
                      All products
                    </button>
                    {allCategories.map((category: any) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-muted/40 text-foreground font-medium'
                            : 'text-foreground/70 hover:bg-muted/40'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort */}
              <div>
                <label
                  htmlFor="sort-by"
                  className="block text-xs text-muted-foreground mb-2.5"
                >
                  Sort by
                </label>
                <div className="relative">
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none rounded-full bg-white border border-black/[0.06] pl-4 pr-10 py-2.5 text-sm cursor-pointer focus:border-foreground/30 focus:outline-none transition-colors"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            <ProductGrid
              limit={100}
              categoryId={selectedCategory || undefined}
              sortBy={sortBy}
              query={searchQuery || undefined}
              columns={3}
            />
          </div>
        </div>
      </div>
    </>
  )
}
