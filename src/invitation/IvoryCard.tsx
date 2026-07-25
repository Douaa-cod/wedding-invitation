import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/cn'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export interface IvoryCardProps {
  /** Ancre stable optionnelle (ex. cible de défilement interne). */
  id?: string
  children: ReactNode
  className?: string
}

/**
 * Carte "papier clair" — fond ivoire/champagne dégradé, sans papier gaufré.
 * Utilisée par "Le lieu" et "Confirmation" : même largeur/alignement
 * extérieur que PaperCard (`w-full`, dans le même conteneur
 * `main.max-w-130.px-3`), même rayon/ombre/bordure dorée pour les deux —
 * une seule déclaration, jamais dupliquée d'une carte à l'autre.
 */
export function IvoryCard({ id, children, className }: IvoryCardProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1.1, ease: EASE }}
      className={cn('relative z-10 w-full overflow-hidden rounded-lg', className)}
      style={{
        background: 'linear-gradient(165deg, var(--color-warm-white) 0%, var(--color-linen) 100%)',
        border: '1px solid color-mix(in srgb, var(--color-gold) 40%, transparent)',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      <div className="px-[12%] py-[9%] text-center">{children}</div>
    </motion.section>
  )
}
