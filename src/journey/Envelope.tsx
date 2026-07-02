import { useState, type RefObject } from 'react'
import { motion } from 'framer-motion'
import { Monogram, WaxSeal } from '@/motifs'
import { Divider } from '@/design-system'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { SPRING_GENTLE, EASE_LUXE } from '@/motion/variants'

export interface EnvelopeProps {
  rootRef?: RefObject<HTMLDivElement | null>
  brideName?: string
  groomName?: string
  dateLabel?: string
  venueLabel?: string
  /** Appelé une fois la séquence d'ouverture (sceau, rabat, carte) terminée. */
  onOpen?: () => void
  className?: string
}

const RIPPLE_DELAYS = [0, 0.55, 1.1] as const

/**
 * L'enveloppe comme objet physique — sceau bordeaux, papier ivoire texturé,
 * ondulations concentriques ("tap to open"), rabat avec ressort, carte qui glisse.
 */
export function Envelope({
  rootRef,
  brideName = 'Douaa Yazidi',
  groomName = 'Rachid Oussaih',
  dateLabel = '14 novembre 2026',
  venueLabel = 'La Perle du Lac, Tunis',
  onOpen,
  className,
}: EnvelopeProps) {
  const [opened, setOpened] = useState(false)
  const [cardRevealed, setCardRevealed] = useState(false)
  const reducedMotion = useReducedMotion()

  function handleOpen() {
    if (opened) return
    setOpened(true)
    if (reducedMotion) {
      setCardRevealed(true)
      onOpen?.()
    }
  }

  return (
    <div ref={rootRef} className={cn('relative mx-auto w-full max-w-90 pt-10', className)}>
      {/* ombre portée au sol */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 rounded-full blur-md"
        style={{
          bottom: '-16px',
          width: '76%',
          height: '20px',
          background:
            'radial-gradient(closest-side, color-mix(in srgb, var(--color-ink-900) 28%, transparent), transparent)',
        }}
      />

      <div className="relative" style={{ aspectRatio: '3 / 2' }}>
        {/* feuillet suggestif dessous */}
        <div
          aria-hidden="true"
          className="material-linen absolute inset-x-2 -bottom-1.5 top-1.5 rounded-lg opacity-70"
        />

        {/* carte qui glisse hors de l'enveloppe */}
        <motion.div
          aria-hidden="true"
          className="material-ivory-paper absolute inset-x-8 z-10 flex flex-col items-center justify-center gap-2 rounded-md border border-accent/16 py-5 shadow-soft"
          style={{ bottom: '8%', height: '88%' }}
          initial={false}
          animate={cardRevealed ? { y: '-74%', opacity: 1, scale: 1 } : { y: '0%', opacity: 0, scale: 0.92 }}
          transition={{ duration: reducedMotion ? 0 : 0.85, ease: EASE_LUXE }}
          onAnimationComplete={() => {
            if (cardRevealed && !reducedMotion) onOpen?.()
          }}
        >
          <Monogram variant="horizontal" size={26} />
          <span className="h-px w-6 bg-divider" />
          <span className="font-sans text-label-2xs uppercase tracking-widest text-text-faint">
            {dateLabel}
          </span>
        </motion.div>

        {/* corps de l'enveloppe */}
        <div
          className="material-cotton-paper absolute inset-0 z-20 overflow-hidden rounded-lg border border-accent/18"
          style={{
            boxShadow:
              '0 2px 5px rgba(80,55,30,0.22), 0 14px 26px -14px rgba(80,55,30,0.4), 0 32px 56px -26px rgba(80,55,30,0.5)',
          }}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2.5 px-8 text-center">
            <span className="font-display text-lg text-ink">
              {brideName} &amp; {groomName}
            </span>
            <Divider variant="accent" />
            <span className="font-sans text-label-xs uppercase tracking-wide text-text-faint">
              {dateLabel}
            </span>
            <span className="font-accent text-sm italic text-text-muted">{venueLabel}</span>
          </div>
        </div>

        {/* rabat */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-30"
          style={{
            height: '54%',
            transformOrigin: 'top center',
            transformPerspective: 700,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
          initial={false}
          animate={{ rotateX: opened ? -158 : 0 }}
          transition={reducedMotion ? { duration: 0 } : SPRING_GENTLE}
          onAnimationComplete={() => {
            if (opened && !cardRevealed && !reducedMotion) setCardRevealed(true)
          }}
        >
          <div
            className="material-cotton-paper h-full w-full"
            style={{
              backgroundImage:
                'linear-gradient(165deg, color-mix(in srgb, var(--color-card-white) 92%, transparent) 0%, color-mix(in srgb, var(--color-linen) 88%, transparent) 75%)',
              boxShadow: '0 8px 16px rgba(80,55,30,0.2)',
            }}
          />
          <svg
            viewBox="0 0 100 54"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <polygon
              points="0,0 100,0 50,54"
              fill="none"
              stroke="var(--color-bordeaux)"
              strokeOpacity="0.28"
              strokeWidth="0.7"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </motion.div>

        {/* ondulations concentriques "tap to open" — derrière le sceau, z-[38] */}
        {!opened && !reducedMotion && RIPPLE_DELAYS.map((delay) => (
          <motion.span
            key={delay}
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-[38] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: 88, height: 88, border: '1.5px solid var(--color-bordeaux)' }}
            animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
            transition={{ duration: 2.6, delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}

        {/* anneau de lumière bordeaux en rotation lente */}
        {!reducedMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-[39] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 108,
              height: 108,
              background:
                'conic-gradient(from 0deg, transparent 0%, color-mix(in srgb, var(--color-bordeaux) 45%, transparent) 8%, transparent 18%, transparent 100%)',
              animation: 'envelope-seal-glint 9s linear infinite',
            }}
          />
        )}

        <button
          type="button"
          aria-label="Ouvrir l'invitation"
          disabled={opened}
          onClick={handleOpen}
          className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bordeaux disabled:cursor-default"
        >
          <motion.div
            animate={
              opened
                ? { scale: [1, 1.18, 0.35], rotate: -22, y: -30, opacity: 0 }
                : { scale: reducedMotion ? 1 : [1, 1.05, 1] }
            }
            transition={
              opened
                ? { duration: 0.65, ease: [0.34, 1.15, 0.64, 1], times: [0, 0.35, 1] }
                : reducedMotion
                  ? { duration: 0 }
                  : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            }
            whileHover={!opened ? { scale: 1.06 } : undefined}
            whileTap={!opened ? { scale: 0.96 } : undefined}
          >
            <WaxSeal size={88} tone="bordeaux" />
          </motion.div>
        </button>
      </div>

      {/* "TOUCHER POUR OUVRIR" — visible uniquement avant ouverture */}
      {!opened && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Divider variant="diamond" className="w-28" />
          <span className="font-sans text-label-xs uppercase tracking-widest text-text-subtle">
            Toucher pour ouvrir
          </span>
        </div>
      )}
    </div>
  )
}
