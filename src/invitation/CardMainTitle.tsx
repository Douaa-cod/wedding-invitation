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
  /** Élément HTML rendu — 'h2' par défaut (titre de section, au même niveau
   * que les autres sections de la page). Purement sémantique : la marge par
   * défaut du navigateur est neutralisée ci-dessous, donc le rendu visuel
   * est strictement identique quel que soit le tag. */
  as?: 'h1' | 'h2'
}

/** Titre principal décoratif partagé — voir cardMainTitleStyle.ts pour le
 *  détail de la déclaration typographique commune. */
export function CardMainTitle({ children, className, style, as: Tag = 'h2' }: CardMainTitleProps) {
  return (
    <Tag className={cn('text-ink', className)} style={{ ...CARD_MAIN_TITLE_STYLE, margin: 0, ...style }}>
      {children}
    </Tag>
  )
}
