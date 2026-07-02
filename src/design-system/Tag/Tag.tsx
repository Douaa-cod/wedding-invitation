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
        'rounded-full border px-[14px] py-2 font-sans text-label-sm uppercase tracking-label transition-colors duration-300 ease-out',
        active
          ? 'border-accent bg-accent text-warm-white'
          : 'border-border-input text-text',
        className,
      )}
      {...props}
    />
  )
}
