import { useEffect, useRef, useState, type RefObject } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { AirplaneIcon } from '../AirplaneIcon'

const CARD_ENTRANCE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** En dessous de ce delta (px) entre deux positions de scroll, on ignore le
 *  mouvement — évite que l'avion change de sens sur un tremblement de 1-2px. */
const DIRECTION_THRESHOLD = 6
/** Durée du virage (retournement du nez) — dans la plage demandée 250–400ms. */
const TURN_DURATION = 0.32
const TURN_DURATION_REDUCED = 0.15

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

/** Ombre chaude qui détache l'avion du fond papier, sur toutes les phases. */
const PLANE_SHADOW = 'drop-shadow(0 2px 5px rgba(139,36,54,0.35)) drop-shadow(0 0 7px rgba(194,168,120,0.5))'

/**
 * Un unique avion continu, dans une couche de superposition dédiée (voir
 * z-journey, au-dessus de toutes les cartes — voir InvitationPage) : apparaît
 * à droite de la carte 1 dès son entrée, descend à ses côtés jusqu'à son bord
 * inférieur, puis prend le relais du scroll réel sur le reste du parcours
 * (jamais d'animation indépendante — l'avion ne bouge et ne tourne qu'en
 * réaction au scroll réel). Remonte naturellement si l'invité remonte, le nez
 * pivotant alors vers le haut. Desktop : marge droite des cartes. Mobile :
 * marge de sécurité réduite, sans débordement horizontal.
 */
export function FlightJourney({ containerRef, card1Ref, phase, entranceDuration }: FlightJourneyProps) {
  const reducedMotion = useReducedMotion()
  const [card1Height, setCard1Height] = useState(0)
  const [journeyHeight, setJourneyHeight] = useState(0)
  const [direction, setDirection] = useState<'down' | 'up'>('down')
  const lastScrollYRef = useRef(0)

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

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  /* Sens réel du défilement — comparaison de la position de scroll courante à
     la précédente, avec un seuil pour ignorer les micro-mouvements (tremblement
     tactile, molette fine) : le nez ne bascule que sur une intention réelle. */
  useEffect(() => {
    lastScrollYRef.current = scrollY.get()
    return scrollY.on('change', (y) => {
      const delta = y - lastScrollYRef.current
      if (delta > DIRECTION_THRESHOLD) {
        lastScrollYRef.current = y
        setDirection('down')
      } else if (delta < -DIRECTION_THRESHOLD) {
        lastScrollYRef.current = y
        setDirection('up')
      }
    })
  }, [scrollY])

  /* Relais exact : au scroll=0 (l'instant même où la carte se stabilise),
     la position vaut card1Height — identique au point d'arrivée de la phase
     d'entrée, donc aucun saut visuel au changement de phase. */
  const scrollTop = useTransform(scrollYProgress, [0, 1], [card1Height, journeyHeight])
  /* Ne s'efface qu'après la dernière carte atteinte, jamais avant. */
  const scrollFade = useTransform(scrollYProgress, [0, 0.02, 0.95, 1], [1, 1, 1, 0])

  /* Orientation native du tracé : nez vers le haut (voir planeIcon.ts).
     180° pointe vers le bas (on descend), 0° pointe vers le haut (on remonte)
     — vérifié visuellement, jamais supposé. */
  const rotation = direction === 'down' ? 180 : 0

  if (phase === 'hidden') return null

  return (
    <div
      aria-hidden="true"
      /* z-30 — palier "parcours" du système de superposition de la page :
         au-dessus des cartes (z-10, voir PaperCard) et de leurs fond/ombre/
         décor, en dessous du bouton son fixe (z-50). Toujours l'un de ces
         trois paliers, jamais une valeur arbitraire. */
      className="pointer-events-none absolute inset-y-0 right-3 z-30 md:-right-12"
      style={{ width: '2px' }}
    >
      {/* Ligne de voyage — pointillée, dorée, discrète, derrière l'avion mais
          au-dessus du fond de page (voir z-journey partagé avec l'avion). */}
      <div
        className="absolute inset-y-0 left-1/2"
        style={{
          width: '1px',
          transform: 'translateX(-50%)',
          backgroundImage:
            'repeating-linear-gradient(to bottom, color-mix(in srgb, var(--color-gold) 60%, transparent) 0px, color-mix(in srgb, var(--color-gold) 60%, transparent) 4px, transparent 4px, transparent 11px)',
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
          <div style={{ transform: 'translate(-50%, -50%) rotate(180deg)', filter: PLANE_SHADOW }}>
            <div className="md:hidden"><AirplaneIcon size={22} /></div>
            <div className="hidden md:block"><AirplaneIcon size={36} /></div>
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
          {/* Centre l'icône sur le point d'ancrage (élément statique, non piloté par
              Framer) — la rotation vit sur l'élément enfant ci-dessous, qui pivote
              alors autour de son propre centre, déjà aligné sur le point d'ancrage. */}
          <div style={{ transform: 'translate(-50%, -50%)', filter: PLANE_SHADOW }}>
            <motion.div
              initial={false}
              animate={{ rotate: rotation }}
              transition={{ duration: reducedMotion ? TURN_DURATION_REDUCED : TURN_DURATION, ease: 'easeInOut' }}
              style={{ opacity: scrollFade }}
            >
              <div className="md:hidden"><AirplaneIcon size={22} /></div>
              <div className="hidden md:block"><AirplaneIcon size={36} /></div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
