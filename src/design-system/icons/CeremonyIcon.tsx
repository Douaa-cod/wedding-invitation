import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Cérémonie" (alliances) — Brand Book section 12 */
export function CeremonyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="16" r="5.5" />
      <circle cx="17" cy="16" r="5.5" />
      <path d="M9 9.5l2-2.5 2 2.5M15 9.5l2-2.5 2 2.5" />
    </IconBase>
  )
}
