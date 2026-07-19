import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface TagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

/** Brand Book section 14 "Étiquettes / tags" — pill filtrable, actif = bronze plein. */
export function Tag({ active = false, className, ...props }: TagProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'min-h-(--size-tap-min) rounded-full border px-4 py-3.75 font-sans text-label-sm uppercase tracking-label transition-colors duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux',
        active
          ? 'border-accent-strong bg-accent-strong text-warm-white'
          : 'border-border-input text-text',
        className,
      )}
      {...props}
    />
  )
}
