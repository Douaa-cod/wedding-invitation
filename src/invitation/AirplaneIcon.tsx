import { forwardRef, type CSSProperties } from 'react'
import { PLANE_PATH } from './planeIcon'

export interface AirplaneIconProps {
  /** Taille en px — le tracé natif vit dans un viewBox carré 24×24. */
  size?: number
  /** Rotation (deg) autour du centre, en plus de l'orientation native (nez vers le haut). */
  rotation?: number
  className?: string
  style?: CSSProperties
}

/**
 * Icône avion unique — même tracé, remplissage et contour partout dans
 * l'invitation (mini-avion de la route France → Tunisie sur la carte 1,
 * avion continu du parcours de scroll). Ne jamais dupliquer ce SVG ni en
 * recréer un similaire : toujours passer par ce composant, à la taille et
 * rotation voulues.
 */
export const AirplaneIcon = forwardRef<SVGSVGElement, AirplaneIconProps>(function AirplaneIcon(
  { size = 24, rotation = 0, className, style },
  ref,
) {
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <g transform={`rotate(${rotation} 12 12)`}>
        <path
          d={PLANE_PATH}
          fill="var(--color-gold)"
          stroke="var(--color-bordeaux)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
})
