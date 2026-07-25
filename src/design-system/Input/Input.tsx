import { type InputHTMLAttributes, useId, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  /** Message d'erreur accessible — affiché sous le champ, `role="alert"`, lié via `aria-describedby`. */
  error?: string
}

/** Brand Book section 14 "Champs de formulaire" — label tracké au-dessus, bordure fine. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className, error, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="font-sans text-label-xs uppercase tracking-wide text-ink-300"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'rounded-md border border-border-input bg-white px-[14px] py-[13px] font-body text-sm text-ink transition-shadow duration-200 placeholder:font-body placeholder:italic placeholder:text-ink-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(194,168,120,0.18)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-bordeaux',
            error && 'border-bordeaux focus:border-bordeaux',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="font-sans text-label-xs text-bordeaux">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
