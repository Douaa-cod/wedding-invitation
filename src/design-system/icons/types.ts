import type { SVGProps } from 'react'

/**
 * Toutes les icônes du set partagent le même contrat : tracé monoline,
 * sans remplissage, couleur héritée via `currentColor` (piloter avec
 * une classe de couleur Tailwind, ex. `className="text-accent"`).
 */
export type IconProps = SVGProps<SVGSVGElement>
