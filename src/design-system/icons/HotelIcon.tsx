import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Hôtel" — Brand Book section 12 */
export function HotelIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 22V10l8-4 8 4v12" />
      <rect x="10" y="15" width="8" height="7" />
      <path d="M6 22h16" />
    </IconBase>
  )
}
