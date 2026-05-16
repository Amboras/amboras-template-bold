'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, Menu, X, LogIn } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import CartDrawer from '@/components/cart/cart-drawer'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Support', href: '/contact' },
  { label: 'Blog', href: '/faq' },
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

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
          isScrolled ? 'bg-background/85 backdrop-blur-md' : 'bg-background'
        }`}
      >
        <div className="container-custom">
          <div className="relative flex h-16 lg:h-20 items-center justify-between gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 lg:hidden hover:opacity-60 transition-opacity"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center" prefetch={true}>
              <span className="font-heading text-xl lg:text-2xl font-medium tracking-tight">
                Store
              </span>
            </Link>

            {/* Centered nav — absolute so logo + actions don't shift the center */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-9">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/65 hover:text-foreground transition-colors duration-200"
                  prefetch={true}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-0.5">
              <Link
                href="/search"
                className="p-2.5 hover:opacity-60 transition-opacity"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>
              <Link
                href={isLoggedIn ? '/account' : '/auth/login'}
                className="p-2.5 hover:opacity-60 transition-opacity hidden sm:block"
                aria-label={isLoggedIn ? 'Account' : 'Sign in'}
              >
                {isLoggedIn ? (
                  <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
                ) : (
                  <LogIn className="h-[18px] w-[18px]" strokeWidth={1.5} />
                )}
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 hover:opacity-60 transition-opacity"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={handleMobileMenuKeyDown}
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-background animate-slide-in-right"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-heading text-xl font-semibold">Menu</span>
              <button
                ref={mobileMenuCloseRef}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:opacity-70"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-lg tracking-wide border-b border-border/50"
                  prefetch={true}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-1">
                <Link
                  href={isLoggedIn ? '/account' : '/auth/login'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-muted-foreground"
                >
                  {isLoggedIn ? 'Account' : 'Sign In'}
                </Link>
                <Link
                  href="/search"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-muted-foreground"
                >
                  Search
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
