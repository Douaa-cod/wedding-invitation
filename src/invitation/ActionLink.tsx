import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * Lien d'action simple et discret — Découvrir le lieu, Voir l'itinéraire :
 * jamais une capsule, jamais de fond ni de bordure, jamais de soulignement
 * (même au survol/focus). `group` sur l'ancre permet aux icônes enfants de
 * se déplacer légèrement au survol (`group-hover:translate-...`).
 */
const ACTION_LINK_CLASSES =
  'group inline-flex w-fit max-w-full items-center gap-1 px-1 py-2.5 font-sans font-semibold text-accent-strong no-underline transition-colors duration-200 ease-out hover:text-ink-900 hover:no-underline focus-visible:text-ink-900 focus-visible:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux'

const ACTION_LINK_STYLE = { fontSize: '12.5px', letterSpacing: '0.02em' }

export function ActionLink({ className, style, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn(ACTION_LINK_CLASSES, className)} style={{ ...ACTION_LINK_STYLE, ...style }} {...props} />
}

/**
 * Bouton d'action "pilule" — réservé au bouton de soumission (RÉPONDRE) :
 * bordure dorée fine, fond champagne léger, jamais un simple lien de texte.
 */
const ACTION_BUTTON_CLASSES =
  'mx-auto flex min-h-(--size-tap-min) w-fit max-w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-accent-strong/50 bg-accent/5 px-5 py-2.5 font-sans text-label-sm uppercase tracking-wide text-accent-strong transition-all duration-200 ease-out hover:-translate-y-px hover:border-accent-strong/70 hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux disabled:pointer-events-none disabled:opacity-50'

export function ActionButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(ACTION_BUTTON_CLASSES, className)} {...props} />
}
