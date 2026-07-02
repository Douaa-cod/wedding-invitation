import { type TextareaHTMLAttributes, useId, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

/** Brand Book section 14 — même habillage que Input, hauteur dépliée. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, className, rows = 3, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={textareaId}
          className="font-sans text-label-2xs uppercase tracking-wide text-text-subtle"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'resize-none rounded-md border border-border-input bg-white px-[14px] py-[13px] font-body text-sm text-ink placeholder:font-body placeholder:italic placeholder:text-text-subtle focus:border-accent focus:outline-none',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
