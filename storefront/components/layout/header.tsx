'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, LogIn } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import CartDrawer from '@/components/cart/cart-drawer'

const PRIMARY_LINKS = [
  { label: 'Shop', href: '/products' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
] as const

const SECONDARY_LINKS = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping', href: '/shipping' },
] as const

export default function Header() {
  const { itemCount } = useCart()
  const { isLoggedIn } = useAuth()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      mobileMenuCloseRef.current?.focus()
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const handleMobileMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !mobileMenuRef.current) return
    const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  const iconButton =
    'inline-flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-full border border-foreground/15 text-foreground/85 hover:border-foreground/45 hover:text-foreground transition-colors duration-300'

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
          isScrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-black/[0.04]'
            : 'bg-background'
        }`}
      >
        <div className="container-custom">
          <div className="relative flex h-16 lg:h-20 items-center justify-between gap-3">
            {/* LEFT — mobile menu + desktop primary nav */}
            <div className="flex items-center gap-1 lg:gap-7">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center -ml-2 hover:opacity-60 transition-opacity"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.6} />
              </button>

              <nav className="hidden lg:flex items-center gap-7">
                {PRIMARY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-foreground/75 hover:text-foreground transition-colors duration-200"
                    prefetch={true}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* CENTER — wordmark logo (absolutely centered) */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center"
              prefetch={true}
              aria-label="Store — home"
            >
              <span className="font-body font-bold uppercase tracking-[0.18em] text-[15px] lg:text-lg leading-none">
                Store
              </span>
            </Link>

            {/* RIGHT — Contact link + round icon buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/contact"
                className="hidden md:inline-block text-sm font-medium text-foreground/75 hover:text-foreground transition-colors duration-200 px-2 mr-1"
                prefetch={true}
              >
                Contact
              </Link>

              <Link
                href="/search"
                className={`${iconButton} hidden sm:inline-flex`}
                aria-label="Search"
                prefetch={true}
              >
                <Search className="h-[15px] w-[15px]" strokeWidth={1.6} />
              </Link>

              <Link
                href={isLoggedIn ? '/account' : '/auth/login'}
                className={`${iconButton} hidden sm:inline-flex`}
                aria-label={isLoggedIn ? 'Account' : 'Sign in'}
                prefetch={true}
              >
                {isLoggedIn ? (
                  <User className="h-[15px] w-[15px]" strokeWidth={1.6} />
                ) : (
                  <LogIn className="h-[15px] w-[15px]" strokeWidth={1.6} />
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className={`${iconButton} relative`}
                aria-label={`Shopping bag — ${itemCount} item${itemCount === 1 ? '' : 's'}`}
              >
                <ShoppingBag className="h-[15px] w-[15px]" strokeWidth={1.6} />
                <span
                  aria-hidden
                  className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold leading-none text-background tabular-nums ring-2 ring-background"
                >
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={handleMobileMenuKeyDown}
            className="absolute inset-y-0 left-0 w-[88vw] max-w-sm bg-background animate-slide-in-right flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-body font-bold uppercase tracking-[0.18em] text-[15px] leading-none"
              >
                Store
              </Link>
              <button
                ref={mobileMenuCloseRef}
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 hover:border-foreground/45 transition-colors duration-300"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>

            <nav className="flex-1 px-5 py-6 space-y-1 overflow-y-auto">
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 font-body font-bold tracking-tight text-2xl leading-tight hover:text-foreground/60 transition-colors duration-200"
                  prefetch={true}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-5 mt-5 border-t border-black/[0.06] space-y-1">
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 text-[15px] text-foreground/75 hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
                {SECONDARY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 text-[15px] text-foreground/75 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 text-[15px] text-foreground/75 hover:text-foreground transition-colors"
                >
                  Search
                </Link>
                <Link
                  href={isLoggedIn ? '/account' : '/auth/login'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 text-[15px] text-foreground/75 hover:text-foreground transition-colors"
                >
                  {isLoggedIn ? 'Account' : 'Sign in'}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
