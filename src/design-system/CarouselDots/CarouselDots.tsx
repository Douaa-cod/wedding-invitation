import { cn } from '@/lib/cn'

export interface CarouselDotsProps {
  count: number
  activeIndex: number
  onSelect?: (index: number) => void
  className?: string
}

/** Brand Book section 14 "Pagination du carousel" — pill active 22×5, dots inactifs 5×5. */
export function CarouselDots({ count, activeIndex, onSelect, className }: CarouselDotsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} role="tablist">
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Carte ${index + 1} sur ${count}`}
            onClick={() => onSelect?.(index)}
            className={cn(
              'h-[5px] rounded-full transition-all duration-300 ease-out',
              active ? 'w-[22px] bg-accent' : 'w-[5px] bg-soft-sand',
            )}
          />
        )
      })}
    </div>
  )
}
