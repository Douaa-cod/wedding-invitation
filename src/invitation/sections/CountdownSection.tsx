import { PaperCard } from '../PaperCard'
import { CountdownTimer } from '@/journey/CountdownTimer'
import { weddingDate } from '@/data/wedding'

/** Section dédiée au compte à rebours — après la première carte. */
export function CountdownSection() {
  return (
    <PaperCard>
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="font-sans text-label-xs uppercase tracking-widest text-accent-strong">
          Le compte à rebours
        </p>
        <CountdownTimer target={weddingDate} variant="full" className="w-full" />
        <p className="font-accent text-xs italic text-text-faint">
          jusqu'au 14 novembre 2026
        </p>
      </div>
    </PaperCard>
  )
}
