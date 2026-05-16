'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMedusaClient } from '@/lib/medusa-client'
import AccountLayout from '@/components/account/account-layout'
import { MapPin, Plus, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AddressesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    postal_code: '',
    country_code: 'us',
    phone: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await getMedusaClient().store.customer.listAddress({ limit: 50 })
      return response.addresses
    },
    retry: false,
  })

  const createAddress = useMutation({
    mutationFn: async () => {
      return getMedusaClient().store.customer.createAddress(form)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setShowForm(false)
      setForm({ first_name: '', last_name: '', address_1: '', city: '', postal_code: '', country_code: 'us', phone: '' })
      toast.success('Address added')
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to add address'),
  })

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      return getMedusaClient().store.customer.deleteAddress(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Address removed')
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to remove address'),
  })

  const addresses = data || []

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AccountLayout>
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
              Addresses
            </h1>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-foreground/20 hover:border-foreground px-5 py-2.5 text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add address
            </button>
          )}
        </div>

        {/* Add Address Form */}
        {showForm && (
          <div className="overflow-hidden rounded-md bg-muted/40 p-6 sm:p-10 lg:p-12 mb-6">
            <h2 className="text-2xl font-body font-bold tracking-tight leading-snug mb-6">New address</h2>
            <form
              onSubmit={(e) => { e.preventDefault(); createAddress.mutate() }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">First name</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                    placeholder="First name"
                    required
                    className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Last name</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => updateField('last_name', e.target.value)}
                    placeholder="Last name"
                    required
                    className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Address</label>
                <input
                  type="text"
                  value={form.address_1}
                  onChange={(e) => updateField('address_1', e.target.value)}
                  placeholder="Street address"
                  required
                  className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="City"
                    required
                    className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Postal code</label>
                  <input
                    type="text"
                    value={form.postal_code}
                    onChange={(e) => updateField('postal_code', e.target.value)}
                    placeholder="Postal code"
                    required
                    className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={createAddress.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {createAddress.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex items-center justify-center rounded-full border border-foreground/20 hover:border-foreground px-6 py-3 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="rounded-md border border-dashed border-black/[0.08] p-12 text-center">
            <MapPin className="h-8 w-8 mx-auto text-muted-foreground/40" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-muted-foreground">No saved addresses</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-sm font-medium underline underline-offset-4"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr: any) => (
              <div key={addr.id} className="relative group rounded-md bg-muted/40 p-5 sm:p-6">
                <p className="text-sm font-medium">{addr.first_name} {addr.last_name}</p>
                <p className="text-sm text-foreground/60 mt-1">{addr.address_1}</p>
                <p className="text-sm text-foreground/60">
                  {addr.city}{addr.postal_code ? `, ${addr.postal_code}` : ''}
                </p>
                <p className="text-sm text-foreground/60 uppercase">{addr.country_code}</p>
                {addr.phone && <p className="text-sm text-foreground/60 mt-1">{addr.phone}</p>}
                <button
                  onClick={() => deleteAddress.mutate(addr.id)}
                  className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete address"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
