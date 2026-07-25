import { IconBase } from './IconBase'
import type { IconProps } from './types'

/** "Dress code" — nœud papillon, cohérent avec le reste du set. */
export function DressCodeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 10.5l7 3.5-7 3.5v-7z" />
      <path d="M22 10.5l-7 3.5 7 3.5v-7z" />
      <circle cx="14" cy="14" r="1.7" />
    </IconBase>
  )
}
