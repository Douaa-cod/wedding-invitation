import type { ElementType, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const headingVariants = cva('font-display text-ink', {
  variants: {
    level: {
      h1: 'text-h1 leading-[1.04]',
      h2: 'text-h2 leading-[1.1]',
      h3: 'text-h3 leading-[1.1]',
    },
  },
  defaultVariants: {
    level: 'h2',
  },
})

export interface HeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: ElementType
}

/**
 * Titre Playfair Display. Pour le mot accentué en italique bronze
 * (ex. "Quiet Luxury"), entourer le fragment d'un <em> — stylé automatiquement.
 */
export function Heading({ as: Tag = 'h2', level, className, ...props }: HeadingProps) {
  return (
    <Tag
      className={cn(headingVariants({ level }), '[&_em]:font-normal [&_em]:italic [&_em]:text-accent', className)}
      {...props}
    />
  )
}
