'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import { trackPurchase } from '@/lib/analytics'
import { getMedusaClient } from '@/lib/medusa-client'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'
import type { Order, OrderItem } from '@/types'

type PurchaseTrackingDetails = {
  value?: number
  currency?: string
  contentIds: string[]
  contents?: Array<{
    id: string
    quantity?: number
    item_price?: number
  }>
  numItems?: number
}

function toCurrencyValue(amount: number | null | undefined): number | undefined {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return undefined
  return Math.round(amount * 100) / 100
}

function buildPurchaseTrackingDetails(order: Order): PurchaseTrackingDetails {
  const items: OrderItem[] = Array.isArray(order?.items) ? order.items : []

  const contentIds = items
    .map((item: OrderItem) => item.variant_id || item.variant?.id || item.product_id)
    .filter(Boolean)

  const contents = items
    .map((item: OrderItem) => {
      const id = item.variant_id || item.variant?.id || item.product_id

      if (!id) {
        return null
      }

      return {
        id,
        quantity: item.quantity,
        item_price: toCurrencyValue(item.unit_price ?? item.total),
      }
    })
    .filter(Boolean) as Array<{
    id: string
    quantity?: number
    item_price?: number
  }>

  return {
    value: toCurrencyValue(order?.total),
    currency: order?.currency_code,
    contentIds,
    contents: contents.length > 0 ? contents : undefined,
    numItems: items.reduce((sum: number, item: OrderItem) => sum + (item.quantity || 0), 0),
  }
}

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')

  const analyticsTracked = useRef(false)
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseTrackingDetails | null>(null)
  const [purchaseDetailsLoaded, setPurchaseDetailsLoaded] = useState(false)

  useEffect(() => {
    if (!orderId || !purchaseDetailsLoaded || analyticsTracked.current) {
      return
    }

    analyticsTracked.current = true

    trackPurchase(orderId, {
      value: purchaseDetails?.value,
      currency: purchaseDetails?.currency,
      itemCount: purchaseDetails?.numItems,
      contentIds: purchaseDetails?.contentIds,
      contents: purchaseDetails?.contents,
    })
  }, [orderId, purchaseDetails, purchaseDetailsLoaded])

  useEffect(() => {
    if (!orderId) {
      setPurchaseDetails(null)
      setPurchaseDetailsLoaded(false)
      return
    }

    let cancelled = false

    const loadOrder = async () => {
      try {
        const { order } = await getMedusaClient().store.order.retrieve(orderId)

        if (!cancelled) {
          setPurchaseDetails(buildPurchaseTrackingDetails(order))
        }
      } catch {
        if (!cancelled) {
          setPurchaseDetails({
            contentIds: [orderId],
          })
        }
      } finally {
        if (!cancelled) {
          setPurchaseDetailsLoaded(true)
        }
      }
    }

    loadOrder()

    return () => {
      cancelled = true
    }
  }, [orderId])


  return (
    <div className="container-custom py-section">
      <div className="max-w-lg mx-auto">
        <div className="overflow-hidden rounded-md bg-muted/40 p-6 sm:p-10 lg:p-12 text-center">
          <CheckCircle className="h-14 w-14 mx-auto text-green-600" strokeWidth={1.5} />

          <h1 className="mt-6 font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
            Thank you!
          </h1>
          <p className="mt-3 text-[15px] text-foreground/65 leading-relaxed">
            Your order has been placed successfully.
          </p>

          {orderId && (
            <div className="mt-6 rounded-md bg-white/80 border border-black/[0.06] p-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]">Order ID</p>
              <p className="mt-1 text-sm font-mono font-medium">{orderId}</p>
            </div>
          )}

          <div className="mt-6 rounded-md bg-white/80 border border-black/[0.06] p-5 text-left">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">What happens next?</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  You&apos;ll receive a confirmation email shortly. Once your order ships,
                  we&apos;ll send you tracking information.
                </p>
              </div>
            </div>
          </div>

          {/* checkoutComplete slot — purchase trackers, loyalty earn confirmation */}
          <ClientPluginSlot
            name="checkoutComplete"
            context={{
              orderId: orderId ?? undefined,
              total: purchaseDetails?.value,
              currency: purchaseDetails?.currency,
              itemCount: purchaseDetails?.numItems,
            }}
          />

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-7 active:scale-[0.98]"
            >
              <span>Continue shopping</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0" strokeWidth={1.75} />
              </span>
            </Link>
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center rounded-full border border-foreground/20 hover:border-foreground px-6 py-3 text-sm font-medium transition-colors"
            >
              My orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom py-section text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  )
}
