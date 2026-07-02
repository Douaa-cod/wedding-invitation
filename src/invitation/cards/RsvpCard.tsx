import { Button } from '@/design-system'
import { CardShell } from '../CardShell'
import { rsvp } from '@/data/wedding'

/**
 * 7. RSVP — teaser visuel uniquement. Pas de formulaire fonctionnel : le bouton
 * est désactivé pour ne pas suggérer une interaction qui n'existe pas encore.
 */
export function RsvpCard() {
  return (
    <CardShell
      eyebrow={rsvp.eyebrow}
      title={rsvp.title}
      index="07 / 07"
      footer={
        <Button variant="primary" className="w-full justify-center" disabled>
          {rsvp.ctaLabel}
        </Button>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <span className="font-accent text-sm italic text-text-muted">{rsvp.deadlineLabel}</span>
        <p className="font-body text-sm leading-relaxed text-text">{rsvp.message}</p>
      </div>
    </CardShell>
  )
}
