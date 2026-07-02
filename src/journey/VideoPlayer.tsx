import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { EASE_LUXE } from '@/motion/variants'

export interface VideoPlayerProps {
  src?: string
  onEnd: () => void
}

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  )
}

/**
 * Lecteur vidéo plein écran portrait — ouverture cinématographique.
 * La vidéo démarre automatiquement (muted) après le clic sur le splash.
 * Bouton son discret + bouton skip + barre de progression.
 * prefers-reduced-motion : skip automatique, onEnd appelé immédiatement.
 */
export function VideoPlayer({ src = '/assets/videos/airplane-opening.mp4', onEnd }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const reducedMotion = useReducedMotion()

  /* Si l'utilisateur a demandé moins de mouvement, on saute directement. */
  useEffect(() => {
    if (reducedMotion) {
      onEnd()
    }
  }, [reducedMotion, onEnd])

  function handleTimeUpdate() {
    const video = videoRef.current
    if (!video || !video.duration) return
    setProgress(video.currentTime / video.duration)
  }

  function handleEnded() {
    onEnd()
  }

  function handleError() {
    /* Si la vidéo ne peut pas se charger, on passe directement à l'enveloppe. */
    onEnd()
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  if (reducedMotion) return null

  return (
    <motion.div
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE_LUXE }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        aria-label="Vidéo d'ouverture de l'invitation de mariage Douaa & Rachid"
      />

      {/* dégradé haut — logo / identité */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)' }}
      />

      {/* dégradé bas — boutons */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72), transparent)' }}
      />

      {/* bouton son — haut droite */}
      <button
        type="button"
        aria-label={muted ? 'Activer le son' : 'Couper le son'}
        onClick={toggleMute}
        className="absolute right-5 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        {muted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>

      {/* bouton skip — bas droite */}
      <button
        type="button"
        aria-label="Passer la vidéo"
        onClick={onEnd}
        className="absolute bottom-14 right-5 z-20 flex items-center gap-1.5 font-sans text-label-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white/90"
      >
        Passer
        <span aria-hidden="true" className="text-base leading-none">›</span>
      </button>

      {/* barre de progression — bas de l'écran */}
      <div className="absolute bottom-0 inset-x-0 z-20 h-[2px] bg-white/15">
        <motion.div
          className="h-full origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--color-gold), var(--color-camel))',
            scaleX: progress,
          }}
        />
      </div>
    </motion.div>
  )
}
