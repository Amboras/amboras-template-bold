'use client'

import { useState } from 'react'
import { X, Loader2, Tag, ChevronDown } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format-price'

interface PromoCodeInputProps {
  appliedPromoCodes: string[]
  discountTotal: number
  currencyCode: string
  isApplyingPromo: boolean
  isRemovingPromo: boolean
  onApply: (code: string) => Promise<void>
  onRemove: (code: string) => Promise<void>
}

export function PromoCodeInput({
  appliedPromoCodes,
  discountTotal,
  currencyCode,
  isApplyingPromo,
  isRemovingPromo,
  onApply,
  onRemove,
}: PromoCodeInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [removingCode, setRemovingCode] = useState<string | null>(null)

  const handleApply = async () => {
    const code = inputValue.trim().toUpperCase()
    if (!code) return

    if (appliedPromoCodes.includes(code)) {
      setError('This code is already applied.')
      return
    }

    setError(null)
    try {
      await onApply(code)
      setInputValue('')
    } catch (err: any) {
      const msg: string = err?.message || ''
      if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('invalid')) {
        setError('This promo code is not valid.')
      } else if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('ended')) {
        setError('This promo code has expired.')
      } else if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('budget')) {
        setError('This promo code is no longer available.')
      } else {
        setError('Could not apply this code. Please try again.')
      }
    }
  }

  const handleRemove = async (code: string) => {
    setRemovingCode(code)
    try {
      await onRemove(code)
    } finally {
      setRemovingCode(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  return (
    <div className="space-y-2">
      {/* Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Tag className="h-3.5 w-3.5" />
        <span>Promo code</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Input area */}
      {isOpen && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError(null) }}
              onKeyDown={handleKeyDown}
              placeholder="Enter code"
              className="flex-1 border-b border-foreground/20 bg-transparent px-0 py-2 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors uppercase"
              disabled={isApplyingPromo}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplyingPromo || !inputValue.trim()}
              className="text-sm font-semibold uppercase tracking-wide px-3 py-2 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5"
            >
              {isApplyingPromo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Apply
            </button>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>
      )}

      {/* Applied codes */}
      {appliedPromoCodes.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {appliedPromoCodes.map((code) => (
            <div
              key={code}
              className="flex items-center gap-1.5 text-xs font-medium bg-muted px-2.5 py-1.5 rounded-sm border border-border"
            >
              <Tag className="h-3 w-3 text-muted-foreground" />
              <span>{code}</span>
              <button
                type="button"
                onClick={() => handleRemove(code)}
                disabled={isRemovingPromo && removingCode === code}
                className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                aria-label={`Remove ${code}`}
              >
                {isRemovingPromo && removingCode === code
                  ? <Loader2 className="h-3 w-3 animate-spin" />
                  : <X className="h-3 w-3" />
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
