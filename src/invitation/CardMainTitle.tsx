import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { CARD_MAIN_TITLE_STYLE } from './cardMainTitleStyle'

export interface CardMainTitleProps {
  children: ReactNode
  className?: string
}

/** Titre principal décoratif partagé — voir cardMainTitleStyle.ts pour le
 *  détail de la déclaration typographique commune. */
export function CardMainTitle({ children, className }: CardMainTitleProps) {
  return (
    <div className={cn('text-ink', className)} style={CARD_MAIN_TITLE_STYLE}>
      {children}
    </div>
  )
}
