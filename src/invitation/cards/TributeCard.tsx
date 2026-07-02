import { CardShell } from '../CardShell'
import { tribute } from '@/data/wedding'

/** 4. Hommage — pensée pour les pères du couple. */
export function TributeCard() {
  return (
    <CardShell eyebrow={tribute.eyebrow} title={tribute.title} index="04 / 07">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="font-accent text-sm italic leading-relaxed text-ink-700">{tribute.message}</p>
        <p className="font-body text-xs leading-relaxed text-text-faint">{tribute.footnote}</p>
        <span className="mt-auto font-accent text-xl text-divider">&#10022;</span>
      </div>
    </CardShell>
  )
}
