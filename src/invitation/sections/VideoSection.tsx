import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Section finale "Notre ciel" — vidéo airplane en section immersive. */
export function VideoSection() {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  function handlePlay() {
    setPlaying(true)
    setTimeout(() => {
      videoRef.current?.play()
    }, 50)
  }

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.05, ease: EASE }}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        minHeight: playing ? '56.25vw' : '360px',
        background: 'var(--color-ink-900)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.20), 0 20px 42px rgba(0,0,0,0.30)',
      }}
    >
      {playing ? (
        <video
          ref={videoRef}
          src="/assets/videos/airplane-opening.mp4"
          autoPlay
          muted
          playsInline
          controls
          className="h-full w-full"
          style={{ objectFit: 'cover', display: 'block', minHeight: '56.25vw' }}
        />
      ) : (
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-7 px-10 text-center">
          {/* Halo doré */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, color-mix(in srgb, var(--color-camel) 12%, transparent) 0%, transparent 70%)',
            }}
          />

          <div className="relative flex flex-col items-center gap-4">
            <h2
              className="font-display font-normal text-warm-white"
              style={{ fontSize: 'clamp(1.925rem, 7.2vw, 2.925rem)' }}
            >
              Notre ciel
            </h2>

            <div
              className="h-px w-10"
              style={{ background: 'rgba(194,168,120,0.5)' }}
            />

            <p
              className="max-w-xs font-body text-sm italic leading-relaxed"
              style={{ color: 'rgba(250,247,242,0.65)' }}
            >
              Un avion relie deux villes, deux familles, deux destins.<br />
              Ce ciel nous appartient.
            </p>

            <button
              type="button"
              onClick={handlePlay}
              className="mt-2 rounded-full border px-8 py-3 font-sans text-label-sm uppercase tracking-wide transition-colors"
              style={{
                borderColor: 'rgba(250,247,242,0.28)',
                color: 'rgba(250,247,242,0.82)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(250,247,242,0.55)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(250,247,242,1)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(250,247,242,0.28)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(250,247,242,0.82)'
              }}
            >
              Voir la scène du ciel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
