import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Transport" — Brand Book section 12 */
export function TransportIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 17l1.5-5a2 2 0 0 1 2-1.5h11a2 2 0 0 1 2 1.5L23 17v3h-2M5 17v3h2M5 17h18" />
      <circle cx="8.5" cy="20" r="1.6" />
      <circle cx="19.5" cy="20" r="1.6" />
    </IconBase>
  )
}
