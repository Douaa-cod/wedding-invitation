import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface PaperCardProps {
  eyebrow?: string
  title?: string
  children: ReactNode
  className?: string
  /** Si true, le fond est sombre (pour VideoSection). */
  dark?: boolean
  /**
   * Si true, ignore le fondu déclenché au scroll (useInView) et affiche la
   * carte immédiatement — utilisé par CoverSection, dont la révélation est
   * orchestrée par l'extraction hors de l'enveloppe, pas par le scroll.
   */
  skipScrollReveal?: boolean
  /**
   * Verrou supplémentaire combiné à useInView (ET logique) : la carte reste
   * masquée tant que ce flag est false, même déjà dans le viewport. Défaut
   * true — n'affecte aucune carte existante. Utilisé par CountdownSection
   * pour ne jamais apparaître avant la fin de la séquence de la carte 1.
   */
  revealGate?: boolean
  /** Fraction du composant visible avant déclenchement (défaut 0.12, comme avant). */
  revealAmount?: number
  /** Décalage vertical de départ en px (défaut 40, comme avant). */
  revealY?: number
  /** Durée de la révélation en secondes (défaut 1.1, comme avant). */
  revealDuration?: number
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Wrapper de section — scroll-animé, fond background-card.png officiel.
 * Zone sécurisée : px-[20%] py-[7%] pour préserver les ornements floraux
 * (même zone que CardShell, qui consomme le même visuel).
 */
export function PaperCard({
  eyebrow, title, children, className, dark, skipScrollReveal,
  revealGate = true, revealAmount = 0.12, revealY = 40, revealDuration = 1.1,
}: PaperCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: revealAmount })
  const revealed = skipScrollReveal || (isInView && revealGate)

  return (
    <motion.div
      ref={ref}
      initial={skipScrollReveal ? false : { opacity: 0, y: revealY, scale: 0.98 }}
      animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: revealDuration, ease: EASE }}
      /* z-10 — palier "carte" du système de superposition de la page (voir
         FlightJourney, z-30, et le bouton son, z-50 : jamais de valeur
         arbitraire, toujours l'un de ces trois paliers). */
      className={cn('relative z-10 w-full overflow-hidden rounded-2xl', className)}
      style={{
        boxShadow:
          '0 4px 12px rgba(0,0,0,0.10), 0 20px 42px rgba(0,0,0,0.16), 0 48px 80px rgba(0,0,0,0.12)',
      }}
    >
      {!dark && (
        <img
          src="/assets/cards/background-card.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: 'cover', display: 'block' }}
          draggable={false}
        />
      )}

      <div className="relative z-10 px-[20%] py-[7%]">
        {(eyebrow || title) && (
          <div className="mb-5 text-center">
            {eyebrow && (
              <div className="font-sans text-label-xs uppercase tracking-widest text-accent">
                {eyebrow}
              </div>
            )}
            {title && (
              <>
                <div
                  className="mt-2 font-script text-ink"
                  style={{ fontSize: 'clamp(1.75rem, 6.2vw, 2.25rem)', lineHeight: 1.3 }}
                >
                  {title}
                </div>
                <div className="mx-auto mt-2.5 h-px w-7 bg-divider" />
              </>
            )}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  )
}
