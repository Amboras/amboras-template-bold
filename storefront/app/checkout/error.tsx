'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, ShoppingBag } from 'lucide-react'

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Checkout error:', error)
    }
  }, [error])

  return (
    <div className="container-custom py-section">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-md bg-muted/40 p-6 sm:p-10 lg:p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" strokeWidth={1.5} />
          <h2 className="font-body font-bold tracking-tight text-balance leading-[1.1] text-[clamp(1.5rem,3vw,2rem)]">
            Checkout failed to load
          </h2>
          <p className="mt-3 text-[15px] text-foreground/65 leading-relaxed">
            Something went wrong while preparing your order. Your cart is safe — please try again or head back to review your items.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 hover:border-foreground px-6 py-3 text-sm font-medium transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
