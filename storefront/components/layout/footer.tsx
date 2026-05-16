'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { clearConsent } from '@/lib/cookie-consent'
import { usePolicies } from '@/hooks/use-policies'

const footerLinks = {
  shop: [
    { label: 'All products', href: '/products' },
    { label: 'New arrivals', href: '/products?sort=newest' },
    { label: 'Collections', href: '/collections' },
    { label: 'Search', href: '/search' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping & returns', href: '/shipping' },
    { label: 'Contact us', href: '/contact' },
    { label: 'My account', href: '/account' },
  ],
}

export default function Footer() {
  const { policies } = usePolicies()

  const companyLinks: { label: string; href: string }[] = [
    { label: 'About', href: '/about' },
  ]

  if (policies?.privacy_policy) companyLinks.push({ label: 'Privacy policy', href: '/privacy' })
  if (policies?.terms_of_service) companyLinks.push({ label: 'Terms of service', href: '/terms' })
  if (policies?.refund_policy) companyLinks.push({ label: 'Refund policy', href: '/refund-policy' })
  if (policies?.cookie_policy) companyLinks.push({ label: 'Cookie policy', href: '/cookie-policy' })

  const columnLabel =
    'text-[11px] uppercase tracking-[0.2em] font-medium text-foreground/45'
  const columnLink =
    'text-[14px] text-foreground/70 hover:text-foreground transition-colors duration-300'

  return (
    <footer className="bg-background border-t border-black/[0.06]">
      <div className="container-custom pt-12 pb-8 sm:pt-14 sm:pb-10 lg:pt-20 lg:pb-12">
        {/* Top — editorial split: brand on left, link columns on right */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand mark + tagline + CTA */}
          <div className="lg:col-span-6 space-y-5">
            <Link href="/" className="inline-block" prefetch={true}>
              <span className="font-body font-bold tracking-tight leading-[0.95] block text-[clamp(2.75rem,7vw,5.5rem)]">
                Store<span className="text-foreground/55">.</span>
              </span>
            </Link>
            <p className="text-base lg:text-[17px] text-foreground/60 leading-relaxed max-w-md">
              Curated pieces, crafted with care. Quality you can feel, design you can see.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-5 pr-1.5 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:pl-6 active:scale-[0.98]"
                prefetch={true}
              >
                <span>Get in touch</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                  <ArrowRight
                    className="h-3.5 w-3.5 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-0"
                    strokeWidth={1.75}
                  />
                </span>
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 lg:pt-3">
            <div>
              <p className={columnLabel}>Shop</p>
              <ul className="mt-5 space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={columnLink} prefetch={true}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className={columnLabel}>Help</p>
              <ul className="mt-5 space-y-3">
                {footerLinks.help.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={columnLink} prefetch={true}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className={columnLabel}>Company</p>
              <ul className="mt-5 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={columnLink} prefetch={true}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-14 lg:mt-20 pt-5 sm:pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-foreground/50">
            &copy; {new Date().getFullYear()} Store. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              onClick={() => {
                clearConsent()
                window.dispatchEvent(new Event('manage-cookies'))
              }}
              className="text-xs text-foreground/50 hover:text-foreground transition-colors duration-300"
            >
              Manage cookies
            </button>
            <span className="text-xs text-foreground/50">Powered by Amboras</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
