'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCheckout, CheckoutStep, ShippingAddress } from '@/hooks/use-checkout'
import { useCheckoutSettings } from '@/hooks/use-checkout-settings'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import { ShoppingBag, ChevronRight, Loader2, Check, ArrowLeft, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { PromoCodeInput } from '@/components/checkout/promo-code-input'
import { getProductImage } from '@/lib/utils/placeholder-images'
import { trackBeginCheckout } from '@/lib/analytics'
import { formatPrice } from '@/lib/utils/format-price'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'

function toCurrencyValue(amount: number | null | undefined): number | undefined {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return undefined
  return Math.round(amount * 100) / 100
}
import type { ShippingOption, CartLineItem, LineItem } from '@/types'


const steps: { key: CheckoutStep; label: string }[] = [
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
]

type InfoFormValues = {
  email: string
  first_name: string
  last_name: string
  company: string
  address_1: string
  address_2: string
  city: string
  postal_code: string
  phone: string
  country_code: string
  province: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const {
    step, setStep, cart, shippingOptions, loadingShipping,
    submitShippingStep, completeCheckout,
    isUpdating, error, clearError,
    sessions, availableProviders, loadingProviders,
  } = useCheckout()

  const { data: checkoutSettings } = useCheckoutSettings()
  const { customer, isLoggedIn, isLoading: authLoading } = useAuth()
  const {
    appliedPromoCodes, discountTotal, applyPromoCode, removePromoCode,
    isApplyingPromo, isRemovingPromo,
  } = useCart()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InfoFormValues>({
    mode: 'onTouched',
    defaultValues: {
      email: '', first_name: '', last_name: '', company: '',
      address_1: '', address_2: '', city: '', postal_code: '',
      phone: '', country_code: '', province: '',
    },
  })

  const watchedEmail = watch('email')
  const watchedAddress = watch()

  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState('')

  const hasItems = cart?.items && cart.items.length > 0
  const currency = cart?.currency_code || 'usd'

  const trackedCheckout = useRef(false)
  useEffect(() => {
    if (cart?.id && hasItems && !trackedCheckout.current) {
      trackedCheckout.current = true
      const itemCount = (cart.items || []).reduce((sum: number, item: LineItem) => sum + item.quantity, 0)
      const contentIds = (cart.items || []).map((item: LineItem) => item.variant_id).filter(Boolean)
      const contents = (cart.items || []).map((item: LineItem) => ({
        id: item.variant_id,
        quantity: item.quantity,
        item_price: toCurrencyValue(item.unit_price),
      }))

      trackBeginCheckout(cart.id, toCurrencyValue(cart.total), currency, {
        itemCount,
        contentIds,
        contents,
      })
    }
  }, [cart?.id, hasItems, cart?.total, currency, cart?.items])

  useEffect(() => {
    if (!authLoading && checkoutSettings?.require_account && !isLoggedIn) {
      toast.error('Please sign in to continue to checkout')
      router.push('/auth/login?redirect=/checkout')
    }
  }, [authLoading, checkoutSettings?.require_account, isLoggedIn, router])

  useEffect(() => {
    if (customer?.email) {
      setValue('email', customer.email, { shouldValidate: false })
    }
  }, [customer?.email, setValue])

  const countryCodeSet = useRef(false)
  useEffect(() => {
    if (countryCodeSet.current) return
    const countryCode = cart?.shipping_address?.country_code || cart?.region?.countries?.[0]?.iso_2
    if (countryCode) {
      countryCodeSet.current = true
      setValue('country_code', countryCode, { shouldValidate: false })
    }
  }, [cart?.shipping_address?.country_code, cart?.region?.countries, setValue])

  useEffect(() => {
    if (checkoutSettings?.marketing_opt_in?.enabled && checkoutSettings.marketing_opt_in.pre_checked) {
      setMarketingOptIn(true)
    }
  }, [checkoutSettings?.marketing_opt_in])

  // Submit shipping step: validates contact + address fields, then submits with selected shipping method
  const handleShippingSubmit = handleSubmit(async (data) => {
    if (!selectedShipping) {
      toast.error('Please select a shipping method')
      return
    }
    clearError()
    const shippingAddress: ShippingAddress = {
      first_name: data.first_name || '',
      last_name: data.last_name,
      address_1: data.address_1,
      address_2: data.address_2 || '',
      company: data.company || '',
      city: data.city,
      postal_code: data.postal_code,
      country_code: data.country_code || '',
      province: data.province || '',
      phone: data.phone || '',
    }
    await submitShippingStep(data.email, shippingAddress, selectedShipping)
  })

  const buildSuccessUrl = (order: { id: string }) => {
    return `/checkout/success?order=${encodeURIComponent(order.id)}`
  }

  const handlePlaceOrder = async () => {
    if (isUpdating) return // Prevent double-click
    clearError()
    const order = await completeCheckout()
    if (order) {
      toast.success('Order placed successfully!')
      router.push(buildSuccessUrl(order))
    }
  }

  const inputCls = (hasError: boolean) =>
    `w-full rounded-sm bg-white/80 border px-5 py-3 text-sm placeholder:text-muted-foreground focus:outline-none transition-colors ${
      hasError
        ? 'border-destructive focus:border-destructive'
        : 'border-black/[0.06] focus:border-foreground/30'
    }`

  return (
    <>
      {/* checkoutStart slot — invisible, fires InitiateCheckout trackers */}
      <ClientPluginSlot
        name="checkoutStart"
        context={{ cartId: cart?.id, itemCount: cart?.items?.length, total: cart?.total }}
      />

      {/* Breadcrumbs */}
      <div className="container-custom pt-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Checkout</span>
        </nav>
      </div>

      <div className="container-custom py-8 lg:py-12">
        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => {
            const isActive = s.key === step
            const isCompleted = step === 'payment' && s.key === 'shipping'
            return (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                <button
                  onClick={() => { if (isCompleted) setStep('shipping') }}
                  disabled={!isCompleted}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
                    isActive ? 'bg-foreground text-background' :
                    isCompleted ? 'bg-muted/40 text-foreground cursor-pointer hover:bg-muted/60' :
                    'bg-muted/40 text-foreground/50 cursor-default'
                  }`}
                >
                  {isCompleted && <Check className="h-3 w-3" />}
                  {s.label}
                </button>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          {/* ============ LEFT COLUMN ============ */}
          <div>
            {error && (
              <div role="alert" className="flex items-start gap-3 p-4 mb-6 border border-destructive/30 rounded-md bg-destructive/5">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Step 1: Contact + Address + Shipping Method */}
            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="space-y-8" noValidate>
                <section className="overflow-hidden rounded-md bg-muted/40 p-6">
                  <h2 className="text-2xl font-body font-bold tracking-tight leading-snug mb-6">Contact</h2>

                  <div>
                    <label className="block text-base text-muted-foreground mb-2">Email</label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={inputCls(!!errors.email)}
                    />
                    {errors.email && (
                      <p id="email-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Marketing opt-in checkbox */}
                  {checkoutSettings?.marketing_opt_in?.enabled && checkoutSettings.marketing_opt_in.where !== 'signin' && (
                    <label className="flex items-start gap-2 mt-4 cursor-pointer">
                      <input type="checkbox" checked={marketingOptIn} onChange={(e) => setMarketingOptIn(e.target.checked)} className="w-4 h-4 mt-0.5 text-foreground focus:ring-2 focus:ring-foreground rounded" />
                      <span className="text-sm text-muted-foreground">Email me with news and offers</span>
                    </label>
                  )}
                </section>

                <section className="overflow-hidden rounded-md bg-muted/40 p-6">
                  <h2 className="text-2xl font-body font-bold tracking-tight leading-snug mb-6">Shipping address</h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    {/* First Name - conditionally required */}
                    {checkoutSettings?.full_name === 'full' && (
                      <div>
                        <label className="block text-base text-muted-foreground mb-2">First name</label>
                        <input
                          type="text"
                          {...register('first_name', {
                            validate: (val) =>
                              checkoutSettings?.full_name === 'full' && !val?.trim()
                                ? 'First name is required'
                                : true,
                          })}
                          placeholder="First name"
                          autoComplete="given-name"
                          aria-invalid={!!errors.first_name}
                          aria-describedby={errors.first_name ? 'first-name-error' : undefined}
                          className={inputCls(!!errors.first_name)}
                        />
                        {errors.first_name && (
                          <p id="first-name-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.first_name.message}</p>
                        )}
                      </div>
                    )}

                    {/* Last Name - always required */}
                    <div className={checkoutSettings?.full_name === 'last_only' ? 'col-span-2' : ''}>
                      <label className="block text-base text-muted-foreground mb-2">Last name</label>
                      <input
                        type="text"
                        {...register('last_name', { required: 'Last name is required' })}
                        placeholder="Last name"
                        autoComplete="family-name"
                        aria-invalid={!!errors.last_name}
                        aria-describedby={errors.last_name ? 'last-name-error' : undefined}
                        className={inputCls(!!errors.last_name)}
                      />
                      {errors.last_name && (
                        <p id="last-name-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.last_name.message}</p>
                      )}
                    </div>

                    {/* Company Name - conditional visibility */}
                    {checkoutSettings?.company_name === 'optional' && (
                      <div className="col-span-2">
                        <label className="block text-base text-muted-foreground mb-2">Company (optional)</label>
                        <input
                          type="text"
                          {...register('company')}
                          placeholder="Company"
                          autoComplete="organization"
                          className={inputCls(false)}
                        />
                      </div>
                    )}

                    {/* Address Line 1 - always required */}
                    <div className="col-span-2">
                      <label className="block text-base text-muted-foreground mb-2">Address</label>
                      <input
                        type="text"
                        {...register('address_1', { required: 'Address is required' })}
                        placeholder="Street address"
                        autoComplete="address-line1"
                        aria-invalid={!!errors.address_1}
                        aria-describedby={errors.address_1 ? 'address-error' : undefined}
                        className={inputCls(!!errors.address_1)}
                      />
                      {errors.address_1 && (
                        <p id="address-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.address_1.message}</p>
                      )}
                    </div>

                    {/* Address Line 2 - conditional visibility and requirement */}
                    {checkoutSettings?.address_line_2 !== 'hidden' && (
                      <div className="col-span-2">
                        <label className="block text-base text-muted-foreground mb-2">
                          {checkoutSettings?.address_line_2 === 'required' ? 'Apartment, suite, etc.' : 'Apartment, suite, etc. (optional)'}
                        </label>
                        <input
                          type="text"
                          {...register('address_2', {
                            validate: (val) =>
                              checkoutSettings?.address_line_2 === 'required' && !val?.trim()
                                ? 'Apartment/suite is required'
                                : true,
                          })}
                          placeholder="Apt, suite, unit"
                          autoComplete="address-line2"
                          aria-invalid={!!errors.address_2}
                          aria-describedby={errors.address_2 ? 'address2-error' : undefined}
                          className={inputCls(!!errors.address_2)}
                        />
                        {errors.address_2 && (
                          <p id="address2-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.address_2.message}</p>
                        )}
                      </div>
                    )}

                    {/* City - always required */}
                    <div>
                      <label className="block text-base text-muted-foreground mb-2">City</label>
                      <input
                        type="text"
                        {...register('city', { required: 'City is required' })}
                        placeholder="City"
                        autoComplete="address-level2"
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? 'city-error' : undefined}
                        className={inputCls(!!errors.city)}
                      />
                      {errors.city && (
                        <p id="city-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.city.message}</p>
                      )}
                    </div>

                    {/* Postal Code - always required */}
                    <div>
                      <label className="block text-base text-muted-foreground mb-2">Postal code</label>
                      <input
                        type="text"
                        {...register('postal_code', {
                          required: 'Postal code is required',
                          pattern: {
                            value: /^[A-Za-z0-9\s-]{2,10}$/,
                            message: 'Please enter a valid postal code',
                          },
                        })}
                        placeholder="Postal code"
                        autoComplete="postal-code"
                        aria-invalid={!!errors.postal_code}
                        aria-describedby={errors.postal_code ? 'postal-error' : undefined}
                        className={inputCls(!!errors.postal_code)}
                      />
                      {errors.postal_code && (
                        <p id="postal-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.postal_code.message}</p>
                      )}
                    </div>

                    {/* State / Province — required for US/CA fulfillment.
                        Free-text so it works for any country (empty is fine
                        for non-state-based countries like UK/DE/FR). Shippo
                        normalizes "California" → "CA" at fulfillment. */}
                    <div className="col-span-2">
                      <label className="block text-base text-muted-foreground mb-2">State / Province</label>
                      <input
                        type="text"
                        {...register('province')}
                        placeholder="e.g. CA"
                        autoComplete="address-level1"
                        className={inputCls(false)}
                      />
                    </div>

                    {/* Phone - conditional requirement */}
                    <div className="col-span-2">
                      <label className="block text-base text-muted-foreground mb-2">
                        {checkoutSettings?.phone === 'required' ? 'Phone' : 'Phone (optional)'}
                      </label>
                      <input
                        type="tel"
                        {...register('phone', {
                          validate: (val) => {
                            if (checkoutSettings?.phone === 'required' && !val?.trim()) {
                              return 'Phone is required'
                            }
                            if (val?.trim() && !/^[\d\s+\-()]{6,20}$/.test(val)) {
                              return 'Please enter a valid phone number'
                            }
                            return true
                          },
                        })}
                        placeholder="Phone"
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className={inputCls(!!errors.phone)}
                      />
                      {errors.phone && (
                        <p id="phone-error" role="alert" className="mt-1.5 text-xs text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Hidden country code field */}
                    <input type="hidden" {...register('country_code')} />
                  </div>
                </section>

                <section className="overflow-hidden rounded-md bg-muted/40 p-6">
                  <h2 className="text-2xl font-body font-bold tracking-tight leading-snug mb-6">Shipping method</h2>
                  {loadingShipping ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : shippingOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No shipping options available for this address.</p>
                  ) : (
                    <div className="space-y-2">
                      {shippingOptions.map((option: ShippingOption) => {
                        const price = option.amount != null ? option.amount : option.prices?.[0]?.amount
                        const priceLabel = price === 0 ? 'Free' : price != null ? formatPrice(price, currency) : '—'

                        return (
                          <label
                            key={option.id}
                            className={`flex items-center justify-between p-4 rounded-md bg-white/80 border cursor-pointer transition-colors ${
                              selectedShipping === option.id ? 'border-foreground' : 'border-black/[0.06] hover:border-foreground/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shipping"
                                value={option.id}
                                checked={selectedShipping === option.id}
                                onChange={() => setSelectedShipping(option.id)}
                                className="accent-foreground"
                              />
                              <div>
                                <p className="text-sm font-medium">{option.name}</p>
                                {option.type?.description && (
                                  <p className="text-xs text-muted-foreground">{option.type.description}</p>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-medium">{priceLabel}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </section>

                <button
                  type="submit"
                  disabled={isUpdating || !hasItems || Object.keys(errors).length > 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Continue to payment
                </button>
              </form>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <div className="space-y-6">
                <div className="rounded-md bg-muted/40 p-5 sm:p-6 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact</span>
                    <span>{watchedEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ship to</span>
                    <span>{watchedAddress.address_1}, {watchedAddress.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span>{shippingOptions.find((o: ShippingOption) => o.id === selectedShipping)?.name || 'Selected'}</span>
                  </div>
                </div>

                <section className="overflow-hidden rounded-md bg-muted/40 p-6">
                  <h2 className="text-2xl font-body font-bold tracking-tight leading-snug mb-6">Payment</h2>

                  {(() => {
                    // Demo fallback (no real provider connected for this region)
                    if (!loadingProviders && availableProviders.length === 0) {
                      return (
                        <div className="rounded-md bg-white/80 border border-black/[0.06] p-6">
                          <p className="text-sm text-muted-foreground">
                            This is a demo store. Orders are placed using the system payment provider — no real payment is processed.
                          </p>
                        </div>
                      )
                    }

                    if (!cart) {
                      return (
                        <div className="rounded-md bg-white/80 border border-black/[0.06] p-6 flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          <span className="ml-2 text-sm text-muted-foreground">Initializing payment...</span>
                        </div>
                      )
                    }

                    // Shopify-style stacked layout: express options on top
                    // (PayPal Smart Buttons, future Apple/Google Pay), divider,
                    // form below (Stripe Payment Element with its own
                    // Card/Bank/Cash App tabs). Each adapter receives its own
                    // session.data — useCheckout initialized them in parallel.
                    const expressProviders = availableProviders.filter((p) => p.kind === 'express')
                    const formProviders = availableProviders.filter((p) => p.kind !== 'express')

                    const renderAdapter = (provider: typeof availableProviders[number]) => {
                      const Adapter = provider.Component
                      return (
                        <Adapter
                          key={provider.id}
                          cart={cart}
                          sessionData={sessions[provider.id] ?? null}
                          isCompleting={isUpdating}
                          onApproved={async () => {
                            const order = await completeCheckout()
                            if (order) {
                              toast.success('Order placed successfully!')
                              router.push(buildSuccessUrl(order))
                            }
                          }}
                          onError={(msg) => { clearError(); toast.error(msg) }}
                        />
                      )
                    }

                    return (
                      <div className="space-y-4">
                        {expressProviders.length > 0 && (
                          <div className="space-y-3">
                            {expressProviders.map(renderAdapter)}
                          </div>
                        )}

                        {expressProviders.length > 0 && formProviders.length > 0 && (
                          <div className="flex items-center gap-3 my-2">
                            <div className="flex-1 border-t border-black/[0.08]" />
                            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                              or pay with card
                            </span>
                            <div className="flex-1 border-t border-black/[0.08]" />
                          </div>
                        )}

                        {formProviders.length > 0 && (
                          <div className="space-y-3">
                            {formProviders.map(renderAdapter)}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </section>

                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => setStep('shipping')} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  {availableProviders.length === 0 && (
                    <button onClick={handlePlaceOrder} disabled={isUpdating} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Place order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ============ RIGHT COLUMN: Order Summary + Shipping Methods ============ */}
          <div>
            <div className="sticky top-24 space-y-6">
              {/* Order Summary */}
              <div className="overflow-hidden rounded-md bg-muted/40 p-6 sm:p-8">
                <h2 className="text-2xl font-body font-bold tracking-tight leading-snug mb-6">Order summary</h2>
                {!hasItems ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
                    <p className="mt-3 text-sm text-muted-foreground">Your bag is empty</p>
                    <Link href="/products" className="mt-3 inline-block text-sm font-medium underline underline-offset-4">Continue shopping</Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart?.items?.map((item: CartLineItem) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-muted rounded-md">
                            <Image src={getProductImage(item.thumbnail, item.product_id || item.id)} alt={item.title} fill className="object-cover" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">{item.quantity}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.title}</p>
                            {item.variant?.title && item.variant.title !== 'Default' && (
                              <p className="text-xs text-muted-foreground">{item.variant.title}</p>
                            )}
                          </div>
                          <p className="text-sm font-medium">{formatPrice(item.unit_price, currency)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-black/[0.06] pt-4">
                      <PromoCodeInput
                        appliedPromoCodes={appliedPromoCodes}
                        discountTotal={discountTotal}
                        currencyCode={currency}
                        isApplyingPromo={isApplyingPromo}
                        isRemovingPromo={isRemovingPromo}
                        onApply={applyPromoCode}
                        onRemove={removePromoCode}
                      />
                    </div>

                    <div className="space-y-2 text-sm border-t border-black/[0.06] pt-4 mt-4">
                      {(() => {
                        const isTaxInclusive = cart?.items?.some((item: CartLineItem) => item.is_tax_inclusive)
                        const checkoutSubtotal = isTaxInclusive
                          ? (cart?.original_item_total ?? 0)
                          : (cart?.original_item_subtotal ?? cart?.subtotal ?? 0)
                        return (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>{formatPrice(checkoutSubtotal, currency)}</span>
                            </div>
                            {discountTotal > 0 && (
                              <div className="flex justify-between text-green-700 dark:text-green-500">
                                <span className="text-muted-foreground">Discount</span>
                                <span>-{formatPrice(discountTotal, currency)}</span>
                              </div>
                            )}
                            {cart?.shipping_total != null && cart.shipping_total > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{formatPrice(cart.shipping_total, currency)}</span>
                              </div>
                            )}
                            {cart?.tax_total != null && cart.tax_total > 0 && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {isTaxInclusive ? 'Includes tax' : 'Tax'}
                                </span>
                                <span>{isTaxInclusive ? '' : '+'}{formatPrice(cart.tax_total, currency)}</span>
                              </div>
                            )}
                          </>
                        )
                      })()}
                      <div className="flex justify-between border-t border-black/[0.06] pt-2 mt-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-body text-lg font-bold">{formatPrice(cart?.total || 0, currency)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* checkoutOrderSummary slot — loyalty redemption, upsells */}
              <ClientPluginSlot
                name="checkoutOrderSummary"
                context={{ cartId: cart?.id, total: cart?.total }}
              />

            </div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="mt-12 pt-8 border-t border-black/[0.06] text-center">
          <p className="text-xs text-muted-foreground">
            By completing your order, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </>
  )
}
