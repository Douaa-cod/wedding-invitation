import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Heure" — Brand Book section 12 */
export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="14" cy="14" r="9.5" />
      <path d="M14 8.5V14l4 2.2" />
    </IconBase>
  )
}
