import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Soirée" — note de musique, cohérent avec le reste du set. */
export function MusicNoteIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M11.5 19.5V8l9-2v9.5" />
      <circle cx="9" cy="19.5" r="2.5" />
      <circle cx="18" cy="17.5" r="2.5" />
    </IconBase>
  )
}
