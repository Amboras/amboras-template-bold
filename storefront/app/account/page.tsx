'use client'

import { useAuth } from '@/hooks/use-auth'
import AccountLayout from '@/components/account/account-layout'
import Link from 'next/link'
import { Package, MapPin, User, ArrowRight } from 'lucide-react'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'

export default function AccountPage() {
  const { customer } = useAuth()

  return (
    <AccountLayout>
      <div>
        {/* account slot — invisible identify-on-login trackers */}
        <ClientPluginSlot
          name="account"
          context={{ customerId: customer?.id, email: customer?.email }}
        />

        <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
          Hello, {customer?.first_name || 'there'}
        </h1>
        <p className="mt-3 text-[15px] text-foreground/65 leading-relaxed max-w-xl">
          Manage your orders, addresses, and profile settings.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/account/orders', icon: Package, title: 'Orders', body: 'View your order history', num: '01' },
            { href: '/account/addresses', icon: MapPin, title: 'Addresses', body: 'Manage shipping addresses', num: '02' },
            { href: '/account/profile', icon: User, title: 'Profile', body: 'Update your details', num: '03' },
          ].map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group rounded-md bg-muted/40 p-6 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <tile.icon className="h-6 w-6" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">{tile.num}</p>
              </div>
              <h2 className="mt-6 text-lg font-body font-bold tracking-tight">{tile.title}</h2>
              <p className="text-sm text-foreground/60 mt-1">{tile.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                View
                <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover:rotate-0" strokeWidth={1.75} />
              </span>
            </Link>
          ))}
        </div>

        {/* accountOverview slot — loyalty balance, rewards hub */}
        <ClientPluginSlot
          name="accountOverview"
          context={{ customerId: customer?.id }}
        />

        {/* Quick Account Info */}
        {customer && (
          <div className="mt-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-muted/40 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-foreground/70">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Account details
            </span>
            <div className="mt-4 rounded-md bg-muted/40 divide-y divide-black/[0.06] text-sm">
              <div className="p-5 sm:p-6">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium mt-1">{customer.first_name} {customer.last_name}</p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium mt-1">{customer.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
