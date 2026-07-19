import { motion } from 'framer-motion'
import { Monogram } from '@/motifs'
import { Divider } from '@/design-system'
import { couple, culturalPhrase, cultures, weddingDate } from '@/data/wedding'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { EASE_LUXE } from '@/motion/variants'
import { CountdownTimer } from './CountdownTimer'

export interface VideoOpeningProps {
  onStart: () => void
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_LUXE } },
}

/**
 * Écran splash — "nuit sur le lac" avant l'ouverture de l'invitation.
 * Fond lake-deep (bleu nuit méditerranéen), monogramme inverse, phrase
 * culturelle, CTA discret avec pulsation douce.
 */
export function VideoOpening({ onStart }: VideoOpeningProps) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden px-8 py-12 sm:py-16"
      style={{ background: 'var(--color-lake-deep)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.7, ease: EASE_LUXE }}
    >
      {/* halo de lumière du lac en bas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            'radial-gradient(ellipse 120% 60% at 50% 110%, color-mix(in srgb, var(--color-dusk-sky) 35%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* haut — mentions discrètes des trois cultures */}
      <div className="relative z-10 flex w-full items-center justify-center gap-4 sm:gap-8">
        {cultures.map((c, i) => (
          <span key={c.label} className="flex items-center gap-4">
            <span className="text-center">
              <span className="block font-sans text-label-2xs uppercase tracking-widest text-white/40">
                {c.label}
              </span>
            </span>
            {i < cultures.length - 1 && (
              <span className="h-[3px] w-[3px] rotate-45 bg-white/20" />
            )}
          </span>
        ))}
      </div>

      {/* centre — identité principale */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-7 text-center"
        variants={reducedMotion ? undefined : container}
        initial={reducedMotion ? undefined : 'hidden'}
        animate={reducedMotion ? undefined : 'visible'}
      >
        <motion.div variants={reducedMotion ? undefined : item}>
          <Monogram variant="horizontal" size={62} reverse />
        </motion.div>

        <motion.div variants={reducedMotion ? undefined : item}>
          <h1
            className="font-display font-normal text-white"
            style={{ fontSize: 'clamp(2.325rem, 8.2vw, 3.625rem)', lineHeight: 1.06 }}
          >
            {couple.brideFirstName}{' '}
            <em className="font-normal italic" style={{ color: 'var(--color-gold)' }}>
              &amp;
            </em>{' '}
            {couple.groomFirstName}
          </h1>
        </motion.div>

        <motion.div variants={reducedMotion ? undefined : item} className="flex flex-col items-center gap-4">
          <Divider variant="diamond" className="w-48 [&>span.h-px]:bg-white/20 [&>span.rotate-45]:bg-gold" />
          <span className="font-sans text-label-xs uppercase tracking-widest text-white/50">
            {couple.dateLabel}
          </span>
          <span className="font-accent text-base italic text-white/60">
            {couple.venueName} &middot; {couple.cityLabel}
          </span>
        </motion.div>

        <motion.p
          variants={reducedMotion ? undefined : item}
          className="max-w-xs font-accent text-lg italic leading-relaxed text-white/70 sm:max-w-sm"
        >
          &#171;&nbsp;{culturalPhrase}&nbsp;&#187;
        </motion.p>

        {/* compteur compact sur le splash — crée l'anticipation avant d'ouvrir */}
        <motion.div variants={reducedMotion ? undefined : item} className="w-full max-w-xs">
          <CountdownTimer
            target={weddingDate}
            variant="compact"
            className="text-center text-white/70"
          />
        </motion.div>
      </motion.div>

      {/* bas — CTA */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        variants={reducedMotion ? undefined : item}
        initial={reducedMotion ? undefined : 'hidden'}
        animate={reducedMotion ? undefined : 'visible'}
        transition={{ delay: 1.2 }}
      >
        <motion.button
          type="button"
          onClick={onStart}
          className="rounded-full border border-white/30 px-9 py-[14px] font-sans text-label-sm uppercase tracking-wide text-white/90 backdrop-blur-sm transition-colors hover:border-white/55 hover:text-white"
          animate={reducedMotion ? undefined : { scale: [1, 1.04, 1] }}
          transition={reducedMotion ? undefined : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          whileTap={{ scale: 0.97 }}
        >
          Ouvrir l'invitation
        </motion.button>
        <span className="font-sans text-label-2xs uppercase tracking-widest text-white/28">
          Appuyez pour commencer
        </span>
      </motion.div>
    </motion.div>
  )
}
