import type { SVGProps } from 'react'

export interface FlightPathProps extends Omit<SVGProps<SVGSVGElement>, 'fill'> {
  fromLabel?: string
  toLabel?: string
  showLabels?: boolean
  showEndpointRings?: boolean
}

/**
 * La ligne de vol signature — Brand Book section 10 "Avion".
 * Ligne pointillée courbe entre les deux villes, ponctuée d'un avion fin doré.
 * Tracé statique ici ; l'animation de survol (avion qui glisse le long du chemin)
 * sera ajoutée par le composant de parcours `FlightAnimation`, pas ici.
 */
export function FlightPath({
  fromLabel = 'PARIS',
  toLabel = 'TUNIS',
  showLabels = true,
  showEndpointRings = true,
  ...props
}: FlightPathProps) {
  return (
    <svg viewBox="0 0 560 240" fill="none" stroke="currentColor" {...props}>
      <path
        d="M60 170 Q 280 -10 500 90"
        strokeWidth="1.4"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />

      <circle cx="60" cy="170" r="4.5" fill="currentColor" stroke="none" />
      <circle cx="500" cy="90" r="4.5" fill="currentColor" stroke="none" />
      {showEndpointRings && (
        <>
          <circle cx="60" cy="170" r="11" strokeWidth="1" opacity="0.5" />
          <circle cx="500" cy="90" r="11" strokeWidth="1" opacity="0.5" />
        </>
      )}

      <path
        d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        fill="currentColor"
        stroke="none"
        transform="translate(262,42) scale(1.4) rotate(82 12 12)"
      />

      {showLabels && (
        <>
          <text x="44" y="200" fontFamily="Montserrat, sans-serif" fontSize="13" letterSpacing="4" fill="currentColor" stroke="none">
            {fromLabel}
          </text>
          <text x="470" y="120" fontFamily="Montserrat, sans-serif" fontSize="13" letterSpacing="4" fill="currentColor" stroke="none">
            {toLabel}
          </text>
        </>
      )}
    </svg>
  )
}
