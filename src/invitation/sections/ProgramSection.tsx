import { PaperCard } from '../PaperCard'
import { programItems } from '@/data/wedding'

export function ProgramSection() {
  return (
    <PaperCard eyebrow="Programme" title="La soirée">
      <ul className="flex flex-col gap-5">
        {programItems.map((item) => (
          <li key={item.time} className="flex items-start gap-4">
            <span className="w-11 shrink-0 font-display text-base text-accent">{item.time}</span>
            <div>
              <div className="font-body text-sm font-medium text-ink">{item.title}</div>
              {item.subtitle && (
                <div className="mt-0.5 font-accent text-xs italic text-text-faint">{item.subtitle}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </PaperCard>
  )
}
