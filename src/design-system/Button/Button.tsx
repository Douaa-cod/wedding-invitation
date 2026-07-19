import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

/**
 * Brand Book section 14 "Composants UI — Boutons" :
 *   primary   → pill bronze plein
 *   secondary → pill outline bronze
 *   text      → lien texte avec flèche
 *   reverse   → pill deep-sea plein (contextes sombres)
 */
const buttonVariants = cva(
  'inline-flex min-h-(--size-tap-min) items-center justify-center gap-2 rounded-full font-sans text-label-sm uppercase tracking-wide transition-colors duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'bg-accent-strong px-[30px] py-3.75 text-warm-white hover:bg-accent',
        secondary:
          'border border-accent px-[28px] py-3.75 text-accent-strong hover:bg-accent/5',
        text: 'gap-2 px-0 py-1 text-accent-strong hover:gap-3',
        reverse: 'bg-reverse-bg px-[30px] py-3.75 text-reverse-text hover:bg-deep-sea/90',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  endIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, endIcon, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant }), className)} {...props}>
        {children}
        {endIcon}
      </button>
    )
  },
)

Button.displayName = 'Button'
