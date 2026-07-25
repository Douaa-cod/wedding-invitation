import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Date" — calendrier délicat, cohérent avec le reste du set. */
export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="7" width="18" height="16" rx="2" />
      <path d="M5 12h18M10 5v4M18 5v4" />
    </IconBase>
  )
}
