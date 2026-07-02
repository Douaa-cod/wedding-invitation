import { CardShell } from '../CardShell'
import { timelineMilestones } from '@/data/wedding'
import { cn } from '@/lib/cn'

/** 2. Notre histoire — timeline verticale des jalons du couple. */
export function TimelineCard() {
  return (
    <CardShell eyebrow="Notre histoire" title="Notre chemin" index="02 / 07">
      <ul className="flex flex-1 flex-col gap-5">
        {timelineMilestones.map((milestone, index) => (
          <li key={milestone.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  milestone.highlight ? 'border border-accent bg-card' : 'bg-accent',
                )}
              />
              {index < timelineMilestones.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-border" />
              )}
            </div>
            <div className="pb-1">
              <div className="font-sans text-label-2xs uppercase tracking-wide text-accent">
                {milestone.dateLabel}
              </div>
              <div
                className={cn(
                  'mt-1 font-body text-sm',
                  milestone.highlight ? 'font-medium text-ink' : 'text-ink-700',
                )}
              >
                {milestone.title}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </CardShell>
  )
}
