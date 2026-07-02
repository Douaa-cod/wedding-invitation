import { cn } from '@/lib/cn'

export interface MonogramProps {
  variant?: 'horizontal' | 'stacked' | 'with-names' | 'circled'
  /** Taille de base des lettres en px (ignoré pour `circled`, qui utilise `size` comme diamètre). */
  size?: number
  reverse?: boolean
  brideName?: string
  groomName?: string
  className?: string
}

/**
 * La signature R&D — Brand Book sections 06 "Logo R&D" et 07 "Monogramme".
 * Construction : le cercle est l'unité de base, l'esperluette (toujours en accent)
 * sépare et relie les deux initiales — l'union, jamais l'addition.
 */
export function Monogram({
  variant = 'horizontal',
  size = 64,
  reverse = false,
  brideName = 'Douaa',
  groomName = 'Rachid',
  className,
}: MonogramProps) {
  const letterColor = reverse ? 'text-reverse-text' : 'text-ink'
  const ampersandColor = reverse ? 'text-reverse-accent' : 'text-accent'
  const ampersandSize = Math.round(size * 0.65)

  if (variant === 'circled') {
    return (
      <div
        className={cn('relative flex items-center justify-center rounded-full border border-accent', className)}
        style={{ width: size, height: size }}
      >
        <div className="absolute rounded-full border border-accent/40" style={{ inset: size * 0.045 }} />
        <span className="absolute left-1/2 top-0 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
        <span className="absolute bottom-0 left-1/2 h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 rotate-45 bg-accent" />
        <span className="flex items-center gap-1 leading-[0.8]" style={{ fontSize: size * 0.34 }}>
          <span className={cn('font-accent font-light', letterColor)}>R</span>
          <span className={cn('font-accent font-light', ampersandColor)} style={{ fontSize: size * 0.22 }}>
            &amp;
          </span>
          <span className={cn('font-accent font-light', letterColor)}>D</span>
        </span>
      </div>
    )
  }

  if (variant === 'stacked') {
    return (
      <div className={cn('flex flex-col items-center leading-[0.78]', className)}>
        <span className={cn('font-accent font-light', letterColor)} style={{ fontSize: size }}>
          R
        </span>
        <span className={cn('font-accent font-light', ampersandColor)} style={{ fontSize: ampersandSize }}>
          &amp;
        </span>
        <span className={cn('font-accent font-light', letterColor)} style={{ fontSize: size }}>
          D
        </span>
      </div>
    )
  }

  const horizontalMark = (
    <span className="flex items-center gap-1.5 leading-[0.8]">
      <span className={cn('font-accent font-light', letterColor)} style={{ fontSize: size }}>
        R
      </span>
      <span className={cn('-translate-y-0.5 font-accent font-light', ampersandColor)} style={{ fontSize: ampersandSize }}>
        &amp;
      </span>
      <span className={cn('font-accent font-light', letterColor)} style={{ fontSize: size }}>
        D
      </span>
    </span>
  )

  if (variant === 'with-names') {
    return (
      <div className={cn('flex flex-col items-center gap-3.5', className)}>
        {horizontalMark}
        <span className="h-px w-[50px] bg-divider" />
        <span className={cn('font-display text-lg tracking-wide', reverse ? 'text-reverse-text' : 'text-ink-700')}>
          {brideName} &amp; {groomName}
        </span>
      </div>
    )
  }

  return <div className={className}>{horizontalMark}</div>
}
