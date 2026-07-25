import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CardSubtitleProps {
  children: ReactNode
  className?: string
}

/**
 * Sous-titre/eyebrow partagé par toutes les cartes — une seule déclaration
 * typographique pour "NOTRE HISTOIRE", "LE COMPTE À REBOURS", "PROGRAMME",
 * "INFORMATIONS", "CADEAU", "RSVP", "HOMMAGE" : jamais de tracking, taille ou
 * couleur divergente d'une carte à l'autre pour ce même rôle (Montserrat).
 */
export function CardSubtitle({ children, className }: CardSubtitleProps) {
  return (
    <p
      className={cn('mx-auto w-full max-w-full text-center font-sans uppercase text-accent', className)}
      style={{ fontSize: 'clamp(0.8125rem, 2.4vw, 0.9375rem)', fontWeight: 500, lineHeight: 1.35, letterSpacing: '0.12em' }}
    >
      {children}
    </p>
  )
}
