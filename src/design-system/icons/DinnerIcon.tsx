import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Dîner" — Brand Book section 12 */
export function DinnerIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 5v7M7 5v4a2 2 0 0 0 4 0V5M9 12v11" />
      <path d="M19 5c-2 0-3 3-3 6 0 2 1 3 2 3v9" />
    </IconBase>
  )
}
