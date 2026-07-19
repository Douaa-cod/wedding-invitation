import { useEffect, useState, type RefObject } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { PLANE_PATH } from '../planeIcon'

const CARD_ENTRANCE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export interface FlightJourneyProps {
  /** Conteneur englobant toutes les cartes — sert de référence de scroll (0 = première carte, 1 = dernière). */
  containerRef: RefObject<HTMLDivElement | null>
  /** Le wrapper de la carte 1 — sa hauteur mesurée donne le point de relais exact entre l'entrée et le scroll. */
  card1Ref: RefObject<HTMLDivElement | null>
  /**
   * 'hidden'    — avant le clic sur le sceau, jamais affiché.
   * 'entering'  — la carte 1 remonte : l'avion apparaît à droite et descend
   *               à ses côtés jusqu'au niveau de son bord inférieur.
   * 'scrolling' — carte 1 stabilisée : l'avion continue le même trajet,
   *               piloté par le scroll réel, en partant exactement d'où
   *               l'entrée s'est arrêtée (aucun saut).
   */
  phase: 'hidden' | 'entering' | 'scrolling'
  /** Durée de l'entrée de la carte 1 (déjà mise à l'échelle reduced-motion) — synchronisme exact avec la carte. */
  entranceDuration: number
}

/** Avion — orientation native vers le haut (voir planeIcon.ts) ; +180° pour
 *  pointer vers le bas (descend avec le scroll), jamais vers le haut. */
function PlaneGlyph({ size, extraRotate }: { size: number; extraRotate?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <g transform={`rotate(${180 + (extraRotate ?? 0)} 12 12)`}>
        <path d={PLANE_PATH} fill="var(--color-gold)" stroke="var(--color-bordeaux)" strokeWidth="0.6" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

/**
 * Un unique avion continu : apparaît à droite de la carte 1 dès son entrée,
 * descend à ses côtés jusqu'à son bord inférieur, puis prend le relais du
 * scroll réel sur le reste du parcours (jamais d'animation indépendante).
 * Remonte naturellement si l'invité remonte. Desktop : marge droite des
 * cartes. Mobile : marge de sécurité réduite, sans débordement horizontal.
 */
export function FlightJourney({ containerRef, card1Ref, phase, entranceDuration }: FlightJourneyProps) {
  const reducedMotion = useReducedMotion()
  const [card1Height, setCard1Height] = useState(0)
  const [journeyHeight, setJourneyHeight] = useState(0)

  useEffect(() => {
    function measure() {
      setJourneyHeight(containerRef.current?.offsetHeight ?? 0)
      setCard1Height(card1Ref.current?.offsetHeight ?? 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    if (card1Ref.current) ro.observe(card1Ref.current)
    return () => ro.disconnect()
  }, [containerRef, card1Ref])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  /* Relais exact : au scroll=0 (l'instant même où la carte se stabilise),
     la position vaut card1Height — identique au point d'arrivée de la phase
     d'entrée, donc aucun saut visuel au changement de phase. */
  const scrollTop = useTransform(scrollYProgress, [0, 1], [card1Height, journeyHeight])
  /* Ne s'efface qu'après la dernière carte atteinte, jamais avant. */
  const scrollFade = useTransform(scrollYProgress, [0, 0.02, 0.95, 1], [1, 1, 1, 0])
  const tilt = useTransform(
    scrollYProgress, [0, 0.25, 0.5, 0.75, 1],
    reducedMotion ? [0, 0, 0, 0, 0] : [-7, 7, -7, 7, -7],
  )

  if (phase === 'hidden') return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-3 md:-right-12"
      style={{ width: '2px' }}
    >
      {/* Ligne de voyage — pointillée, dorée, discrète, derrière l'avion */}
      <div
        className="absolute inset-y-0 left-1/2"
        style={{
          width: '1px',
          transform: 'translateX(-50%)',
          backgroundImage:
            'repeating-linear-gradient(to bottom, color-mix(in srgb, var(--color-gold) 45%, transparent) 0px, color-mix(in srgb, var(--color-gold) 45%, transparent) 4px, transparent 4px, transparent 11px)',
        }}
      />

      {phase === 'entering' && (
        <motion.div
          initial={{ opacity: 0, top: 0 }}
          animate={{ opacity: 1, top: card1Height }}
          transition={{
            opacity: { duration: 0.3 },
            top: { duration: entranceDuration, ease: CARD_ENTRANCE_EASE },
          }}
          style={{ position: 'absolute', left: '50%' }}
        >
          <div style={{ transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 2px 5px rgba(139,36,54,0.35)) drop-shadow(0 0 7px rgba(194,168,120,0.5))' }}>
            <div className="md:hidden"><PlaneGlyph size={22} /></div>
            <div className="hidden md:block"><PlaneGlyph size={36} /></div>
          </div>
        </motion.div>
      )}

      {phase === 'scrolling' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', top: scrollTop, left: '50%' }}
        >
          <motion.div
            style={{
              opacity: scrollFade,
              rotate: tilt,
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 2px 5px rgba(139,36,54,0.35)) drop-shadow(0 0 7px rgba(194,168,120,0.5))',
            }}
          >
            <div className="md:hidden"><PlaneGlyph size={22} /></div>
            <div className="hidden md:block"><PlaneGlyph size={36} /></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
