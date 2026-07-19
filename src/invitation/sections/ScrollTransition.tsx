import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/motion/useReducedMotion'

/** Opacité une fois l'instruction dépassée — jamais retirée, seulement estompée. */
const PASSED_OPACITY = 0.55

export interface ScrollTransitionProps {
  /**
   * Verrou externe optionnel. Si fourni, l'instruction reste invisible tant
   * que false, quelle que soit sa position à l'écran — utilisé uniquement
   * après la carte 1, dont la révélation progressive n'est pas un simple
   * scroll-into-view (voir InvitationPage). Omis (true par défaut) pour les
   * instructions suivantes : elles se gèrent alors seules, via leur propre
   * position de défilement.
   */
  visible?: boolean
}

/**
 * Instruction de défilement réutilisable — placée entre chaque paire de
 * cartes (sauf après la dernière). Non interactive : aucun clic n'est requis,
 * la souris comme le tactile fonctionnent nativement. Apparaît en douceur,
 * reste pleinement visible tant qu'elle est entre les deux cartes, s'estompe
 * légèrement une fois dépassée et retrouve sa pleine opacité si l'invité
 * remonte vers elle — jamais retirée définitivement.
 */
export function ScrollTransition({ visible = true }: ScrollTransitionProps) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  /* Progression continue de 0 (apparaît par le bas) à 1 (a quitté par le
     haut) — pilote une opacité qui monte, se maintient, puis s'atténue
     doucement : jamais un simple interrupteur binaire. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.15, 0.55, 1], [0, 1, 1, PASSED_OPACITY])

  /* Sous reduced-motion, pas de courbe continue ni de fondu progressif —
     un simple binaire visible/invisible selon la position réelle. */
  const inView = useInView(ref, { amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-1.5 py-2"
      style={{
        pointerEvents: 'none',
        opacity: reducedMotion ? (visible && inView ? 1 : 0) : (visible ? scrollOpacity : 0),
      }}
    >
      <p className="font-display text-center" style={{
        fontSize: 'clamp(0.9375rem, 3.5vw, 1.0625rem)',
        color: 'var(--color-bordeaux)',
        opacity: 0.9,
      }}>
        <span className="pointer-fine:hidden">Glissez vers le bas pour découvrir la suite</span>
        <span className="hidden pointer-fine:inline">Faites défiler pour découvrir la suite</span>
      </p>

      {/* Courte ligne de voyage verticale — même couleur que le texte et l'icône */}
      <span
        aria-hidden="true"
        className="h-4 w-px"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, color-mix(in srgb, var(--color-bordeaux) 55%, transparent) 0px, color-mix(in srgb, var(--color-bordeaux) 55%, transparent) 3px, transparent 3px, transparent 7px)',
        }}
      />

      <motion.svg
        aria-hidden="true"
        width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-bordeaux)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
        animate={visible && !reducedMotion ? { y: [0, 6, 0], opacity: [0.55, 1, 0.55] } : undefined}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M6 9l6 6 6-6" />
      </motion.svg>
    </motion.div>
  )
}
