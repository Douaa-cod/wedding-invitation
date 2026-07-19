import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CardShellProps {
  eyebrow?: string
  title?: string
  /** Repère imprimé discret en coin, ex. "03 / 07". */
  index?: string
  footer?: ReactNode
  children: ReactNode
  className?: string
  /** Style inline optionnel (couleur de texte, etc.) — ne surcharge pas le fond. */
  style?: CSSProperties
}

/**
 * Chrome des cartes d'invitation — background-card.png officiel.
 *
 * background-card.png (848×1264, ratio 2:3) :
 *   • Vrai papier coton premium, deckled edges, sans bordure noire
 *   • Ornements floraux embossés sur les bords gauche (~18%) et droit (~18%)
 *   • object-fit: cover — ratio identique au conteneur → zéro déformation
 *
 * Zone de contenu sécurisée (ornements préservés) :
 *   pt-[7%]  pb-[7%]  px-[20%]
 */
export function CardShell({
  eyebrow,
  title,
  index,
  footer,
  children,
  className,
  style,
}: CardShellProps) {
  return (
    <div
      className={cn('relative flex h-full w-full overflow-hidden rounded-2xl', className)}
      style={{
        boxShadow:
          '0 4px 10px rgba(0,0,0,0.20), 0 22px 44px -16px rgba(0,0,0,0.42), 0 52px 80px -36px rgba(0,0,0,0.32)',
        ...style,
      }}
    >
      {/* Fond officiel — background-card.png sans aucune distorsion */}
      <img
        src="/assets/cards/background-card.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        draggable={false}
      />

      {/* Repère de pagination */}
      {index && (
        <span
          className="absolute right-[21%] top-[8.5%] font-sans tracking-wider text-text-subtle"
          style={{ fontSize: '0.75rem' }}
        >
          {index}
        </span>
      )}

      {/* Zone de contenu — inset dans la zone sécurisée (hors floraux) */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ padding: '7% 20% 7% 20%' }}
      >
        <div className="relative flex h-full flex-col">

          {/* En-tête optionnelle */}
          {(eyebrow || title) && (
            <div className="text-center">
              {eyebrow && (
                <div className="font-sans text-label-xs uppercase tracking-widest text-accent">
                  {eyebrow}
                </div>
              )}
              {title && (
                <>
                  <div className="mt-2 font-script leading-tight text-ink" style={{ fontSize: 'clamp(1.75rem, 6.2vw, 2.25rem)' }}>
                    {title}
                  </div>
                  <div className="mx-auto mt-2 h-px w-7 bg-divider" />
                </>
              )}
            </div>
          )}

          {/* Contenu principal */}
          <div className="mt-3 flex flex-1 flex-col">{children}</div>

          {/* Pied de carte */}
          {footer && <div className="mt-3">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
