import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface PremiumCardProps extends HTMLAttributes<HTMLDivElement> {
  reverse?: boolean
}

/** Brand Book section 14 "Conteneurs" — coin doux 10px, bordure bronze fine, ombre chaude. */
export function PremiumCard({ reverse = false, className, ...props }: PremiumCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border shadow-soft',
        reverse
          ? 'border-soft-sand/20 bg-reverse-bg text-reverse-text'
          : 'border-accent/[0.22] bg-card text-ink',
        className,
      )}
      {...props}
    />
  )
}
