import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "RSVP" (enveloppe) — Brand Book section 12 */
export function RsvpIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="7.5" width="18" height="13" rx="1.5" />
      <path d="M5.5 9l8.5 6 8.5-6" />
    </IconBase>
  )
}
