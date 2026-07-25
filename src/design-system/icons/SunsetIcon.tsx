import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Accueil au bord du lac" — coucher de soleil sur l'eau, cohérent avec le reste du set. */
export function SunsetIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4.5 20.5h19" />
      <path d="M7.5 20.5a6.5 6.5 0 0 1 13 0" />
      <path d="M14 6.5v3M7 12l2 2M21 12l-2 2" />
    </IconBase>
  )
}
