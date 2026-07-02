import type { RefObject } from 'react'

// Géométrie identique à motifs/FlightPath (dupliquée volontairement : ce composant
// expose des refs pour être piloté par GSAP, motifs/FlightPath reste la référence
// statique inchangée du Design System).
const ROUTE_PATH_D = 'M60 170 Q 280 -10 500 90'
const ROUTE_FROM = { x: 60, y: 170 }
const ROUTE_TO = { x: 500, y: 90 }
const PLANE_ICON_D =
  'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'

export interface FlightPathRevealProps {
  svgRef: RefObject<SVGSVGElement | null>
  pathRef: RefObject<SVGPathElement | null>
  planeRef: RefObject<SVGGElement | null>
  fromLabel?: string
  toLabel?: string
  className?: string
}

/**
 * Brand Book section 10 "Avion" — version animable. Le tracé se dessine puis
 * l'avion glisse le long de la courbe (piloté par useOpeningTimeline / GSAP
 * MotionPathPlugin via les refs exposées ici).
 */
export function FlightPathReveal({
  svgRef,
  pathRef,
  planeRef,
  fromLabel = 'PARIS',
  toLabel = 'TUNIS',
  className,
}: FlightPathRevealProps) {
  return (
    <svg ref={svgRef} viewBox="0 0 560 240" fill="none" className={className} aria-hidden="true">
      <path ref={pathRef} d={ROUTE_PATH_D} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />

      <circle cx={ROUTE_FROM.x} cy={ROUTE_FROM.y} r="4.5" fill="currentColor" />
      <circle cx={ROUTE_FROM.x} cy={ROUTE_FROM.y} r="11" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx={ROUTE_TO.x} cy={ROUTE_TO.y} r="4.5" fill="currentColor" />
      <circle cx={ROUTE_TO.x} cy={ROUTE_TO.y} r="11" stroke="currentColor" strokeWidth="1" opacity="0.5" />

      {/* Le groupe est positionné/orienté par GSAP MotionPathPlugin (translate géré
         à l'exécution). La rotation interne corrige l'orientation native de l'icône
         (dessinée "nez en haut") pour qu'autoRotate l'aligne sur la tangente. */}
      <g ref={planeRef}>
        <g transform="translate(-12,-12) rotate(90,12,12) scale(1.4)">
          <path d={PLANE_ICON_D} fill="currentColor" />
        </g>
      </g>

      <text x={ROUTE_FROM.x - 16} y={ROUTE_FROM.y + 30} fontFamily="Montserrat, sans-serif" fontSize="13" letterSpacing="4" fill="currentColor">
        {fromLabel}
      </text>
      <text x={ROUTE_TO.x - 30} y={ROUTE_TO.y + 30} fontFamily="Montserrat, sans-serif" fontSize="13" letterSpacing="4" fill="currentColor">
        {toLabel}
      </text>
    </svg>
  )
}
