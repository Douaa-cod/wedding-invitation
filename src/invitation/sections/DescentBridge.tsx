import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const PLANE_PATH =
  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'

const EASE_LUXE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Pont de transition entre la carte de couverture et la section suivante.
 * L'avion tourne pour pointer vers le bas et descend au rythme du scroll,
 * guidant le visiteur vers la suite de l'invitation.
 */
export function DescentBridge() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  /* Chemin vertical : se dessine au fil du scroll */
  const lineHeight = useTransform(scrollYProgress, [0, 0.9], ['0%', '100%'])

  /* Avion : descend du haut vers le bas du pont */
  const planeY = useTransform(scrollYProgress, [0, 0.9], [0, 80])

  /* Fade-out élégant quand le pont sort du viewport */
  const bridgeOpacity = useTransform(scrollYProgress, [0.55, 1], [1, 0])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{
        opacity: bridgeOpacity,
        height: '128px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {/* Chemin pointillé vertical — se dessine avec le scroll */}
      <motion.div
        style={{
          height: lineHeight,
          position: 'absolute',
          left: '50%',
          top: 0,
          width: '1px',
          x: '-50%',
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(166,124,82,0.38) 0px, rgba(166,124,82,0.38) 5px, transparent 5px, transparent 13px)',
        }}
      />

      {/* Avion — apparaît après l'animation GSAP (délai 3.7 s),
          pivote pour pointer vers le bas, puis descend avec le scroll */}
      <motion.div
        style={{
          position: 'absolute',
          left: '50%',
          top: 10,
          x: '-50%',
        }}
      >
        <motion.div style={{ y: planeY }}>
          <motion.svg
            initial={{ opacity: 0, rotate: 85 }}
            animate={{ opacity: 0.78, rotate: 180 }}
            transition={{ delay: 3.7, duration: 1.3, ease: EASE_LUXE }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="var(--color-bronze)"
            style={{ display: 'block' }}
          >
            <path d={PLANE_PATH} />
          </motion.svg>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
