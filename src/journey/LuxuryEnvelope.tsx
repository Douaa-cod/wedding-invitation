import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { EASE_LUXE } from '@/motion/variants'
import { audioManager } from '@/lib/audioManager'

export interface LuxuryEnvelopeProps {
  onOpened: () => void
}

/**
 * Ouverture premium — GSAP, sans flap (problèmes visuels d'alignement supprimés).
 *
 * Couches :
 *   [1] envelope-body.png  — corps ouvert, révélé après le front
 *   [2] lettre (card)      — monte depuis l'intérieur
 *   [3] envelope-front.png — fermée initiale, s'efface au clic
 *   [4] wax-seal.jpeg      — overlay circulaire, visible en idle, tombe au clic
 *
 * Timeline (~900 ms partie visible) :
 *   0.00s — seal tombe (0.45s)
 *   0.00s — front s'efface / body apparaît (0.50s)
 *   0.25s — lettre monte (0.55s)
 *   0.80s — lettre prend tout l'espace + body s'efface → onOpened
 *
 * Audio : démarre au premier tap (sans autoplay).
 * Si public/assets/audio/background-music.mp3 est absent, aucun plantage.
 */
export function LuxuryEnvelope({ onOpened }: LuxuryEnvelopeProps) {
  const reducedMotion = useReducedMotion()

  const bodyRef    = useRef<HTMLImageElement>(null)
  const letterRef  = useRef<HTMLDivElement>(null)
  const frontRef   = useRef<HTMLImageElement>(null)
  const sealRef    = useRef<HTMLDivElement>(null)
  const hintRef    = useRef<HTMLParagraphElement>(null)
  const envRef     = useRef<HTMLDivElement>(null)
  const pulseRef   = useRef<gsap.core.Tween | null>(null)
  const clickedRef = useRef(false)

  useLayoutEffect(() => {
    new Image().src = '/assets/envelope/envelope-body.png'
    new Image().src = '/assets/cards/background-card.png'

    gsap.set(bodyRef.current,   { opacity: 0 })
    gsap.set(frontRef.current,  { opacity: 1 })
    gsap.set(letterRef.current, { y: '68%', opacity: 0, scale: 0.95 })
    gsap.set(sealRef.current,   { opacity: 0, scale: 1, y: 0, rotation: 0 })

    /* Respiration très douce sur l'enveloppe (pas le sceau = pas de doublon) */
    if (!reducedMotion) {
      pulseRef.current = gsap.to(envRef.current, {
        scale: 1.012,
        duration: 1.7,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
      })
    }
    return () => { pulseRef.current?.kill() }
  }, [reducedMotion])

  function handleTap() {
    if (clickedRef.current) return
    clickedRef.current = true
    if (reducedMotion) { onOpened(); return }

    /* Arrêt respiration */
    pulseRef.current?.kill()
    gsap.set(envRef.current, { clearProps: 'scale' })

    /* Hint disparaît */
    gsap.to(hintRef.current, { opacity: 0, duration: 0.15 })

    /* Musique de fond — singleton géré par audioManager */
    audioManager.start()

    /* Sceau overlay apparaît et part immédiatement */
    gsap.set(sealRef.current, { opacity: 1 })

    const tl = gsap.timeline()

    /* ── Sceau tombe ── */
    tl.to(sealRef.current, {
      y: 300, rotation: 16, opacity: 0, scale: 0.62,
      duration: 0.45, ease: 'power3.in',
    })

    /* ── front s'efface + body apparaît (concurrent) ── */
    .to(frontRef.current, { opacity: 0, duration: 0.50, ease: 'power2.inOut' }, '<')
    .to(bodyRef.current,  { opacity: 1, duration: 0.40, ease: 'power2.inOut' }, 0.05)

    /* ── Lettre sort du centre ── */
    .to(letterRef.current, {
      y: '0%', opacity: 1, scale: 1,
      duration: 0.55, ease: 'power2.out',
    }, 0.25)

    /* ── Transition directe vers l'invitation (pas de pause bloquée) ── */
    .to(letterRef.current, {
      y: '-32%', scale: 1.07,
      duration: 0.80, ease: 'expo.out',
    }, 0.82)
    .to([bodyRef.current], {
      opacity: 0, filter: 'blur(10px)',
      duration: 0.65, ease: 'power2.inOut',
      onComplete: onOpened,
    }, 0.82)
  }

  return (
    <motion.div
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-5 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 90% 80% at 50% 48%, #FBF5EC 0%, #F4E9D6 55%, #EAD9C0 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE_LUXE } }}
      transition={{ duration: 0.6, ease: EASE_LUXE }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 46%, rgba(255,240,215,0.5) 0%, transparent 70%)',
      }} />

      {/* ─── Conteneur enveloppe ─── */}
      <div
        ref={envRef}
        className="relative mx-auto"
        style={{ width: 'min(94vw, 480px)', aspectRatio: '768 / 1376', maxHeight: '94dvh', isolation: 'isolate' }}
      >
        {/* [1] Corps — révélé après disparition du front */}
        <img ref={bodyRef} src="/assets/envelope/envelope-body.png" alt="" aria-hidden="true"
          className="absolute inset-0 h-full w-full" style={{ objectFit: 'contain', zIndex: 1 }} draggable={false} />

        {/* [2] Lettre */}
        <div ref={letterRef} className="absolute overflow-hidden"
          style={{ left: '9%', bottom: '4%', width: '82%', aspectRatio: '848 / 1264',
            zIndex: 2, borderRadius: 10,
            boxShadow: '0 32px 64px rgba(0,0,0,0.38), 0 8px 20px rgba(0,0,0,0.22)' }}
        >
          <img src="/assets/cards/background-card.png" alt="" aria-hidden="true"
            className="absolute inset-0 h-full w-full" style={{ objectFit: 'cover', display: 'block' }} draggable={false} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center"
            style={{ padding: '9% 22%' }}
          >
            <p dir="rtl" lang="ar" className="font-accent text-xs"
              style={{ color: 'var(--color-bronze)', letterSpacing: '0.04em', lineHeight: 1.9 }}>
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <div className="h-px w-7 bg-divider" />
            <p className="font-sans text-label-2xs uppercase tracking-widest text-dusk-sky">
              Vous êtes invité(e)s au mariage de
            </p>
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-display text-ink" style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)' }}>Rachid Oussaih</span>
              <span className="font-accent italic" style={{ fontSize: 'clamp(1.1rem, 4.5vw, 1.5rem)', color: 'var(--color-gold)' }}>&amp;</span>
              <span className="font-display text-ink" style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)' }}>Douaa Yazidi</span>
            </div>
            <div className="h-px w-7 bg-divider" />
            <time dateTime="2026-11-14" className="font-display font-normal text-ink"
              style={{ fontSize: 'clamp(1.4rem, 5.5vw, 1.9rem)', lineHeight: 1.05 }}>
              14 Novembre<br />2026
            </time>
            <div className="flex flex-col items-center gap-0">
              <span className="font-accent text-xs italic text-ink-700">La Perle du Lac</span>
              <span className="font-sans uppercase tracking-widest text-text-subtle" style={{ fontSize: '0.5rem' }}>Tunis</span>
            </div>
            <p className="font-accent italic text-text-faint" style={{ fontSize: '0.57rem', lineHeight: 1.7, maxWidth: '92%' }}>
              De Tunis à Paris,<br />avec le Maroc dans le cœur,<br />deux familles deviennent une seule histoire.
            </p>
          </div>
        </div>

        {/* [3] Enveloppe fermée initiale */}
        <img ref={frontRef} src="/assets/envelope/envelope-front.png" alt="Enveloppe fermée"
          className="absolute inset-0 h-full w-full" style={{ objectFit: 'contain', zIndex: 3 }} draggable={false} />

        {/* [4] Sceau overlay (opacity:0 en idle, apparaît et tombe au clic) */}
        <div ref={sealRef} aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: '45%', width: '26%', aspectRatio: '1',
          transform: 'translate(-50%, -50%)', zIndex: 4,
          borderRadius: '50%', overflow: 'hidden', pointerEvents: 'none',
        }}>
          <img src="/assets/envelope/wax-seal.jpeg" alt="" style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '168%', height: '168%', transform: 'translate(-50%, -50%)', objectFit: 'cover',
          }} draggable={false} />
        </div>

        {/* [5] Zone de tap */}
        <button type="button" aria-label="Toucher le sceau pour ouvrir l'invitation" onClick={handleTap}
          style={{ position: 'absolute', left: '50%', top: '45%', width: '34%', aspectRatio: '1',
            transform: 'translate(-50%, -50%)', background: 'none', border: 'none',
            cursor: 'pointer', zIndex: 5, borderRadius: '50%' }} />
      </div>

      <p ref={hintRef} className="relative z-10 font-sans text-label-xs uppercase tracking-widest text-ink-400">
        Toucher pour ouvrir
      </p>
    </motion.div>
  )
}
