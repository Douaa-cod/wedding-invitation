import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { PaperCard } from '../PaperCard'
import { Divider } from '@/design-system'
import { useReducedMotion } from '@/motion/useReducedMotion'

const PLANE_PATH =
  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'

function FlightPath() {
  const pathRef  = useRef<SVGPathElement>(null)
  const planeRef = useRef<SVGGElement>(null)
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const path  = pathRef.current
    const plane = planeRef.current
    if (!path || !plane) return

    if (reducedMotion) {
      path.style.strokeDasharray = '4 8'
      return
    }

    const len = path.getTotalLength()
    const ctx = gsap.context(() => {
      gsap.set(path,  { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(plane, { opacity: 0 })

      /* Tracé lent, élégant */
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 3.6,
        ease: 'sine.inOut',
        onComplete: () => { path.style.strokeDasharray = '4 8' },
      })
      /* Avion apparaît quand la ligne arrive à sa position */
      gsap.to(plane, { opacity: 1, duration: 0.7, delay: 2.0, ease: 'power2.out' })
    })
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <svg
      viewBox="0 0 320 76"
      fill="none"
      className="mx-auto w-full"
      style={{ maxWidth: '280px' }}
      aria-hidden="true"
    >
      {/* Ligne de vol — plus épaisse, plus présente */}
      <path
        ref={pathRef}
        d="M18 64 Q 160 4 302 64"
        stroke="var(--color-bronze)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Endpoints — plus larges */}
      <circle cx="18"  cy="64" r="3.2" fill="var(--color-bronze)" />
      <circle cx="302" cy="64" r="3.2" fill="var(--color-bronze)" />
      {/* Avion — plus grand, plus visible */}
      <g ref={planeRef} transform="translate(144,16) scale(0.88) rotate(82 12 12)">
        <path d={PLANE_PATH} fill="var(--color-bronze)" />
      </g>
      {/* Labels villes */}
      <text x="8" y="76" fontFamily="Montserrat,sans-serif" fontSize="8" letterSpacing="2.5" fill="var(--color-ink-300)">
        PARIS
      </text>
      <text x="260" y="76" fontFamily="Montserrat,sans-serif" fontSize="8" letterSpacing="2.5" fill="var(--color-ink-300)">
        TUNIS
      </text>
    </svg>
  )
}

/** Section 1 — Carte de couverture. Compteur dans section dédiée. */
export function CoverSection() {
  return (
    <PaperCard>
      <div className="flex flex-col items-center gap-4 text-center">

        <p dir="rtl" lang="ar" className="font-accent text-sm"
          style={{ color: 'var(--color-bronze)', letterSpacing: '0.04em', lineHeight: 1.8 }}>
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>

        <FlightPath />

        <p className="font-sans text-label-xs uppercase tracking-widest text-dusk-sky">
          Vous êtes invité(e)s au mariage de
        </p>

        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-ink"
            style={{ fontSize: 'clamp(1.4rem, 5.5vw, 1.85rem)', lineHeight: 1.15 }}>
            Rachid Oussaih
          </span>
          <span className="font-accent italic"
            style={{ fontSize: 'clamp(1.7rem, 6.5vw, 2.2rem)', color: 'var(--color-gold)', lineHeight: 1 }}>
            &amp;
          </span>
          <span className="font-display text-ink"
            style={{ fontSize: 'clamp(1.4rem, 5.5vw, 1.85rem)', lineHeight: 1.15 }}>
            Douaa Yazidi
          </span>
        </div>

        <Divider variant="accent" />

        <time dateTime="2026-11-14" className="font-display font-normal text-ink"
          style={{ fontSize: 'clamp(2.2rem, 8.5vw, 3.2rem)', lineHeight: 1 }}>
          14 Novembre 2026
        </time>

        <div className="flex flex-col items-center gap-0.5">
          <span className="font-accent text-base italic text-ink-700">La Perle du Lac</span>
          <span className="font-sans text-label-xs uppercase tracking-widest text-text-subtle">Tunis</span>
        </div>

        <Divider variant="diamond" className="w-16" />

        <p className="font-accent italic text-text-faint"
          style={{ fontSize: '0.7rem', lineHeight: 1.8, maxWidth: '88%' }}>
          De Tunis à Paris,<br />
          avec le Maroc dans le cœur,<br />
          deux familles deviennent une seule histoire.
        </p>
      </div>
    </PaperCard>
  )
}
