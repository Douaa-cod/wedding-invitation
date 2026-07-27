import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { PaperCard } from '../PaperCard'
import { CardSubtitle } from '../CardSubtitle'
import { Divider } from '@/design-system'
import { CountdownTimer } from '@/journey/CountdownTimer'
import { weddingDate } from '@/data/wedding'

/** Filet de sécurité : si `readyToReveal` ne passe jamais à true (bug de la
 *  séquence de la carte 1), la carte ne doit jamais rester invisible
 *  indéfiniment — délai généreux, largement au-delà de la durée normale de
 *  la séquence d'ouverture. */
const REVEAL_SAFETY_TIMEOUT_MS = 8000

/* Étoiles décoratives permanentes autour du compte à rebours — positions
   fixes (jamais recalculées), dans le même esprit que MagicHearts.tsx :
   discrètes, réparties au-dessus et en dessous des chiffres, jamais sur le
   texte lui-même. */
const COUNTDOWN_STARS = [
  { top: '-7%', left: '3%' },
  { top: '-9%', left: '50%' },
  { top: '-7%', left: '96%' },
  { top: '103%', left: '12%' },
  { top: '106%', left: '50%' },
  { top: '103%', left: '88%' },
]

/** Bordeaux doux dédié à la phrase "mois restants" (demande explicite). */
const MONTHS_COLOR = '#8b2436'

/** Mois calendaires complets restants entre deux dates (jamais un simple jours/30). */
function getMonthsLeft(target: Date, now: Date): number {
  let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  if (target.getDate() < now.getDate()) months -= 1
  return Math.max(0, months)
}

/** Minuit local de la date fournie — pour compter des jours calendaires
 *  entiers, indépendamment de l'heure de la cible (18h00) ou de l'heure
 *  courante (sans quoi le nombre de jours affiché varierait au fil de la
 *  journée au lieu de rester stable jusqu'au lendemain). */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Jours calendaires entiers restants (0 = le jour même, négatif = passé). */
function getDaysLeft(target: Date, now: Date): number {
  const msPerDay = 86_400_000
  return Math.round((startOfDay(target).getTime() - startOfDay(now).getTime()) / msPerDay)
}

/** Se recalcule chaque minute — largement suffisant pour des valeurs qui ne
 *  changent qu'une fois par jour au minimum ; nettoie son intervalle au
 *  démontage. */
function useTimeRemaining(target: Date) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  return { months: getMonthsLeft(target, now), daysLeft: getDaysLeft(target, now) }
}

/** Jamais de valeur négative une fois la date passée (daysLeft ≤ 0 couvre à
 *  la fois "aujourd'hui" et "déjà passé") ; sous un mois complet, bascule sur
 *  un décompte en jours avec singulier/pluriel géré séparément du mois. */
function monthsSentence(months: number, daysLeft: number): string {
  if (daysLeft <= 0) return 'C’est notre grand jour !'
  if (months >= 1) {
    return months === 1 ? 'Plus qu’un mois avant notre grand jour' : `Plus que ${months} mois avant notre grand jour`
  }
  return daysLeft === 1 ? 'Plus qu’un jour avant notre grand jour' : `Plus que ${daysLeft} jours avant notre grand jour`
}

/* Chronologie (ms) de la révélation — jouée une seule fois, dès que
   `readyToReveal` passe à true (jamais liée au scroll, jamais rejouée).
   Chaque valeur sert de délai d'animation CSS pour l'élément correspondant. */
const UNITS_DELAY = 220
const UNITS_STAGGER = 120
const UNITS_DURATION = 750 // durée de cd-unit-in (voir countdown-reveal.css)
const SPARKLE_DELAY = UNITS_DELAY
const SPARKLE_DURATION = 900 // durée de cd-sparkle-burst (voir countdown-reveal.css)
const REST_BASE_DELAY = UNITS_DELAY + 3 * UNITS_STAGGER + UNITS_DURATION + 150
const REST_STAGGER = 100

/* Petites particules dorées — trajet/position légèrement aléatoires mais
   tirés une seule fois au montage (jamais recalculés), palette et formes
   limitées à celles de la marque. */
const SPARKLE_SHAPES = ['star', 'circle', 'circle', 'star', 'circle', 'heart', 'star', 'circle', 'circle', 'heart'] as const
const SPARKLE_COLORS = [
  'var(--color-gold)',
  'var(--color-soft-sand)',
  'var(--color-gold)',
  'var(--color-bordeaux)',
  'var(--color-soft-sand)',
  'var(--color-gold)',
  'var(--color-soft-sand)',
  'var(--color-gold)',
  'var(--color-bordeaux)',
  'var(--color-soft-sand)',
]

interface Sparkle {
  id: number
  left: number
  top: number
  dx: number
  dy: number
  rotate: number
  delay: number
  shape: (typeof SPARKLE_SHAPES)[number]
  color: string
}

/** Tirage aléatoire des trajectoires — appelé une seule fois, hors du rendu
 *  (dans un effet), jamais pendant le render (règle react-hooks/purity). */
function generateSparkles(): Sparkle[] {
  return SPARKLE_SHAPES.map((shape, i) => {
    const angle = Math.random() * Math.PI * 2
    const distance = 22 + Math.random() * 20
    const band = i % 2 === 0 ? [-10, 16] : [80, 108]
    return {
      id: i,
      left: 6 + Math.random() * 88,
      top: band[0] + Math.random() * (band[1] - band[0]),
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      rotate: (Math.random() - 0.5) * 130,
      delay: Math.random() * 160,
      shape,
      color: SPARKLE_COLORS[i],
    }
  })
}

/** Trajectoires figées au montage (un seul tirage, jamais recalculé —
 *  initialiseur paresseux de useState, exécuté une seule fois). */
function useSparkles(): Sparkle[] {
  const [sparkles] = useState(generateSparkles)
  return sparkles
}

function sparkleGlyph(shape: Sparkle['shape']) {
  if (shape === 'star') return '✦'
  if (shape === 'heart') return '❥'
  return '●'
}

export interface CountdownSectionProps {
  /** true une fois la révélation progressive de la carte 1 (nom, cœurs, instruction de scroll) terminée. */
  readyToReveal?: boolean
}

/** Section dédiée au compte à rebours — après la première carte. Apparaît
 *  dès le chargement de la page, sans attendre le scroll : dès que
 *  `readyToReveal` passe à true (fin de la séquence de la carte 1), la carte
 *  et son contenu se révèlent une seule fois et restent visibles en
 *  permanence — jamais rejoués, jamais masqués en scrollant. Un filet de
 *  sécurité local garantit la révélation même si `readyToReveal` ne passe
 *  jamais à true (voir REVEAL_SAFETY_TIMEOUT_MS). */
export function CountdownSection({ readyToReveal = true }: CountdownSectionProps) {
  const { months, daysLeft } = useTimeRemaining(weddingDate)
  const [revealed, setRevealed] = useState(false)
  const sparkles = useSparkles()
  const [sparklesActive, setSparklesActive] = useState(false)

  useEffect(() => {
    if (readyToReveal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- volontaire : readyToReveal est une prop qui change après le montage (fin de la séquence de la carte 1), un initialiseur paresseux ne pourrait jamais réagir à ce changement.
      setRevealed(true)
      return
    }
    // Filet de sécurité : la carte ne doit jamais rester invisible
    // indéfiniment si `readyToReveal` ne passe jamais à true.
    const safetyId = setTimeout(() => setRevealed(true), REVEAL_SAFETY_TIMEOUT_MS)
    return () => clearTimeout(safetyId)
  }, [readyToReveal])

  useEffect(() => {
    if (!revealed) return
    // `revealed` ne repasse jamais à false : cette salve ne se joue donc
    // qu'une seule fois par chargement de page.
    const showId = setTimeout(() => setSparklesActive(true), SPARKLE_DELAY)
    const hideId = setTimeout(() => setSparklesActive(false), SPARKLE_DELAY + SPARKLE_DURATION)
    return () => {
      clearTimeout(showId)
      clearTimeout(hideId)
    }
  }, [revealed])

  return (
    <PaperCard
      revealGate={readyToReveal}
      revealOnMount
      revealY={18}
      revealDuration={1}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <CardSubtitle className={`cd-subtitle${revealed ? ' cd-in' : ''}`}>Le compte à rebours</CardSubtitle>

        <div className="relative w-full">
          <CountdownTimer
            target={weddingDate}
            variant="full"
            className="w-full"
            revealed={revealed}
            revealDelayMs={UNITS_DELAY}
            revealStaggerMs={UNITS_STAGGER}
          />

          {sparklesActive && (
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {sparkles.map((s) => (
                <span
                  key={s.id}
                  className="cd-sparkle cd-in"
                  style={
                    {
                      left: `${s.left}%`,
                      top: `${s.top}%`,
                      color: s.color,
                      animationDelay: `${s.delay}ms`,
                      '--cd-sparkle-dx': `${s.dx}px`,
                      '--cd-sparkle-dy': `${s.dy}px`,
                      '--cd-sparkle-rot': `${s.rotate}deg`,
                    } as CSSProperties
                  }
                >
                  {sparkleGlyph(s.shape)}
                </span>
              ))}
            </div>
          )}

          {/* Petites étoiles décoratives permanentes — apparaissent avec la
              carte et continuent de scintiller indéfiniment (voir
              .countdown-star dans countdown-reveal.css), dans le même esprit
              que les cœurs de MagicHearts.tsx. */}
          {revealed && (
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {COUNTDOWN_STARS.map((star, i) => (
                <span
                  key={i}
                  className="countdown-star absolute"
                  style={{ top: star.top, left: star.left, color: 'var(--color-gold)' }}
                >
                  ✦
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={`cd-fade-item${revealed ? ' cd-in' : ''}`} style={{ animationDelay: `${REST_BASE_DELAY}ms` }}>
          <Divider variant="accent" className="mx-auto w-10" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <p
            className={`font-accent italic cd-fade-item${revealed ? ' cd-in' : ''}`}
            style={{
              color: MONTHS_COLOR,
              fontSize: 'clamp(1rem, 3.6vw, 1.125rem)',
              animationDelay: `${REST_BASE_DELAY + REST_STAGGER}ms`,
            }}
          >
            {monthsSentence(months, daysLeft)}
          </p>
          <p
            className={`font-accent italic font-medium text-ink-800 cd-fade-item${revealed ? ' cd-in' : ''}`}
            style={{
              fontSize: 'clamp(0.9375rem, 3.2vw, 1.0625rem)',
              lineHeight: 1.55,
              animationDelay: `${REST_BASE_DELAY + REST_STAGGER * 2}ms`,
            }}
          >
            jusqu’au 14 novembre 2026
          </p>
        </div>
      </div>
    </PaperCard>
  )
}
