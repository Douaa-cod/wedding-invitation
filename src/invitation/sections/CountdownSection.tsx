import { useEffect, useState } from 'react'
import { PaperCard } from '../PaperCard'
import { Divider } from '@/design-system'
import { CountdownTimer } from '@/journey/CountdownTimer'
import { weddingDate } from '@/data/wedding'

/** Bordeaux doux dédié à la phrase "mois restants" (demande explicite). */
const MONTHS_COLOR = '#8b2436'

/** Mois calendaires complets restants entre deux dates (jamais un simple jours/30). */
function getMonthsLeft(target: Date, now: Date): number {
  let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  if (target.getDate() < now.getDate()) months -= 1
  return Math.max(0, months)
}

/** Se recalcule chaque minute — largement suffisant pour une valeur qui ne
 *  change qu'une fois par mois ; nettoie son intervalle au démontage. */
function useMonthsRemaining(target: Date) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const isDone = target.getTime() <= now.getTime()
  return { months: isDone ? 0 : getMonthsLeft(target, now), isDone }
}

function monthsSentence(months: number, isDone: boolean): string {
  if (isDone) return 'C’est aujourd’hui !'
  if (months <= 0) return 'Le grand jour approche'
  if (months === 1) return 'Plus qu’un mois avant notre grand jour'
  return `Plus que ${months} mois avant notre grand jour`
}

export interface CountdownSectionProps {
  /** true une fois la révélation progressive de la carte 1 (nom, cœurs, instruction de scroll) terminée. */
  readyToReveal?: boolean
}

/** Section dédiée au compte à rebours — après la première carte. Ne se
 *  révèle qu'après la séquence complète de la carte 1 (voir readyToReveal). */
export function CountdownSection({ readyToReveal = true }: CountdownSectionProps) {
  const { months, isDone } = useMonthsRemaining(weddingDate)

  return (
    <PaperCard revealGate={readyToReveal} revealAmount={0.2} revealY={35} revealDuration={0.8}>
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-sans text-label-xs uppercase tracking-wide text-accent-strong">
          Le compte à rebours
        </p>

        <CountdownTimer target={weddingDate} variant="full" className="w-full" />

        <Divider variant="accent" className="mx-auto w-10" />

        <div className="flex flex-col items-center gap-1">
          <p className="font-accent italic" style={{ color: MONTHS_COLOR, fontSize: 'clamp(1rem, 3.6vw, 1.125rem)' }}>
            {monthsSentence(months, isDone)}
          </p>
          <p className="font-accent italic text-ink-700" style={{ fontSize: 'clamp(0.9375rem, 3.2vw, 1.0625rem)' }}>
            jusqu’au 14 novembre 2026
          </p>
        </div>
      </div>
    </PaperCard>
  )
}
