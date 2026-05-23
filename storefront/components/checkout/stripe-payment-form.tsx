'use client'

import { useState, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Loader2 } from 'lucide-react'

interface StripePaymentFormProps {
  clientSecret: string
  stripeAccountId: string
  publishableKey: string
  onPaymentSuccess: () => void
  onError: (message: string) => void
  isCompletingOrder?: boolean
}

function CheckoutForm({
  onPaymentSuccess,
  onError,
  isCompletingOrder,
}: Pick<StripePaymentFormProps, 'onPaymentSuccess' | 'onError' | 'isCompletingOrder'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  // Whether the buyer's device/browser offers any one-tap wallet (Apple Pay /
  // Google Pay / Link). Stays false until the Express Checkout Element reports
  // it has methods to show — on unsupported contexts (e.g. http localhost) it
  // never flips, so the express row + divider stay hidden.
  const [expressAvailable, setExpressAvailable] = useState(false)

  // Wallet buttons and the card form confirm the SAME PaymentIntent (its
  // clientSecret lives on the parent <Elements>), so the backend path is
  // identical — only the buyer's input method differs.
  const runConfirm = async () => {
    if (!stripe || !elements) return
    setIsProcessing(true)
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })
      if (error) {
        onError(error.message || 'Payment failed. Please try again.')
      } else {
        onPaymentSuccess()
      }
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await runConfirm()
  }

  const busy = isProcessing || isCompletingOrder

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* One-tap wallets (Apple Pay / Google Pay / Link). Self-hides when the
          device/browser has none — and only renders over HTTPS, so it stays
          invisible on http localhost. Confirms the same PaymentIntent. */}
      <ExpressCheckoutElement
        onReady={(event) => setExpressAvailable(Boolean(event.availablePaymentMethods))}
        onConfirm={runConfirm}
      />
      {expressAvailable && (
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px flex-1 bg-black/[0.08]" />
          Or pay with card
          <span className="h-px flex-1 bg-black/[0.08]" />
        </div>
      )}

      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      <button
        type="submit"
        disabled={!stripe || !elements || busy}
        className="w-full bg-foreground text-background py-3.5 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isCompletingOrder ? 'Completing Order...' : isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  )
}

export function StripePaymentForm({
  clientSecret,
  stripeAccountId,
  publishableKey,
  onPaymentSuccess,
  onError,
  isCompletingOrder,
}: StripePaymentFormProps) {
  const stripePromise = useMemo(
    () => loadStripe(publishableKey, { stripeAccount: stripeAccountId }),
    [publishableKey, stripeAccountId],
  )

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            borderRadius: '2px',
            fontFamily: 'inherit',
          },
        },
      }}
    >
      <CheckoutForm
        onPaymentSuccess={onPaymentSuccess}
        onError={onError}
        isCompletingOrder={isCompletingOrder}
      />
    </Elements>
  )
}
