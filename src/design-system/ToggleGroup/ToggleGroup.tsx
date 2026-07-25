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
  /**
   * 'solid' (défaut, inchangé) → pill bronze plein sur l'option active,
   * Brand Book section 14. 'soft' → bordure dorée fine + fond champagne très
   * doux sur l'option active (jamais de pastille brune massive) : utilisé
   * par le RSVP, jamais par défaut ailleurs.
   */
  variant?: 'solid' | 'soft'
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

/** Brand Book section 14 "Choix Oui / Non" — rangée de pills exclusives. */
export function ToggleGroup({ options, value, onChange, name, className, variant = 'solid' }: ToggleGroupProps) {
  return (
    <div role="radiogroup" aria-label={name} className={cn('flex max-w-[240px] gap-[10px]', className)}>
      {options.map((option) => {
        const active = option.value === value
        const soft = variant === 'soft'
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex min-h-(--size-tap-min) flex-1 items-center justify-center gap-1.5 text-center font-sans text-label-sm uppercase tracking-label transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux',
              soft
                ? cn(
                    'rounded-full border px-3.5 py-3.5',
                    active
                      ? 'border-accent-strong text-ink-900'
                      : 'border-accent-strong/35 bg-accent/5 text-accent-strong hover:bg-accent/10',
                  )
                : cn(
                    'rounded-md border px-3.5 py-3.5',
                    active
                      ? 'border-accent-strong bg-accent-strong text-warm-white'
                      : 'border-border-input text-text-subtle',
                  ),
            )}
            style={soft && active ? { background: 'color-mix(in srgb, var(--color-gold) 22%, var(--color-warm-white))' } : undefined}
          >
            {soft && active && <CheckIcon />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
