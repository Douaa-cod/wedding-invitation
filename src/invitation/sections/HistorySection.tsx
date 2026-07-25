import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { PaperCard } from '../PaperCard'
import { CardSubtitle } from '../CardSubtitle'
import { CardMainTitle } from '../CardMainTitle'
import { Divider } from '@/design-system'
import { MagicHearts } from './MagicHearts'
import { timelineMilestones } from '@/data/wedding'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { EASE_OUT } from '@/motion/variants'

/** Icône par jalon — même ordre que timelineMilestones (cf. data/wedding.ts). */
const STAGE_ICONS = [
  '/assets/decorations/story-meeting.png',
  '/assets/decorations/story-engagement.png',
  '/assets/decorations/story-marriage-contract.png',
  '/assets/decorations/story-wedding.png',
]

/* Format complet réservé à l'affichage final "Le grand jour" (même date que
   timelineMilestones[3].dateLabel, juste écrite en toutes lettres pour ce
   moment phare) — la donnée source (data/wedding.ts) n'est pas modifiée. */
const FINAL_DATE_FULL = '14 novembre 2026'

const ICON_SIZE = 38 // 34–42px demandés pour les 3 premières icônes
const ICON_SIZE_FINAL = 48 // 44–52px demandés pour l'icône finale
const COLUMN_WIDTH = 52 // légèrement > ICON_SIZE_FINAL — centre le fil pour toutes les icônes
const LINE_X = COLUMN_WIDTH / 2

const SEGMENT_DURATION = 0.6 // 500–700ms demandés entre deux jalons
const ICON_ACTIVATE_DURATION = 0.42 // 350–500ms demandés
const TEXT_REVEAL_DURATION = 0.58 // 500–650ms demandés
const TEXT_STAGGER = 0.13 // 100–160ms demandés

/**
 * 2. Notre histoire — timeline verticale animée des jalons du couple.
 * Progression déclenchée à l'entrée dans le viewport (timeline séquentielle
 * unique — GSAP ScrollTrigger n'étant pas déjà utilisé ailleurs dans le
 * projet, on reste sur l'architecture existante : framer-motion + useInView,
 * comme toutes les autres cartes). Icônes PNG dédiées, jalon final "Le grand
 * jour" affiché directement sur le papier (aucun panneau superposé).
 */
export function HistorySection() {
  const reducedMotion = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const [centers, setCenters] = useState<number[]>([])

  const isInView = useInView(trackRef, { once: true, amount: 0.2 })
  const revealed = isInView || reducedMotion

  const lastIndex = timelineMilestones.length - 1
  const totalDuration = SEGMENT_DURATION * lastIndex

  /* Mesure le centre réel de chaque icône — le fil de progression doit
     s'arrêter exactement au centre de l'icône finale, et chaque étape doit
     s'activer précisément quand le fil l'atteint, quelle que soit la taille
     des icônes ou la largeur d'écran. */
  useLayoutEffect(() => {
    function measure() {
      const trackEl = trackRef.current
      if (!trackEl) return
      const trackBox = trackEl.getBoundingClientRect()
      const next = iconRefs.current.map((el) => {
        if (!el) return 0
        const box = el.getBoundingClientRect()
        return box.top + box.height / 2 - trackBox.top
      })
      setCenters(next)
    }

    measure()
    window.addEventListener('resize', measure)
    const raf = requestAnimationFrame(measure) // recale après le chargement des polices
    return () => {
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf)
    }
  }, [])

  const lineTop = centers[0] ?? 0
  const lineHeight = centers.length ? Math.max((centers[lastIndex] ?? 0) - lineTop, 0) : 0
  /* Hauteurs intermédiaires relatives au centre de la première icône — le
     fil progresse par paliers de durée égale (un palier par étape), même si
     l'écart en pixels entre deux étapes diffère (icône finale plus grande). */
  const heightKeyframes = centers.length ? centers.map((c) => Math.max(c - lineTop, 0)) : [0]
  const lineTimes = centers.length > 1 ? centers.map((_, i) => i / lastIndex) : [0, 1]

  const textContainer: Variants = {
    hidden: {},
    visible: (delay: number) => ({
      transition: { staggerChildren: TEXT_STAGGER, delayChildren: delay },
    }),
  }
  const textItem: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: TEXT_REVEAL_DURATION, ease: EASE_OUT },
    },
  }

  return (
    <PaperCard>
      {/* 1–3. Sous-titre, titre principal, petit filet décoratif */}
      <div className="text-center">
        <CardSubtitle>Notre histoire</CardSubtitle>
        <CardMainTitle className="mt-2">Notre chemin</CardMainTitle>
        <Divider variant="accent" className="mx-auto mt-3" />
      </div>

      {/* Zone de contenu centrale — marge additionnelle par rapport à la zone
          déjà sécurisée de PaperCard (px-[20%]), pour garder tout élément de
          la timeline loin des floraux, y compris sur mobile. */}
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: '22rem', paddingLeft: 'clamp(0.5rem, 3vw, 1rem)', paddingRight: 'clamp(0.5rem, 3vw, 1rem)' }}
      >
        {/* 4–8. Timeline verticale animée */}
        <div ref={trackRef} className="relative mt-7 sm:mt-8">
          {/* Fil inactif — visible dès le départ, fin comme un fil doré délicat */}
          <div
            aria-hidden="true"
            className="absolute z-0"
            style={{
              left: LINE_X - 0.5,
              top: lineTop,
              width: 1,
              height: lineHeight,
              background: 'var(--color-gold)',
              opacity: 0.22,
            }}
          />
          {/* Fil actif — démarre à 0, doré plus soutenu, à peine plus épais que
              le fil inactif (jamais plus de 2px), progresse par palier (un
              palier par étape) et s'arrête pile au centre de l'icône finale. */}
          <motion.div
            aria-hidden="true"
            className="absolute z-0 origin-top"
            style={{
              left: LINE_X - 0.75,
              top: lineTop,
              width: 1.5,
              background: 'linear-gradient(to bottom, var(--color-accent-strong), var(--color-gold))',
            }}
            initial={reducedMotion ? false : { height: 0 }}
            animate={{ height: revealed ? heightKeyframes : 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: totalDuration, times: lineTimes, ease: EASE_OUT }
            }
          />

          <ul className="relative flex flex-col gap-7 sm:gap-8">
            {timelineMilestones.map((milestone, index) => {
              const isLast = index === lastIndex
              const activateDelay = reducedMotion ? 0 : (index / lastIndex) * totalDuration
              const iconSize = isLast ? ICON_SIZE_FINAL : ICON_SIZE

              return (
                <li key={milestone.title} className="relative flex gap-4 sm:gap-5">
                  {/* Icône du jalon — au-dessus du fil (z-20), fond toujours
                      transparent, jamais de disque blanc/bleu/opaque. */}
                  <div
                    ref={(el) => {
                      iconRefs.current[index] = el
                    }}
                    className="relative z-20 flex shrink-0 items-center justify-center self-start"
                    style={{ width: COLUMN_WIDTH, height: Math.max(iconSize, 44) }}
                  >
                    {/* Lueur dorée brève au moment où le fil atteint l'icône */}
                    {!reducedMotion && (
                      <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute rounded-full"
                        style={{
                          width: iconSize * 1.8,
                          height: iconSize * 1.8,
                          background:
                            'radial-gradient(circle, color-mix(in srgb, var(--color-gold) 55%, transparent) 0%, transparent 70%)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: revealed ? [0, 0.9, 0] : 0 }}
                        transition={{
                          duration: 0.6,
                          delay: activateDelay,
                          times: [0, 0.45, 1],
                          ease: 'easeOut',
                        }}
                      />
                    )}
                    <motion.div
                      className="relative flex items-center justify-center"
                      style={{ width: iconSize, height: iconSize }}
                      initial={reducedMotion ? false : { scale: 0.75, opacity: 0 }}
                      animate={
                        !revealed
                          ? { scale: 0.75, opacity: 0 }
                          : reducedMotion
                            ? { scale: 1, opacity: 1 }
                            : isLast
                              ? { scale: [0.75, 1.08, 1, 1.05, 1], opacity: 1 }
                              : { scale: [0.75, 1.08, 1], opacity: 1 }
                      }
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : isLast
                            ? {
                                duration: ICON_ACTIVATE_DURATION + 0.5,
                                delay: activateDelay,
                                times: [0, 0.32, 0.5, 0.75, 1],
                                ease: EASE_OUT,
                              }
                            : { duration: ICON_ACTIVATE_DURATION, delay: activateDelay, ease: EASE_OUT }
                      }
                    >
                      <img
                        src={STAGE_ICONS[index]}
                        alt=""
                        className="h-full w-full object-contain"
                        style={{ filter: 'drop-shadow(0 2px 3px color-mix(in srgb, var(--color-bronze-deep) 35%, transparent))' }}
                        draggable={false}
                      />
                    </motion.div>
                  </div>

                  {/* Contenu du jalon — aligné à droite de l'icône, dans la
                      même colonne pour toutes les étapes. */}
                  {isLast ? (
                    <motion.div
                      className="relative flex-1 pb-2 pt-1"
                      variants={textContainer}
                      custom={activateDelay + ICON_ACTIVATE_DURATION + 0.15}
                      initial="hidden"
                      animate={revealed ? 'visible' : 'hidden'}
                    >
                      {/* Date + titre — enveloppe relative pour les cœurs magiques,
                          positionnés autour du bloc, jamais sur les lettres. */}
                      <div className="relative">
                        {!reducedMotion && (
                          <MagicHearts active={revealed} startDelay={activateDelay + ICON_ACTIVATE_DURATION + 0.6} />
                        )}
                        <motion.div
                          variants={textItem}
                          className="relative font-display timeline-final-date"
                          style={{
                            fontSize: 'var(--text-final-date)',
                            fontWeight: 500,
                            color: 'var(--color-ink-900)',
                            width: 'max-content',
                            maxWidth: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {FINAL_DATE_FULL}
                        </motion.div>
                        <motion.div
                          variants={textItem}
                          className="relative mt-1 font-script"
                          style={{ fontSize: 'var(--text-final-title)', lineHeight: 1.2, color: 'var(--color-bordeaux)' }}
                        >
                          {milestone.title}
                        </motion.div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex-1 pb-1 pt-1"
                      variants={textContainer}
                      custom={activateDelay + ICON_ACTIVATE_DURATION * 0.6}
                      initial="hidden"
                      animate={revealed ? 'visible' : 'hidden'}
                    >
                      <motion.div
                        variants={textItem}
                        className="font-display text-accent-strong"
                        style={{ fontSize: 'var(--text-timeline-date)', fontWeight: 500 }}
                      >
                        {milestone.dateLabel}
                      </motion.div>
                      <motion.div
                        variants={textItem}
                        className="mt-1 font-sans text-ink-800"
                        style={{
                          fontSize: 'var(--text-timeline-title)',
                          fontWeight: 500,
                          letterSpacing: '0.02em',
                          lineHeight: 1.4,
                        }}
                      >
                        {milestone.title}
                      </motion.div>
                    </motion.div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </PaperCard>
  )
}
