'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, Loader2 } from 'lucide-react'
import { getMedusaClient } from '@/lib/medusa-client'
import { toast } from 'sonner'

function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const prefillEmail = searchParams.get('email') || ''

  const [email, setEmail] = useState(prefillEmail)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await getMedusaClient().auth.resetPassword('customer', 'emailpass', {
        identifier: email,
      })
    } catch {
      // Don't reveal whether the email exists — always show success
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="container-custom py-section">
        <div className="max-w-md mx-auto">
          <div className="overflow-hidden rounded-md bg-muted/40 p-6 sm:p-10 lg:p-12 text-center">
            <Mail className="h-10 w-10 mx-auto mb-4 text-muted-foreground" strokeWidth={1.5} />
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.1] text-[clamp(1.75rem,3.4vw,2.5rem)]">
              Check your email
            </h1>
            <p className="mt-3 text-[15px] text-foreground/65 leading-relaxed">
              If an account exists for <span className="text-foreground font-medium">{email}</span>,
              you&apos;ll receive a password reset link shortly.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium underline underline-offset-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-section">
      <div className="max-w-md mx-auto">
        <div className="overflow-hidden rounded-md bg-muted/40 p-6 sm:p-10 lg:p-12">
          <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
            Reset password
          </h1>
          <p className="mt-3 text-[15px] text-foreground/65 leading-relaxed">
            Enter your email and we&apos;ll send you a reset link
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="container-custom py-section text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
