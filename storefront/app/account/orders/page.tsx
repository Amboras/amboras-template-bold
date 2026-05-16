'use client'

import { useQuery } from '@tanstack/react-query'
import { getMedusaClient } from '@/lib/medusa-client'
import AccountLayout from '@/components/account/account-layout'
import Link from 'next/link'
import { Package, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format-price'

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await getMedusaClient().store.order.list()
      return response.orders
    },
    retry: false,
  })

  const orders = data || []

  return (
    <AccountLayout>
      <div>
        <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
          Orders
        </h1>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-md border border-dashed border-black/[0.08] p-12 text-center">
              <Package className="h-8 w-8 mx-auto text-muted-foreground/40" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-muted-foreground">No orders yet</p>
              <Link
                href="/products"
                className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => {
                const date = new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
                const total = order.total
                  ? formatPrice(order.total, order.currency_code || 'usd')
                  : '—'

                return (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="block rounded-md bg-muted/40 p-5 sm:p-6 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          Order #{order.display_id || order.id.slice(-8)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{total}</p>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {order.fulfillment_status || order.status || 'processing'}
                        </p>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-black/[0.06]">
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}: {' '}
                          {order.items.map((i: any) => i.title).join(', ')}
                        </p>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  )
}
