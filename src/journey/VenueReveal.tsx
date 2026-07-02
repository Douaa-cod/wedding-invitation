import type { RefObject } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/motion/useReducedMotion'

export interface VenueRevealProps {
  rootRef?: RefObject<HTMLDivElement | null>
  venueName?: string
  cityLabel?: string
  /** Branche l'illustration aquarelle réelle (Brand Book section 09) quand elle existera. */
  imageSrc?: string
  className?: string
}

const BASE_Y = 360

function archPath(x: number, width: number, height: number, inset = 0): string {
  const w = width - inset * 2
  const h = height - inset
  const left = x + inset
  const top = BASE_Y - h + w / 2
  return `M${left} ${BASE_Y} V${top} A${w / 2} ${w / 2} 0 0 1 ${left + w} ${top} V${BASE_Y} Z`
}

const ARCHES = [
  { x: 195, width: 62, height: 118 },
  { x: 270, width: 66, height: 132 },
  { x: 349, width: 72, height: 158 },
  { x: 434, width: 66, height: 132 },
  { x: 513, width: 62, height: 118 },
]

function PavilionSilhouette({ opacity = 1 }: { opacity?: number }) {
  return (
    <g opacity={opacity}>
      {/* base / terrasse */}
      <path d="M178 332 L622 332 L612 360 L188 360 Z" fill="var(--color-card-white)" />
      {ARCHES.map((arch) => (
        <path key={arch.x} d={archPath(arch.x, arch.width, arch.height)} fill="var(--color-warm-white)" />
      ))}
      {/* lueur intérieure, chaque arche */}
      {ARCHES.map((arch) => (
        <path key={`glow-${arch.x}`} d={archPath(arch.x, arch.width, arch.height, 9)} fill="url(#venue-arch-glow)" />
      ))}
      {/* liseré doré côté soleil couchant */}
      {ARCHES.map((arch) => (
        <path
          key={`rim-${arch.x}`}
          d={archPath(arch.x, arch.width, arch.height)}
          fill="none"
          stroke="var(--color-bronze)"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      ))}
      <path d="M178 332 L622 332 L612 360 L188 360 Z" fill="none" stroke="var(--color-bronze)" strokeOpacity="0.25" strokeWidth="1" />
    </g>
  )
}

function PalmTree({ x, scale = 1, opacity = 0.85 }: { x: number; scale?: number; opacity?: number }) {
  return (
    <g
      transform={`translate(${x},0) scale(${scale})`}
      opacity={opacity}
      fill="none"
      stroke="color-mix(in srgb, var(--color-olive) 55%, var(--color-ink-900))"
      strokeLinecap="round"
    >
      <path d="M0 600 Q -6 480 14 400" strokeWidth="7" />
      {[
        'M14 400 Q -40 380 -78 410',
        'M14 400 Q -34 360 -60 320',
        'M14 400 Q 10 350 6 300',
        'M14 400 Q 50 360 78 330',
        'M14 400 Q 56 388 96 408',
        'M14 400 Q -20 410 -54 442',
      ].map((d) => (
        <path key={d} d={d} strokeWidth="5" />
      ))}
    </g>
  )
}

/**
 * Brand Book section 11 "La Perle du Lac" — composition peinte multicouche en
 * attendant l'illustration aquarelle commandée (section 09). Ciel à l'heure dorée,
 * arcade méditerranéenne avec lueur intérieure, reflet sur l'eau, palmiers en
 * contre-jour au premier plan, vignette et grain papier dédié.
 */
export function VenueReveal({
  rootRef,
  venueName = 'La Perle du Lac',
  cityLabel = 'Tunis',
  imageSrc,
  className,
}: VenueRevealProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div ref={rootRef} className={cn('w-full max-w-[460px]', className)}>
      <div
        className="relative overflow-hidden rounded-lg shadow-card"
        style={{ aspectRatio: '4 / 3', boxShadow: '0 28px 56px -28px rgba(80,55,30,0.5)' }}
      >
        {imageSrc ? (
          <img src={imageSrc} alt={venueName} className="h-full w-full object-cover" />
        ) : (
          <svg
            viewBox="0 0 800 600"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label={`${venueName}, illustration de l'architecture méditerranéenne au coucher du soleil`}
          >
            <defs>
              <linearGradient id="venue-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="color-mix(in srgb, var(--color-mediterranean-blue) 22%, var(--color-warm-white))" />
                <stop offset="32%" stopColor="var(--color-warm-white)" />
                <stop offset="62%" stopColor="var(--color-linen)" />
                <stop offset="82%" stopColor="color-mix(in srgb, var(--color-camel) 55%, var(--color-warm-white))" />
                <stop offset="100%" stopColor="color-mix(in srgb, var(--color-bronze) 42%, var(--color-soft-sand))" />
              </linearGradient>
              <radialGradient id="venue-sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="color-mix(in srgb, var(--color-warm-white) 70%, var(--color-camel))" />
                <stop offset="45%" stopColor="var(--color-camel)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--color-camel)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="venue-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="color-mix(in srgb, var(--color-camel) 55%, var(--color-warm-white))" />
                <stop offset="45%" stopColor="var(--color-travertine)" />
                <stop offset="100%" stopColor="color-mix(in srgb, var(--color-bronze) 30%, var(--color-travertine))" />
              </linearGradient>
              <linearGradient id="venue-arch-glow" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--color-camel)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--color-card-white)" stopOpacity="0.05" />
              </linearGradient>
              <radialGradient id="venue-vignette" cx="50%" cy="46%" r="72%">
                <stop offset="60%" stopColor="var(--color-ink-900)" stopOpacity="0" />
                <stop offset="100%" stopColor="var(--color-ink-900)" stopOpacity="0.16" />
              </radialGradient>
              <filter id="venue-blur-soft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" />
              </filter>
              <filter id="venue-blur-strong" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="13" />
              </filter>
            </defs>

            <rect x="0" y="0" width="800" height="600" fill="url(#venue-sky)" />

            <motion.circle
              cx="540"
              cy="352"
              r="92"
              fill="url(#venue-sun)"
              filter="url(#venue-blur-strong)"
              animate={reducedMotion ? undefined : { opacity: [0.85, 1, 0.85] }}
              transition={reducedMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx="540" cy="352" r="30" fill="color-mix(in srgb, var(--color-warm-white) 75%, var(--color-camel))" filter="url(#venue-blur-soft)" />

            <rect x="0" y="320" width="800" height="50" fill="var(--color-linen)" opacity="0.35" filter="url(#venue-blur-strong)" />

            <rect x="0" y="360" width="800" height="240" fill="url(#venue-water)" />

            {/* reflet flouté de l'architecture sur l'eau */}
            <g transform="matrix(1,0,0,-1,0,720)" filter="url(#venue-blur-soft)">
              <PavilionSilhouette opacity={0.3} />
            </g>

            {/* reflet doré du soleil sur l'eau, traînée de paillettes */}
            <g stroke="var(--color-bronze)" strokeLinecap="round" filter="url(#venue-blur-soft)">
              {[
                { x1: 500, x2: 580, y: 392, w: 4, o: 0.55 },
                { x1: 515, x2: 565, y: 408, w: 3, o: 0.4 },
                { x1: 490, x2: 595, y: 426, w: 5, o: 0.35 },
                { x1: 520, x2: 560, y: 446, w: 3, o: 0.3 },
                { x1: 480, x2: 605, y: 470, w: 6, o: 0.28 },
                { x1: 505, x2: 575, y: 498, w: 4, o: 0.22 },
                { x1: 470, x2: 615, y: 530, w: 7, o: 0.18 },
              ].map((s, i) => (
                <motion.line
                  key={i}
                  x1={s.x1}
                  x2={s.x2}
                  y1={s.y}
                  y2={s.y}
                  strokeWidth={s.w}
                  strokeOpacity={s.o}
                  animate={reducedMotion ? undefined : { strokeOpacity: [s.o, s.o * 0.5, s.o] }}
                  transition={
                    reducedMotion ? undefined : { duration: 5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }
                  }
                />
              ))}
            </g>

            <PavilionSilhouette />

            {/* palmiers en contre-jour, premier plan */}
            <PalmTree x={36} scale={1.5} opacity={0.92} />
            <PalmTree x={742} scale={1.05} opacity={0.78} />

            {/* ligne de terrasse, premier plan immédiat */}
            <rect x="0" y="582" width="800" height="18" fill="var(--color-ink-900)" opacity="0.06" />

            <rect x="0" y="0" width="800" height="600" fill="url(#venue-vignette)" />
          </svg>
        )}

        <div className="material-paper-grain" />

        {/* fins repères dorés aux coins, comme un cadre de papeterie */}
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
          <span key={pos} className={cn('absolute h-1.25 w-1.25 rotate-45 bg-divider', pos)} />
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-1.5 text-center">
        <span className="font-accent text-xl italic text-ink-700">{venueName}</span>
        <span className="font-sans text-label-xs uppercase tracking-widest text-text-subtle">
          {cityLabel}
        </span>
      </div>
    </div>
  )
}
