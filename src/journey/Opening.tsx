import { useMemo, useRef } from 'react'
import { FlightPathReveal } from './FlightPathReveal'
import { VenueReveal } from './VenueReveal'
import { Envelope } from './Envelope'
import { useOpeningTimeline } from './useOpeningTimeline'

export interface OpeningProps {
  onOpen?: () => void
}

/**
 * Écran d'ouverture du voyage Paris → Tunis (Brand Book storyboard, frames 01-03).
 * Ne gère ni carousel ni cartes : se termine à l'ouverture de l'enveloppe.
 */
export function Opening({ onOpen }: OpeningProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const flightSvgRef = useRef<SVGSVGElement>(null)
  const routePathRef = useRef<SVGPathElement>(null)
  const planeRef = useRef<SVGGElement>(null)
  const venueRef = useRef<HTMLDivElement>(null)
  const envelopeRef = useRef<HTMLDivElement>(null)

  const refs = useMemo(
    () => ({ sceneRef, flightSvgRef, routePathRef, planeRef, venueRef, envelopeRef }),
    [],
  )

  useOpeningTimeline(refs)

  return (
    <div
      ref={sceneRef}
      className="relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden px-6 py-16 sm:gap-14 sm:py-20"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 100%, color-mix(in srgb, var(--color-soft-sand) 45%, transparent) 0%, color-mix(in srgb, var(--color-linen) 30%, transparent) 35%, transparent 70%), var(--color-bg)',
      }}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-12 sm:gap-14">
        <FlightPathReveal
          svgRef={flightSvgRef}
          pathRef={routePathRef}
          planeRef={planeRef}
          className="h-auto w-full max-w-[420px] text-accent sm:max-w-[480px]"
        />

        <VenueReveal rootRef={venueRef} />

        <Envelope rootRef={envelopeRef} onOpen={onOpen} />
      </div>
    </div>
  )
}
