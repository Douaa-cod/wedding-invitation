/**
 * EnvelopeShape — SVG handcrafted de l'enveloppe fermée.
 *
 * ViewBox 500 × 900 (ratio 5:9, correspond exactement au conteneur du composant).
 * Couches (dos → face) :
 *   1. Corps ivoire + pattern points coton
 *   2. Plis latéraux gauche/droit + pli bas (lignes de pli en X)
 *   3. Botaniques embossés gauche + droite (triple couche : ombre / base / highlight)
 *   4. Bordure périmètre fine + bordure intérieure + coins dorés
 *
 * Le rabat animé (motion.div) et le sceau (WaxSeal) sont positionnés
 * par-dessus ce SVG dans LuxuryEnvelope.tsx — ils ne font pas partie de ce composant.
 */

/* ─────────────────────────────── Botanical data ─────────────────────────── */

/** Tige principale (espace local : 90px large × 840px haut, stem centré ≈ X=55) */
const STEM =
  'M55 0 C48 65 62 120 52 200 C42 285 56 350 46 435 C36 520 50 590 40 675 C30 760 44 815 37 840'

/** Feuilles côté droit (s'ouvrent vers la droite depuis la tige) */
const RIGHT_LEAVES = [
  'M54 42 C66 30 78 35 78 51 C78 67 64 64 54 42',
  'M52 126 C64 114 76 119 76 135 C76 151 62 148 52 126',
  'M53 210 C65 198 77 203 77 219 C77 235 63 232 53 210',
  'M51 293 C63 281 75 286 75 302 C75 318 61 315 51 293',
  'M49 375 C61 363 73 368 73 384 C73 400 59 397 49 375',
  'M47 458 C59 446 71 451 71 467 C71 483 57 480 47 458',
  'M45 540 C57 528 69 533 69 549 C69 565 55 562 45 540',
  'M43 622 C55 610 67 615 67 631 C67 647 53 644 43 622',
  'M41 704 C53 692 65 697 65 713 C65 729 51 726 41 704',
  'M40 787 C52 775 64 780 64 796 C64 812 50 809 40 787',
]

/** Feuilles côté gauche (miroir, décalées verticalement de ≈42px) */
const LEFT_LEAVES = [
  'M53 84 C41 72 29 77 29 93 C29 109 45 106 53 84',
  'M51 168 C39 156 27 161 27 177 C27 193 43 190 51 168',
  'M52 251 C40 239 28 244 28 260 C28 276 44 273 52 251',
  'M50 334 C38 322 26 327 26 343 C26 359 42 356 50 334',
  'M48 417 C36 405 24 410 24 426 C24 442 40 439 48 417',
  'M46 500 C34 488 22 493 22 509 C22 525 38 522 46 500',
  'M44 582 C32 570 20 575 20 591 C20 607 36 604 44 582',
  'M42 664 C30 652 18 657 18 673 C18 689 34 686 42 664',
  'M40 746 C28 734 16 739 16 755 C16 771 32 768 40 746',
  'M38 816 C26 804 14 809 14 825 C14 841 30 838 38 816',
]

/** Fleurs (3 positions : haut, milieu, bas de la tige) */
const FLOWER_CENTERS = [
  { x: 55, y: 0 },
  { x: 46, y: 420 },
  { x: 37, y: 840 },
]

/* 5 pétales précalculés : angles 270°, 342°, 54°, 126°, 198° — rayon 9, r pétale 3.2 */
const PETAL_OFFSETS = [
  { dx: 0, dy: -9 },
  { dx: 8.56, dy: -2.78 },
  { dx: 5.29, dy: 7.28 },
  { dx: -5.29, dy: 7.28 },
  { dx: -8.56, dy: -2.78 },
]

function Flower({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={4.2} />
      {PETAL_OFFSETS.map((p, i) => (
        <circle key={i} cx={x + p.dx} cy={y + p.dy} r={3} />
      ))}
    </g>
  )
}

interface BotanicalLayerProps {
  stroke: string
  strokeOpacity: number
  strokeWidth: number
  dy?: number
}

function BotanicalLayer({ stroke, strokeOpacity, strokeWidth, dy = 0 }: BotanicalLayerProps) {
  return (
    <g
      fill="none"
      stroke={stroke}
      strokeOpacity={strokeOpacity}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      transform={dy !== 0 ? `translate(0,${dy})` : undefined}
    >
      <path d={STEM} />
      {RIGHT_LEAVES.map((d, i) => <path key={`r${i}`} d={d} />)}
      {LEFT_LEAVES.map((d, i) => <path key={`l${i}`} d={d} />)}
      {FLOWER_CENTERS.map((f, i) => <Flower key={i} x={f.x} y={f.y} />)}
    </g>
  )
}

/** Le groupe botanique complet (ombre + base + highlight) dans son espace local. */
function BotanicalColumn() {
  return (
    <g>
      {/* Ombre : légèrement vers le haut, brun chaud très transparent */}
      <BotanicalLayer stroke="rgba(100,72,38,0.09)" strokeOpacity={1} strokeWidth={1.4} dy={-0.7} />
      {/* Base : ton papier lin, opaque */}
      <BotanicalLayer stroke="#E5D8C8" strokeOpacity={0.92} strokeWidth={1.4} />
      {/* Highlight : légèrement vers le bas, blanc semi-transparent */}
      <BotanicalLayer stroke="rgba(255,255,255,0.65)" strokeOpacity={1} strokeWidth={0.9} dy={1.2} />
    </g>
  )
}

/* ─────────────────────────────── Component ─────────────────────────────── */

export interface EnvelopeShapeProps {
  className?: string
}

export function EnvelopeShape({ className }: EnvelopeShapeProps) {
  return (
    <svg
      viewBox="0 0 500 900"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Pattern de points coton — remplace le fond uni */}
        <pattern id="env-cotton" x="0" y="0" width="4.5" height="4.5" patternUnits="userSpaceOnUse">
          <circle cx="1.3" cy="1.3" r="0.48" fill="rgba(156,116,72,0.055)" />
        </pattern>

        {/* Légère variation de tonalité sur les plis */}
        <linearGradient id="flap-side-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EEE5D8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#EEE5D8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="flap-side-grad-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#EEE5D8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#EEE5D8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── Corps ── */}
      <rect x="0" y="0" width="500" height="900" fill="#F9F4EC" rx="0" />
      <rect x="0" y="0" width="500" height="900" fill="url(#env-cotton)" />

      {/* ── Pli bas — triangle inférieur ── */}
      <path d="M0 900 L250 580 L500 900 Z" fill="#EDE4D6" opacity="0.65" />
      {/* lignes de pli bas */}
      <line x1="0" y1="900" x2="250" y2="580" stroke="#C2B09A" strokeWidth="0.9" opacity="0.6" />
      <line x1="500" y1="900" x2="250" y2="580" stroke="#C2B09A" strokeWidth="0.9" opacity="0.6" />
      {/* ombre sous les lignes */}
      <path d="M0 900 L250 580" stroke="rgba(100,72,38,0.1)" strokeWidth="4" strokeLinecap="round" />
      <path d="M500 900 L250 580" stroke="rgba(100,72,38,0.1)" strokeWidth="4" strokeLinecap="round" />

      {/* ── Pli latéral gauche ── */}
      <path d="M0 0 L195 540 L0 900 Z" fill="url(#flap-side-grad)" />
      <line x1="0" y1="0" x2="195" y2="540" stroke="#C2B09A" strokeWidth="0.7" opacity="0.5" />
      <line x1="0" y1="900" x2="195" y2="540" stroke="#C2B09A" strokeWidth="0.7" opacity="0.5" />
      <path d="M0 0 L195 540" stroke="rgba(100,72,38,0.08)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M0 900 L195 540" stroke="rgba(100,72,38,0.08)" strokeWidth="3.5" strokeLinecap="round" />

      {/* ── Pli latéral droit ── */}
      <path d="M500 0 L305 540 L500 900 Z" fill="url(#flap-side-grad-r)" />
      <line x1="500" y1="0" x2="305" y2="540" stroke="#C2B09A" strokeWidth="0.7" opacity="0.5" />
      <line x1="500" y1="900" x2="305" y2="540" stroke="#C2B09A" strokeWidth="0.7" opacity="0.5" />
      <path d="M500 0 L305 540" stroke="rgba(100,72,38,0.08)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M500 900 L305 540" stroke="rgba(100,72,38,0.08)" strokeWidth="3.5" strokeLinecap="round" />

      {/* ── Botaniques gauche ── */}
      <g transform="translate(15, 30)">
        <BotanicalColumn />
      </g>

      {/* ── Botaniques droite (miroir horizontal) ── */}
      <g transform="translate(500, 0) scale(-1, 1)">
        <g transform="translate(15, 30)">
          <BotanicalColumn />
        </g>
      </g>

      {/* ── Bordure extérieure fine ── */}
      <rect
        x="1.5"
        y="1.5"
        width="497"
        height="897"
        fill="none"
        stroke="rgba(162,118,72,0.25)"
        strokeWidth="1.5"
      />
      {/* ── Filet intérieur décoratif ── */}
      <rect
        x="14"
        y="14"
        width="472"
        height="872"
        fill="none"
        stroke="rgba(162,118,72,0.10)"
        strokeWidth="1"
      />

      {/* ── Repères dorés aux coins ── */}
      {[
        [17, 17],
        [483, 17],
        [17, 883],
        [483, 883],
      ].map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx - 3.5}
          y={cy - 3.5}
          width="7"
          height="7"
          fill="rgba(194,168,120,0.65)"
          transform={`rotate(45, ${cx}, ${cy})`}
        />
      ))}
    </svg>
  )
}
