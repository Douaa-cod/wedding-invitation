import type { Variants } from 'framer-motion'

/** Courbe "ease-out, décélération naturelle" du Brand Book (section 15, "Principes"). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** Décélération longue, type "expo-out" — révélations lentes et cinématographiques. */
export const EASE_LUXE = [0.16, 1, 0.3, 1] as const

/** Ressort doux — objets physiques (rabat d'enveloppe, cartes), inertie naturelle. */
export const SPRING_GENTLE = { type: 'spring', stiffness: 110, damping: 15, mass: 1.1 } as const

/** Ressort plus lent/feutré — réservé aux grands mouvements de scène. */
export const SPRING_SLOW = { type: 'spring', stiffness: 60, damping: 16, mass: 1.4 } as const

/** Entrée/sortie premium (600-900ms) — utilisée pour la transition Opening → Invitation. */
export const fadeScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.5, ease: EASE_OUT } },
}
