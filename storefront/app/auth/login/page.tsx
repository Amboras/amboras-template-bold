'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function LoginForm() {
  const searchParams = useSearchParams()
  const prefillEmail = searchParams.get('email') || ''
  const redirectTo = searchParams.get('redirect') || '/account'

  const [email, setEmail] = useState(prefillEmail)
  const [password, setPassword] = useState('')
  const { login, isLoggingIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login({ email, password })
      toast.success('Welcome back!')
      router.push(redirectTo)
    } catch (error: any) {
      toast.error(error?.message || 'Invalid email or password')
    }
  }

  return (
    <div className="container-custom py-section">
      <div className="max-w-md mx-auto">
        <div className="overflow-hidden rounded-md bg-muted/40 p-6 sm:p-10 lg:p-12">
          <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2rem,4vw,3.25rem)]">
            Welcome back
          </h1>
          <p className="mt-3 text-[15px] text-foreground/65 leading-relaxed">
            Sign in to your account
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

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-full bg-white/80 border border-black/[0.06] px-5 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none transition-colors"
                placeholder="Your password"
              />
            </div>

            <div className="flex justify-between items-center">
              {prefillEmail && (
                <Link
                  href={`/auth/forgot-password?email=${encodeURIComponent(prefillEmail)}`}
                  className="text-xs font-medium text-foreground underline underline-offset-4"
                >
                  First time? Set your password
                </Link>
              )}
              <Link
                href={`/auth/forgot-password${prefillEmail ? `?email=${encodeURIComponent(prefillEmail)}` : ''}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-medium text-foreground underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-custom py-section text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
