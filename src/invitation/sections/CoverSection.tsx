import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { PaperCard } from '../PaperCard'
import { Divider } from '@/design-system'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { PLANE_PATH } from '../planeIcon'
import { couple } from '@/data/wedding'

/** Durée du tracé de la ligne de vol — pur flourish décoratif, brandé (voir brand-book.html). */
const FLIGHT_DRAW_DURATION = 3.6

interface FlightPathProps {
  /** Démarre le tracé GSAP dès que la carte commence son entrée — jamais avant. */
  active: boolean
}

/* Route France → Tunisie. viewBox et marges volontairement généreuses : les
   libellés sont centrés (text-anchor="middle") sur leurs extrémités plutôt
   que positionnés en absolu, pour ne jamais dépendre d'une estimation de
   largeur de texte — c'est ce qui garantit "FRANCE" et "TUNISIE" toujours
   entièrement lisibles, quelle que soit la taille de rendu. overflow="visible"
   en sécurité supplémentaire (le SVG racine masque par défaut tout ce qui
   dépasse son viewBox). */
function FlightPath({ active }: FlightPathProps) {
  const pathRef  = useRef<SVGPathElement>(null)
  const planeRef = useRef<SVGGElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const path  = pathRef.current
    const plane = planeRef.current
    if (!path || !plane || !active) return

    if (reducedMotion) {
      path.style.strokeDasharray = '4 8'
      gsap.set(plane, { opacity: 1 })
      return
    }

    const len = path.getTotalLength()
    const ctx = gsap.context(() => {
      gsap.set(path,  { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(plane, { opacity: 0 })

      /* Tracé lent, élégant — brand-book.html : "La ligne de vol se dessine, l'avion glisse." */
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: FLIGHT_DRAW_DURATION,
        ease: 'sine.inOut',
        onComplete: () => { path.style.strokeDasharray = '4 8' },
      })
      gsap.to(plane, { opacity: 1, duration: 0.7, delay: 2.0, ease: 'power2.out' })
    })
    return () => ctx.revert()
  }, [reducedMotion, active])

  return (
    <svg
      viewBox="0 0 340 84"
      fill="none"
      overflow="visible"
      className="mx-auto w-full"
      style={{ maxWidth: '320px' }}
      aria-hidden="true"
    >
      {/* Ligne de vol */}
      <path
        ref={pathRef}
        d="M30 66 Q 170 6 310 66"
        stroke="var(--color-bronze)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Endpoints */}
      <circle cx="30"  cy="66" r="3.2" fill="var(--color-bronze)" />
      <circle cx="310" cy="66" r="3.2" fill="var(--color-bronze)" />
      {/* Avion — orientation native vers le haut, +82° pour pointer vers la droite (voir planeIcon.ts) */}
      <g ref={planeRef} transform="translate(155,7) scale(0.88) rotate(82 12 12)">
        <path d={PLANE_PATH} fill="var(--color-bronze)" />
      </g>
      {/* Labels villes — centrés sur leur extrémité, jamais positionnés en absolu */}
      <text x="30" y="80" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="11" letterSpacing="1.6" fill="var(--color-ink-300)">
        FRANCE
      </text>
      <text x="310" y="80" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="11" letterSpacing="1.6" fill="var(--color-ink-300)">
        TUNISIE
      </text>
    </svg>
  )
}

export interface CoverSectionProps {
  /**
   * true dès que la première carte commence son entrée depuis le bas —
   * démarre uniquement le tracé décoratif de la ligne de vol. Le contenu
   * (bénédiction, noms, date, lieu) est toujours entièrement visible : une
   * vraie carte en papier ne fait pas apparaître son texte morceau par
   * morceau, il est simplement "là" dès que le papier lui-même est visible.
   */
  entering?: boolean
}

/** Section 1 — Carte de couverture, agrandie et complète. Compteur dans
 *  section dédiée. Unique instance, toujours montée : c'est InvitationPage
 *  qui anime sa position (entrée depuis le bas), jamais ce composant.
 *  Bleed volontaire au-delà de la largeur commune des autres cartes (voir
 *  wrapper ci-dessous) : nettement plus grande, en largeur et en hauteur. */
export function CoverSection({ entering = true }: CoverSectionProps) {
  return (
    /* Bleed en deux calques : le calque externe s'étend sur 100vw et se
       repositionne via calc(50% - 50vw) — technique standard pour "casser"
       la contrainte max-w-130 du conteneur main sans la modifier pour les
       autres cartes — le calque interne centre ensuite la largeur réelle
       voulue (min(96vw,600px), nettement plus large que les 520px communs). */
    <div style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
      <div style={{ maxWidth: 'min(96vw, 600px)', margin: '0 auto' }}>
        <PaperCard skipScrollReveal>
          <div className="flex flex-col items-center gap-5 text-center">

            {/* 1. Bénédiction */}
            <p dir="rtl" lang="ar" className="font-accent text-base"
              style={{ color: 'var(--color-bronze)', letterSpacing: '0.04em', lineHeight: 1.9 }}>
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>

            {/* 2. Route France → Tunisie */}
            <div className="w-full">
              <FlightPath active={!!entering} />
            </div>

            {/* 3. Formule d'invitation */}
            <p className="font-sans text-label-xs uppercase tracking-widest text-dusk-sky-text" style={{ maxWidth: '85%' }}>
              Vous êtes invité(e)s au mariage de
            </p>

            {/* 4. Le couple */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-script text-ink" style={{ fontSize: 'clamp(1.6rem, 6.4vw, 2.5rem)', lineHeight: 1.25 }}>
                {couple.groomName} <span style={{ color: 'var(--color-gold)' }}>&amp;</span> {couple.brideName}
              </span>
            </div>

            {/* 5. Date */}
            <div>
              <Divider variant="accent" className="mx-auto mb-4 -mt-1" />
              <time dateTime="2026-11-14" className="flex flex-col items-center font-display text-ink">
                <span className="font-normal" style={{ fontSize: 'clamp(2.6rem, 10vw, 3.4rem)', lineHeight: 0.95 }}>
                  14
                </span>
                <span className="font-normal" style={{ fontSize: 'clamp(1.05rem, 3.6vw, 1.3rem)', letterSpacing: '0.04em', marginTop: '0.1em' }}>
                  Novembre
                </span>
                <span className="font-normal text-ink-700" style={{ fontSize: 'clamp(0.95rem, 3.3vw, 1.15rem)', letterSpacing: '0.06em', marginTop: '0.05em' }}>
                  2026
                </span>
              </time>
            </div>

            {/* 6. Lieu */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-accent text-lg italic text-ink-700">La Perle du Lac</span>
              <span className="font-sans text-label-xs uppercase tracking-widest text-text-subtle">Tunis</span>
            </div>

            <Divider variant="accent" className="mx-auto w-10" />

            {/* 7. Texte de clôture */}
            <p className="font-accent italic text-text-muted" style={{ fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', lineHeight: 1.75, maxWidth: '88%' }}>
              De Tunis à Paris,<br />
              avec le Maroc dans le cœur,<br />
              deux familles deviennent une seule histoire.
            </p>
          </div>
        </PaperCard>
      </div>
    </div>
  )
}
