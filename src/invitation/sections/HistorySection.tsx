import { motion } from 'framer-motion'
import { PaperCard } from '../PaperCard'
import { timelineMilestones } from '@/data/wedding'
import { cn } from '@/lib/cn'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function HistorySection() {
  return (
    <PaperCard eyebrow="Notre histoire" title="Notre chemin">
      <ul className="flex flex-col gap-5">
        {timelineMilestones.map((milestone, index) => (
          <motion.li
            key={milestone.title}
            className="flex gap-3"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.12 + index * 0.17,
              ease: EASE,
            }}
          >
            {/* Indicateur de timeline */}
            <div className="flex flex-col items-center">
              {milestone.highlight ? (
                /* Grand jour — point doré plus grand avec lueur */
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                  style={{ boxShadow: '0 0 0 3px rgba(166,124,82,0.2), 0 0 10px rgba(166,124,82,0.25)' }}
                />
              ) : (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              )}
              {index < timelineMilestones.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-border" />
              )}
            </div>

            {/* Contenu du jalon */}
            {milestone.highlight ? (
              /* ─── Le grand jour — traitement spécial ─── */
              <div className="pb-2 pt-0.5">
                {/* Date avec ornements dorés */}
                <div className="flex items-center gap-1.5">
                  <span style={{ color: 'var(--color-gold)', fontSize: '0.65rem' }}>✦</span>
                  <span className="font-sans text-label-2xs uppercase tracking-wider text-accent-strong">
                    {milestone.dateLabel}
                  </span>
                  <span style={{ color: 'var(--color-gold)', fontSize: '0.65rem' }}>✦</span>
                </div>
                {/* Titre agrandi */}
                <div
                  className="mt-1.5 font-display text-ink"
                  style={{ fontSize: 'clamp(1.125rem, 4vw, 1.325rem)', lineHeight: 1.2, fontWeight: 400 }}
                >
                  {milestone.title}
                </div>
                {/* Petit filet doré */}
                <div className="mt-2 h-px w-12 bg-divider opacity-70" />
              </div>
            ) : (
              /* ─── Jalon standard ─── */
              <div className="pb-1">
                <div className={cn(
                  'font-sans text-label-2xs uppercase tracking-wide text-accent-strong',
                )}>
                  {milestone.dateLabel}
                </div>
                <div className="mt-1 font-body text-sm text-ink-700">
                  {milestone.title}
                </div>
              </div>
            )}
          </motion.li>
        ))}
      </ul>
    </PaperCard>
  )
}
