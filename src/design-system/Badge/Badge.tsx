import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type BadgeProps = HTMLAttributes<HTMLSpanElement>

/** Brand Book section 14 — badge pill avec losange, ex. la date "14 · 11 · 2026". */
export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 font-sans text-label-xs uppercase tracking-wide text-text',
        className,
      )}
      {...props}
    >
      <span className="h-[5px] w-[5px] rotate-45 bg-accent" />
      {children}
    </span>
  )
}
