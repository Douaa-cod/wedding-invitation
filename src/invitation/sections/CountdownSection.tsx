import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { PaperCard } from '../PaperCard'
import { CardSubtitle } from '../CardSubtitle'
import { Divider } from '@/design-system'
import { CountdownTimer } from '@/journey/CountdownTimer'
import { useReplayOnView } from '@/motion/useReplayOnView'
import { weddingDate } from '@/data/wedding'

/** Bordeaux doux dédié à la phrase "mois restants" (demande explicite). */
const MONTHS_COLOR = '#8b2436'

/** Mois calendaires complets restants entre deux dates (jamais un simple jours/30). */
function getMonthsLeft(target: Date, now: Date): number {
  let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  if (target.getDate() < now.getDate()) months -= 1
  return Math.max(0, months)
}

/** Se recalcule chaque minute — largement suffisant pour une valeur qui ne
 *  change qu'une fois par mois ; nettoie son intervalle au démontage. */
function useMonthsRemaining(target: Date) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const isDone = target.getTime() <= now.getTime()
  return { months: isDone ? 0 : getMonthsLeft(target, now), isDone }
}

function monthsSentence(months: number, isDone: boolean): string {
  if (isDone) return 'C’est aujourd’hui !'
  if (months <= 0) return 'Le grand jour approche'
  if (months === 1) return 'Plus qu’un mois avant notre grand jour'
  return `Plus que ${months} mois avant notre grand jour`
}

/* Chronologie (ms) de la révélation "surprise" — rejouée à chaque entrée dans
   le viewport (cf. useSurpriseReveal). Chaque valeur sert de délai
   d'animation CSS pour l'élément correspondant. */
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

/** Section dédiée au compte à rebours — après la première carte. Ne se
 *  révèle qu'après la séquence complète de la carte 1 (voir readyToReveal).
 *  Le contenu interne rejoue en plus une révélation "surprise" à chaque
 *  passage dans le viewport — sortie de vue puis retour rejoue la séquence
 *  complète (cf. useReplayOnView). */
export function CountdownSection({ readyToReveal = true }: CountdownSectionProps) {
  const { months, isDone } = useMonthsRemaining(weddingDate)
  const { ref: contentRef, revealed } = useReplayOnView<HTMLDivElement>()
  const sparkles = useSparkles()
  const [sparklesActive, setSparklesActive] = useState(false)

  useEffect(() => {
    if (!revealed) {
      // Carte sortie du viewport — coupe net la salve en cours (différé au
      // macro-tâche suivant, jamais un setState() synchrone dans l'effet),
      // prête à rejouer proprement dès le prochain passage à ≥25% visible.
      const resetId = setTimeout(() => setSparklesActive(false), 0)
      return () => clearTimeout(resetId)
    }
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
      revealAmount={0.2}
      revealY={35}
      revealDuration={0.8}
    >
      <div ref={contentRef} className="flex flex-col items-center gap-4 text-center">
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
            {monthsSentence(months, isDone)}
          </p>
          <p
            className={`font-accent italic text-ink-700 cd-fade-item${revealed ? ' cd-in' : ''}`}
            style={{
              fontSize: 'clamp(0.9375rem, 3.2vw, 1.0625rem)',
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
