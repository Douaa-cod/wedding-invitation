import { motion } from 'framer-motion'
import { useReducedMotion } from '@/motion/useReducedMotion'

interface HeartSpec {
  top: string
  left: string
  size: number
  delay: number
  repeatDelay: number
}

/* Huit cœurs, uniquement au-dessus et sur les côtés du nom — jamais en
   dessous ni entre les lettres (jamais l'aspect d'une ponctuation). Tailles
   et délais volontairement irréguliers pour éviter tout effet mécanique.
   Une seule couleur pour tous (demande explicite) : #8b2436 (= --color-bordeaux). */
const HEARTS: HeartSpec[] = [
  { top: '-16%', left: '2%',   size: 12, delay: 0.0, repeatDelay: 4.4 }, // au-dessus, gauche
  { top: '-20%', left: '22%',  size: 9,  delay: 0.5, repeatDelay: 5.2 }, // au-dessus
  { top: '-18%', left: '70%',  size: 8,  delay: 1.0, repeatDelay: 4.7 }, // au-dessus
  { top: '-22%', left: '88%',  size: 11, delay: 1.5, repeatDelay: 5.6 }, // au-dessus, droite
  { top: '42%',  left: '104%', size: 9,  delay: 2.0, repeatDelay: 4.9 }, // côté droit
  { top: '46%',  left: '-14%', size: 10, delay: 0.8, repeatDelay: 5.4 }, // côté gauche
  { top: '30%',  left: '-18%', size: 13, delay: 1.9, repeatDelay: 4.6 }, // côté gauche
  { top: '34%',  left: '108%', size: 10, delay: 2.6, repeatDelay: 5.0 }, // côté droit
]

function HeartGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--color-bordeaux)" aria-hidden="true">
      <path d="M12 21s-7.2-4.4-9.8-9C0.4 7.6 2.6 3.4 6.6 3.4c2 0 3.6 1 5.4 3.2 1.8-2.2 3.4-3.2 5.4-3.2 4 0 6.2 4.2 4.4 8.6-2.6 4.6-9.8 9-9.8 9z" />
    </svg>
  )
}

export interface MagicHeartsProps {
  /** true une fois le nom révélé — démarre l'apparition graduelle des cœurs. */
  active: boolean
  /** Délai avant le tout premier battement, pour laisser le nom se stabiliser d'abord. */
  startDelay?: number
}

/**
 * Petits cœurs magiques, discrets, qui montent et s'effacent en boucle lente
 * autour du nom des mariés — jamais tous en même temps, jamais sur le texte
 * lui-même. Entièrement désactivés sous prefers-reduced-motion (effet
 * purement décoratif).
 */
export function MagicHearts({ active, startDelay = 0 }: MagicHeartsProps) {
  const reducedMotion = useReducedMotion()
  if (reducedMotion) return null

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">
      {HEARTS.map((heart, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: heart.top, left: heart.left }}
          initial={{ opacity: 0, y: 0, scale: 0.7 }}
          animate={
            active
              ? { opacity: [0, 1, 0], y: [0, -12, -16], scale: [0.7, 1, 1] }
              : { opacity: 0 }
          }
          transition={
            active
              ? {
                  duration: 2.4,
                  delay: startDelay + heart.delay,
                  repeat: Infinity,
                  repeatDelay: heart.repeatDelay,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        >
          <HeartGlyph size={heart.size} />
        </motion.div>
      ))}
    </div>
  )
}
