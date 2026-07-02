import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type EyebrowProps = HTMLAttributes<HTMLDivElement>

/** Petit label tracké au-dessus des titres (ex. "LE CONCEPT", "LE LIEU"). */
export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <div
      className={cn(
        'font-sans text-label-sm uppercase tracking-ultrawide text-accent',
        className,
      )}
      {...props}
    />
  )
}
