import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Voyage" (avion, tracé fin) — Brand Book section 12 */
export function TravelIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 16l19-7-7 14-3-6z" />
    </IconBase>
  )
}
