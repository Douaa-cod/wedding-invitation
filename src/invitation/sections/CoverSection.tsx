import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { PaperCard } from '../PaperCard'
import { Divider } from '@/design-system'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { EASE_OUT } from '@/motion/variants'
import { AirplaneIcon } from '../AirplaneIcon'
import { couple } from '@/data/wedding'
import { MagicHearts } from './MagicHearts'

/** Cadence de la révélation progressive du contenu — Brand Book section 15
 *  ("Stagger") affiné pour cette séquence spécifique : 150–250ms demandés. */
const REVEAL_STAGGER = 0.2
const REVEAL_DURATION = 0.7
const HEART_START_OFFSET = 0.35 // laisse le nom se stabiliser avant le premier cœur

/** Tracé de la ligne de vol — flourish décoratif, resserré pour tenir dans la
 *  fenêtre de la révélation progressive (voir brand-book.html section 15). */
const FLIGHT_DRAW_DURATION = 1.15
const FLIGHT_PLANE_DELAY = 0.5
const FLIGHT_PLANE_DURATION = 0.4

/* Palette dédiée à cette carte uniquement (demande explicite, hors palette
   sémantique globale) : bordeaux sombre et doux pour les noms et la date
   (assez profond pour le contraste, jamais noir), or sombre et riche pour
   l'esperluette et la basmala. */
const NAMES_COLOR = '#5f2a32'
const GOLD_DEEP = '#9a6a2f'

/* Police décorative partagée par "Rachid & Douaa" et "14 Novembre" — un seul
   point de vérité pour garantir qu'ils restent visuellement identiques (même
   police, même graisse, même couleur), le nom restant légèrement plus grand
   que la date à chaque palier de la fonction clamp(). */
const DECORATIVE_NAME_STYLE = { color: NAMES_COLOR, fontWeight: 500 } as const

interface FlightPathProps {
  /** Démarre le tracé GSAP dès que la séquence de révélation est active. */
  active: boolean
  /** Décalage (s) avant le début du tracé — aligné sur le tour de cet élément dans le stagger. */
  startDelay: number
}

/* Route France → Tunisie. viewBox et marges volontairement généreuses : les
   libellés sont centrés (text-anchor="middle") sur leurs extrémités plutôt
   que positionnés en absolu, pour ne jamais dépendre d'une estimation de
   largeur de texte — c'est ce qui garantit "FRANCE" et "TUNISIE" toujours
   entièrement lisibles, quelle que soit la taille de rendu. overflow="visible"
   en sécurité supplémentaire (le SVG racine masque par défaut tout ce qui
   dépasse son viewBox). */
function FlightPath({ active, startDelay }: FlightPathProps) {
  const pathRef  = useRef<SVGPathElement>(null)
  const planeRef = useRef<SVGSVGElement>(null)
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

      /* Tracé élégant — brand-book.html : "La ligne de vol se dessine, l'avion glisse." */
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: FLIGHT_DRAW_DURATION,
        delay: startDelay,
        ease: 'sine.inOut',
        onComplete: () => { path.style.strokeDasharray = '4 8' },
      })
      gsap.to(plane, {
        opacity: 1,
        duration: FLIGHT_PLANE_DURATION,
        delay: startDelay + FLIGHT_PLANE_DELAY,
        ease: 'power2.out',
      })
    })
    return () => ctx.revert()
  }, [reducedMotion, active, startDelay])

  return (
    /* Largeur volontairement resserrée (92%, plafond 280px) ET tracé rapproché
       du centre (55–285 sur un viewBox de 340, contre 30–310 avant) : les deux
       marges cumulées gardent le trajet, l'avion et les libellés à bonne
       distance des fleurs gaufrées du cadre, y compris sur mobile — jamais un
       overflow:hidden, seulement moins d'étalement horizontal. */
    <svg
      viewBox="0 0 340 76"
      fill="none"
      overflow="visible"
      className="mx-auto"
      style={{ width: '92%', maxWidth: '280px' }}
      aria-hidden="true"
    >
      {/* Ligne de vol */}
      <path
        ref={pathRef}
        d="M55 58 Q 170 2 285 58"
        stroke="var(--color-bronze)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Endpoints */}
      <circle cx="55"  cy="58" r="3.2" fill="var(--color-bronze)" />
      <circle cx="285" cy="58" r="3.2" fill="var(--color-bronze)" />
      {/* Avion — icône partagée (voir AirplaneIcon), +82° pour pointer vers la droite */}
      <g transform="translate(158,0) scale(0.88)">
        <AirplaneIcon ref={planeRef} rotation={82} size={24} />
      </g>
      {/* Labels villes — centrés sur leur extrémité, jamais positionnés en absolu */}
      <text x="55" y="72" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="11" letterSpacing="1.6" fill="var(--color-ink-300)">
        FRANCE
      </text>
      <text x="285" y="72" textAnchor="middle" fontFamily="Montserrat,sans-serif" fontSize="11" letterSpacing="1.6" fill="var(--color-ink-300)">
        TUNISIE
      </text>
    </svg>
  )
}

/** Un maillon de la révélation progressive — fondu + léger déplacement +
 *  flou subtil, jamais de saut ni de rotation (demande explicite). */
function RevealItem({
  index, active, reducedMotion, className, onComplete, children,
}: {
  index: number
  active: boolean
  reducedMotion: boolean
  className?: string
  onComplete?: () => void
  children: ReactNode
}) {
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(4px)' }}
      animate={
        active
          ? reducedMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, filter: 'blur(0px)' }
          : undefined
      }
      transition={{
        duration: reducedMotion ? 0.3 : REVEAL_DURATION,
        delay: reducedMotion ? index * 0.08 : index * REVEAL_STAGGER,
        ease: EASE_OUT,
      }}
      onAnimationComplete={onComplete}
    >
      {children}
    </motion.div>
  )
}

/** Le nom des mariés — mise en avant dédiée (échelle + fondu + lueur dorée
 *  fugace) plutôt que le flou/déplacement générique des autres éléments :
 *  c'est le point focal de la carte. */
function NameHighlight({ index, active, reducedMotion }: { index: number; active: boolean; reducedMotion: boolean }) {
  const delay = reducedMotion ? index * 0.08 : index * REVEAL_STAGGER

  return (
    <motion.div
      className="relative flex flex-col items-center gap-1 px-2"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={active ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: reducedMotion ? 0.3 : REVEAL_DURATION, delay, ease: EASE_OUT }}
    >
      {/* Lueur dorée fugace — apparaît puis s'efface entièrement, jamais une ombre permanente */}
      {!reducedMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            width: '80%',
            height: '160%',
            left: '10%',
            top: '-30%',
            background: 'radial-gradient(closest-side, color-mix(in srgb, var(--color-gold) 55%, transparent), transparent 72%)',
            filter: 'blur(14px)',
          }}
          initial={{ opacity: 0 }}
          animate={active ? { opacity: [0, 0.8, 0] } : { opacity: 0 }}
          transition={{ duration: 1.3, delay: delay + 0.1, ease: 'easeInOut' }}
        />
      )}

      <MagicHearts active={active} startDelay={delay + HEART_START_OFFSET} />

      <span
        className="font-script relative"
        style={{
          ...DECORATIVE_NAME_STYLE,
          fontSize: 'clamp(1.7rem, 7.2vw, 2.8rem)',
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
        }}
      >
        {couple.groomName}{' '}
        <span style={{ color: GOLD_DEEP, fontWeight: 700, fontSize: '1.12em' }}>&amp;</span>{' '}
        {couple.brideName}
      </span>
    </motion.div>
  )
}

export interface CoverSectionProps {
  /**
   * true une fois la carte 1 stabilisée à sa position finale (voir
   * InvitationPage) — déclenche la révélation progressive du contenu. Le
   * papier lui-même (fond, cadre) est toujours entièrement visible dès le
   * montage : seul le contenu apparaît par étapes.
   */
  revealReady?: boolean
  /** Appelé une fois le dernier élément de la séquence (citation finale) entièrement révélé. */
  onRevealComplete?: () => void
}

/** Section 1 — Carte de couverture, agrandie et complète. Compteur dans
 *  section dédiée. Unique instance, toujours montée : c'est InvitationPage
 *  qui anime sa position (entrée depuis le bas), jamais ce composant.
 *  Bleed volontaire au-delà de la largeur commune des autres cartes (voir
 *  wrapper ci-dessous) : nettement plus grande, en largeur et en hauteur. */
export function CoverSection({ revealReady = false, onRevealComplete }: CoverSectionProps) {
  const reducedMotion = useReducedMotion()
  const revealFiredRef = useRef(false)

  /* Framer Motion peut déclencher onAnimationComplete dès le montage initial
     (transition à durée nulle) — on ignore tout appel tant que la vraie
     révélation (déclenchée par revealReady) n'a pas commencé, et on ne le
     signale qu'une seule fois (voir InvitationPage, même précaution pour
     l'entrée de la carte). */
  function handleClosingComplete() {
    if (!revealReady || revealFiredRef.current) return
    revealFiredRef.current = true
    onRevealComplete?.()
  }

  return (
    /* Bleed en deux calques : le calque externe s'étend sur 100vw et se
       repositionne via calc(50% - 50vw) — technique standard pour "casser"
       la contrainte max-w-130 du conteneur main sans la modifier pour les
       autres cartes — le calque interne centre ensuite la largeur réelle
       voulue (min(96vw,600px), nettement plus large que les 520px communs). */
    <div style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
      <div style={{ maxWidth: 'min(96vw, 600px)', margin: '0 auto' }}>
        <PaperCard skipScrollReveal>
          <div className="flex flex-col items-center gap-3 text-center">

            {/* 1. Bénédiction — calligraphie arabe dédiée (voir --font-arabic),
                jamais la police latine décorative (ne contient aucun glyphe arabe).
                pt-3 : marge dédiée supplémentaire — cette carte n'a pas d'eyebrow/
                titre au-dessus (skipScrollReveal), donc rien d'autre n'absorbe le
                dépassement des harakat (diacritiques hauts) au-delà de leur boîte
                de ligne ; les autres cartes en sont protégées par leur en-tête. */}
            <RevealItem index={0} active={revealReady} reducedMotion={reducedMotion} className="w-full pt-3">
              <p dir="rtl" lang="ar" className="font-arabic"
                style={{ color: GOLD_DEEP, fontSize: 'clamp(1.1rem, 4.4vw, 1.4rem)', letterSpacing: '0.02em', lineHeight: 2.1 }}>
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </RevealItem>

            {/* 2. Formule d'invitation — casse normale, douce, jamais de
                capitales trackées (réservées aux labels UI, voir typography.css) */}
            <RevealItem index={1} active={revealReady} reducedMotion={reducedMotion}>
              <p className="font-accent text-dusk-sky-text" style={{ fontSize: 'clamp(0.95rem, 3.4vw, 1.05rem)', maxWidth: '85%' }}>
                Vous êtes invité(e)s au mariage de
              </p>
            </RevealItem>

            {/* 3-4. Le couple — mise en avant dédiée + cœurs magiques */}
            <NameHighlight index={2} active={revealReady} reducedMotion={reducedMotion} />

            {/* 5-7. Divider, puis date — même police décorative que le nom pour
                "14 Novembre", millésime en serif plus petit juste en dessous. */}
            <RevealItem index={3} active={revealReady} reducedMotion={reducedMotion}>
              <Divider variant="accent" className="mx-auto mb-4" />
              <time dateTime="2026-11-14" className="flex flex-col items-center">
                <span
                  className="font-script"
                  style={{ ...DECORATIVE_NAME_STYLE, fontSize: 'clamp(1.5rem, 6.2vw, 2.35rem)', lineHeight: 1.15, whiteSpace: 'nowrap' }}
                >
                  <span style={{ fontSize: '1.25em' }}>14</span> Novembre
                </span>
                <span className="font-display font-normal text-ink-700" style={{ fontSize: 'clamp(0.95rem, 3.3vw, 1.15rem)', letterSpacing: '0.06em', marginTop: '0.05em' }}>
                  2026
                </span>
              </time>
            </RevealItem>

            {/* 8-9. Lieu */}
            <RevealItem index={4} active={revealReady} reducedMotion={reducedMotion} className="flex flex-col items-center gap-0.5">
              <span className="font-accent text-lg font-medium italic text-ink">À La Perle du Lac</span>
              <span className="font-sans text-label-xs uppercase tracking-widest text-text-subtle">Tunis</span>
            </RevealItem>

            {/* 10-11. Divider, puis route France → Tunisie — juste au-dessus de la citation finale. */}
            <RevealItem index={5} active={revealReady} reducedMotion={reducedMotion} className="w-full">
              <Divider variant="accent" className="mx-auto w-10 mb-3" />
              <FlightPath active={revealReady} startDelay={5 * REVEAL_STAGGER} />
            </RevealItem>

            {/* 12. Citation finale */}
            <RevealItem index={6} active={revealReady} reducedMotion={reducedMotion} onComplete={handleClosingComplete}>
              <p className="font-accent italic text-ink-700" style={{ fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', lineHeight: 1.3, maxWidth: '90%' }}>
                Entre la France et la Tunisie,<br />
                le Maroc dans le cœur,<br />
                nos chemins s’unissent pour écrire une seule histoire.
              </p>
            </RevealItem>
          </div>
        </PaperCard>
      </div>
    </div>
  )
}
