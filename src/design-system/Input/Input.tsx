import { type InputHTMLAttributes, useId, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

/** Brand Book section 14 "Champs de formulaire" — label tracké au-dessus, bordure fine. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="font-sans text-label-xs uppercase tracking-wide text-text-subtle"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'rounded-md border border-border-input bg-white px-[14px] py-[13px] font-body text-sm text-ink placeholder:font-body placeholder:italic placeholder:text-text-subtle focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-bordeaux',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)

Input.displayName = 'Input'
