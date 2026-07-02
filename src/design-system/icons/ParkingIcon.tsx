import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Parking" — Brand Book section 12 */
export function ParkingIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="6.5" y="7" width="15" height="14" rx="1.5" />
      <path d="M6.5 11h15M14 7v14" />
    </IconBase>
  )
}
