import { cn } from '@/lib/cn'

export interface DividerProps {
  variant?: 'fade' | 'accent' | 'diamond'
  className?: string
}

/**
 * Trois filets du Brand Book :
 *   fade    → ligne dégradée transparent→couleur→transparent (séparateurs de section)
 *   accent  → trait plein court sous les titres (44–50px)
 *   diamond → ligne + losange pivoté 45° + ligne (footer, repères de carte)
 */
export function Divider({ variant = 'fade', className }: DividerProps) {
  if (variant === 'accent') {
    return <div className={cn('h-px w-11 bg-divider', className)} />
  }

  if (variant === 'diamond') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <span className="h-px flex-1 bg-border" />
        <span className="h-[5px] w-[5px] rotate-45 bg-divider" />
        <span className="h-px flex-1 bg-border" />
      </div>
    )
  }

  return (
    <div
      className={cn('h-px w-full', className)}
      style={{
        background:
          'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-accent) 32%, transparent) 22%, color-mix(in srgb, var(--color-accent) 42%, transparent) 50%, color-mix(in srgb, var(--color-accent) 32%, transparent) 78%, transparent)',
      }}
    />
  )
}
