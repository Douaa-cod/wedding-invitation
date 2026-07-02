import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Cadeau" — Brand Book section 12 */
export function GiftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="6" y="12" width="16" height="10" rx="1" />
      <path d="M6 12h16M14 12v10M14 12c-1-3-2-5-4-5a2 2 0 0 0 0 5h4zm0 0c1-3 2-5 4-5a2 2 0 0 1 0 5h-4z" />
    </IconBase>
  )
}
