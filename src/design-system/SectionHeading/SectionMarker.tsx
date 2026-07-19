import { cn } from '@/lib/cn'

export interface SectionMarkerProps {
  index: string
  label: string
  className?: string
}

/** Le repère "00 ── LABEL" répété en en-tête de chaque section du Brand Book. */
export function SectionMarker({ index, label, className }: SectionMarkerProps) {
  return (
    <div className={cn('flex items-baseline gap-5', className)}>
      <span className="font-sans text-label font-light tracking-widest text-accent">
        {index}
      </span>
      <span className="h-px flex-1 bg-border" />
      <span className="font-sans text-label font-light tracking-widest text-text-subtle">
        {label}
      </span>
    </div>
  )
}
