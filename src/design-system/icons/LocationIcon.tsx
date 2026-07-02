import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Lieu" — Brand Book section 12 */
export function LocationIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 25c5-6 7-10 7-13a7 7 0 0 0-14 0c0 3 2 7 7 13z" />
      <circle cx="14" cy="11.5" r="2.6" />
    </IconBase>
  )
}
