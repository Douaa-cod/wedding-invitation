import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { couple } from '@/data/wedding'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { EASE_LUXE } from '@/motion/variants'

export interface IntroCardProps {
  onDone: () => void
}

/**
 * Carte d'introduction Paris → Tunis.
 *
 * flight-path.png (1024×1024 RGBA) :
 *   Arc doré pointillé + avion 3D doré positionné à l'apex.
 *   GSAP clipPath : reveal de gauche à droite (sensation de tracé de la ligne).
 *   Suivi d'une légère lévitation de l'image entière.
 *
 * Fond : background-card.png (papier premium).
 * Texte : noms + date + lieu apparaissent en stagger après le vol.
 */
export function IntroCard({ onDone }: IntroCardProps) {
  const reducedMotion = useReducedMotion()
  const flightImgRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return

    const flightEl = flightImgRef.current
    const textEl = textRef.current
    const btnEl = btnRef.current
    if (!flightEl || !textEl || !btnEl) return

    /* État initial */
    gsap.set(flightEl, { clipPath: 'inset(0 100% 0 0)', opacity: 1 })
    gsap.set([textEl, btnEl], { opacity: 0, y: 16 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

      /* 1 — Tracé de la ligne de vol (left → right clip reveal) */
      tl.to(flightEl, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 2.8,
        ease: 'power2.out',
      })

      /* 2 — Légère lévitation de l'avion (loop) */
      .to(flightEl, {
        y: -5,
        duration: 2.2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      }, '+=0.2')

      /* 3 — Texte + bouton en stagger */
      .to(textEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 2.6)
      .to(btnEl,  { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 3.0)
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <motion.div
      className="relative flex min-h-dvh w-full flex-col items-center justify-center gap-6 overflow-hidden px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.5, ease: EASE_LUXE } }}
      transition={{ duration: 0.65, ease: EASE_LUXE }}
    >
      {/* Fond : background-card.png plein écran */}
      <img
        src="/assets/cards/background-card.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: 'cover', display: 'block' }}
        draggable={false}
      />

      {/* Voile très léger pour le texte */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'rgba(249,244,236,0.18)' }}
      />

      {/* Image de trajet Paris → Tunis */}
      <div className="relative z-10 w-full max-w-70">
        {/* Labels de villes */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <span
            className="absolute font-sans uppercase tracking-widest text-text-muted"
            style={{ fontSize: '0.75rem', left: '4%', bottom: '10%' }}
          >
            Paris
          </span>
          <span
            className="absolute font-sans uppercase tracking-widest text-text-muted"
            style={{ fontSize: '0.75rem', right: '3%', bottom: '10%' }}
          >
            Tunis
          </span>
        </div>

        {/* flight-path.png — GSAP clip-path reveal */}
        <img
          ref={flightImgRef}
          src="/assets/flight/flight-path.png"
          alt="Trajet Paris → Tunis"
          className="h-auto w-full"
          style={{
            objectFit: 'contain',
            display: 'block',
            opacity: reducedMotion ? 1 : 0,
          }}
          draggable={false}
        />
      </div>

      {/* Identité — apparaît après le vol */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-center gap-2 text-center"
        style={{ opacity: reducedMotion ? 1 : 0 }}
      >
        <p className="font-display text-ink" style={{ fontSize: 'clamp(1.625rem, 6.2vw, 2.325rem)', lineHeight: 1.1 }}>
          {couple.brideFirstName}{' '}
          <em className="font-normal italic" style={{ color: 'var(--color-gold)' }}>&amp;</em>{' '}
          {couple.groomFirstName}
        </p>
        <div className="h-px w-8 bg-divider" />
        <span className="font-sans text-label-xs uppercase tracking-widest text-text">
          {couple.dateLabel}
        </span>
        <span className="font-accent text-sm italic text-text-muted">
          {couple.venueName} &middot; {couple.cityLabel}
        </span>
      </div>

      <button
        ref={btnRef}
        type="button"
        onClick={onDone}
        className="relative z-10 flex min-h-(--size-tap-min) items-center font-sans text-label-xs uppercase tracking-widest text-accent-strong transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
        style={{ opacity: reducedMotion ? 1 : 0 }}
      >
        Découvrir l'invitation →
      </button>
    </motion.div>
  )
}
