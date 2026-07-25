import type { SVGProps } from 'react'

/**
 * Petites icônes décoratives partagées par les liens/boutons d'action —
 * même style monoline fin que le reste de l'invitation, toujours
 * `aria-hidden` (purement décoratives). `className` transmis pour permettre
 * un léger déplacement au survol du lien parent (`group-hover:...`).
 */

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

/** Flèche diagonale — "ouvrir l'itinéraire". */
export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  )
}

/** Petit avion de papier — "envoyer la réponse". */
export function SendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z" />
    </svg>
  )
}
