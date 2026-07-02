import type { CSSProperties } from 'react'

export interface GrainOverlayProps {
  /** Coupe la texture sans la démonter du DOM (cf. toggle "paperGrain" du Brand Book). */
  enabled?: boolean
}

/** Overlay de grain de papier, plein écran, fixe — pose la texture sur tout le site. */
export function GrainOverlay({ enabled = true }: GrainOverlayProps) {
  return (
    <div
      className="texture-grain"
      style={{ '--grain-opacity': enabled ? 1 : 0 } as CSSProperties}
      aria-hidden="true"
    />
  )
}
