import { CardShell } from '../CardShell'
import { programItems } from '@/data/wedding'

/** 3. Programme — déroulé horaire de la soirée. */
export function ProgramCard() {
  return (
    <CardShell eyebrow="Programme" title="La soirée" index="03 / 07">
      <ul className="flex flex-1 flex-col gap-5">
        {programItems.map((item) => (
          <li key={item.time} className="flex items-start gap-4">
            <span className="w-11 shrink-0 font-display text-base text-accent-strong">{item.time}</span>
            <div>
              <div className="font-body text-sm font-medium text-ink">{item.title}</div>
              <div className="mt-0.5 font-accent text-xs italic text-text-faint">{item.subtitle}</div>
            </div>
          </li>
        ))}
      </ul>
    </CardShell>
  )
}
