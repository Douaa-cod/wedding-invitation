import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/motion/useReducedMotion'

const SCROLL_HIDE_THRESHOLD = 24 // px — au-delà, l'invité a clairement commencé à défiler

export interface ScrollCueProps {
  /** true une fois la première carte stabilisée à sa position finale. */
  visible: boolean
}

/**
 * Instruction de défilement — non interactive, jamais un bouton : aucun clic
 * n'est requis pour continuer, la souris comme le tactile fonctionnent nativement.
 * S'efface dès que l'invité commence à défiler (scroll réel, pas un minuteur).
 */
export function ScrollCue({ visible }: ScrollCueProps) {
  const reducedMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!visible) return
    function handleScroll() {
      if (window.scrollY > SCROLL_HIDE_THRESHOLD) setScrolled(true)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visible])

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible && !scrolled ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.6 }}
      style={{ pointerEvents: 'none' }}
    >
      <p className="font-display text-center" style={{
        fontSize: 'clamp(0.85rem, 3.2vw, 0.9375rem)',
        color: 'var(--color-bordeaux)',
        opacity: 0.85,
      }}>
        <span className="pointer-fine:hidden">Glissez vers le bas pour découvrir la suite</span>
        <span className="hidden pointer-fine:inline">Faites défiler pour découvrir la suite</span>
      </p>

      {/* Courte ligne de voyage verticale */}
      <span
        aria-hidden="true"
        className="h-4 w-px"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, color-mix(in srgb, var(--color-gold) 60%, transparent) 0px, color-mix(in srgb, var(--color-gold) 60%, transparent) 3px, transparent 3px, transparent 7px)',
        }}
      />

      <motion.svg
        aria-hidden="true"
        width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="var(--color-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        animate={visible && !scrolled && !reducedMotion ? { y: [0, 5, 0] } : undefined}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
      >
        <path d="M6 9l6 6 6-6" />
      </motion.svg>
    </motion.div>
  )
}
