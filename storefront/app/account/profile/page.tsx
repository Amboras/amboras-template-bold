'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getMedusaClient } from '@/lib/medusa-client'
import { useQueryClient } from '@tanstack/react-query'
import AccountLayout from '@/components/account/account-layout'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { customer } = useAuth()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })

  useEffect(() => {
    if (customer) {
      setForm({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        phone: customer.phone || '',
      })
    }
  }, [customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { customer: updated } = await getMedusaClient().store.customer.update({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || undefined,
      })
      queryClient.setQueryData(['customer'], updated)
      toast.success('Profile updated')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AccountLayout>
      <div>
        <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
          Profile
        </h1>

        <div className="mt-8 max-w-xl overflow-hidden rounded-md bg-muted/40 p-6 sm:p-10 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={customer?.email || ''}
                disabled
                className="w-full rounded-full bg-muted/40 border border-black/[0.06] px-5 py-3 text-sm text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1.5">Email cannot be changed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-2">
                  First name
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="Optional"
                className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </button>
          </form>
        </div>
      </div>
    </AccountLayout>
  )
}
