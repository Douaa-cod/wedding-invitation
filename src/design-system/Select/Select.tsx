import { type SelectHTMLAttributes, useId, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

/** Brand Book section 14 — select natif stylé, chevron discret à droite. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, className, children, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={selectId}
          className="font-sans text-label-2xs uppercase tracking-wide text-text-subtle"
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-md border border-border-input bg-white px-[14px] py-[13px] pr-9 font-body text-sm text-ink focus:border-accent focus:outline-none',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-text-subtle"
          >
            ⌄
          </span>
        </div>
      </div>
    )
  },
)

Select.displayName = 'Select'
