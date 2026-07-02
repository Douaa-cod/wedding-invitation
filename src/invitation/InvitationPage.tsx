import { useState } from 'react'
import { motion } from 'framer-motion'
import { EASE_LUXE } from '@/motion/variants'
import { GrainOverlay } from '@/design-system'
import { audioManager } from '@/lib/audioManager'
import { CoverSection } from './sections/CoverSection'
import { CountdownSection } from './sections/CountdownSection'
import { HistorySection } from './sections/HistorySection'
import { ProgramSection } from './sections/ProgramSection'
import { TributeSection } from './sections/TributeSection'
import { VenueSection } from './sections/VenueSection'
import { GiftSection } from './sections/GiftSection'
import { RSVPSection } from './sections/RSVPSection'
import { PhotoSection } from './sections/PhotoSection'
import { DescentBridge } from './sections/DescentBridge'

/* ─────────────────────────────────────────────────────
   Flèche de défilement — discrète, bounce infini,
   indique à l'invité de continuer à scroller.
───────────────────────────────────────────────────── */
function ScrollArrow() {
  return (
    <div className="flex justify-center py-0.5" aria-hidden="true">
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 0.4,
        }}
        style={{ color: 'var(--color-gold)', opacity: 0.45 }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   Bouton son — fixe en bas à droite
───────────────────────────────────────────────────── */
function SoundOnIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19.5 5a10 10 0 0 1 0 14" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

/**
 * Page d'invitation complète — scroll vertical fluide.
 * Flèches de défilement entre chaque section.
 * VideoSection remplacée par PhotoSection.
 */
export function InvitationPage() {
  const [muted, setMuted] = useState(false)

  function handleToggleSound() {
    const nowMuted = audioManager.toggleMute()
    setMuted(nowMuted)
  }

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: EASE_LUXE }}
    >
      <GrainOverlay />

      {/* Dégradé de fond doux */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 130% 50% at 50% 100%, color-mix(in srgb, var(--color-lake-mid) 10%, transparent) 0%, var(--color-bg) 60%)',
        }}
      />

      {/* Contenu vertical — sections avec flèches entre elles */}
      <main className="mx-auto max-w-130 px-3 pb-16 pt-8">
        <div className="flex flex-col gap-3">
          <CoverSection />
          <DescentBridge />
          <CountdownSection />
          <ScrollArrow />
          <HistorySection />
          <ScrollArrow />
          <ProgramSection />
          <ScrollArrow />
          <VenueSection />
          <ScrollArrow />
          <GiftSection />
          <ScrollArrow />
          <RSVPSection />
          <ScrollArrow />
          <TributeSection />
          <ScrollArrow />
          <PhotoSection />
        </div>
      </main>

      {/* Bouton son — discret, fixe, bas-droit */}
      <button
        type="button"
        aria-label={muted ? 'Activer le son' : 'Couper le son'}
        onClick={handleToggleSound}
        className="fixed bottom-5 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full transition-all"
        style={{
          background: 'color-mix(in srgb, var(--color-warm-white) 85%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-bronze) 28%, transparent)',
          color: muted ? 'var(--color-ink-300)' : 'var(--color-bronze)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        {muted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>
    </motion.div>
  )
}
