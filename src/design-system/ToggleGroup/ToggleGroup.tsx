import { cn } from '@/lib/cn'

export interface ToggleOption {
  value: string
  label: string
}

export interface ToggleGroupProps {
  options: ToggleOption[]
  value: string
  onChange: (value: string) => void
  name: string
  className?: string
}

/** Brand Book section 14 "Choix Oui / Non" — rangée de pills exclusives. */
export function ToggleGroup({ options, value, onChange, name, className }: ToggleGroupProps) {
  return (
    <div role="radiogroup" aria-label={name} className={cn('flex max-w-[240px] gap-[10px]', className)}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 rounded-md border px-[11px] py-[11px] text-center font-sans text-label-sm uppercase tracking-label transition-colors duration-300 ease-out',
              active
                ? 'border-accent bg-accent text-warm-white'
                : 'border-border-input text-text-subtle',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
