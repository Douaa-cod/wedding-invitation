import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { CARD_MAIN_TITLE_STYLE } from './cardMainTitleStyle'

export interface CardMainTitleProps {
  children: ReactNode
  className?: string
  /** Surcharge ponctuelle (ex. fontSize) pour une carte spécifique — fusionnée
   * après CARD_MAIN_TITLE_STYLE, jamais utilisée par défaut : les autres
   * cartes qui ne passent pas cette prop gardent la taille commune inchangée. */
  style?: CSSProperties
}

/** Titre principal décoratif partagé — voir cardMainTitleStyle.ts pour le
 *  détail de la déclaration typographique commune. */
export function CardMainTitle({ children, className, style }: CardMainTitleProps) {
  return (
    <div className={cn('text-ink', className)} style={{ ...CARD_MAIN_TITLE_STYLE, ...style }}>
      {children}
    </div>
  )
}
