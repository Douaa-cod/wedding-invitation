import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    done: diff === 0,
  }
}

function useCountdown(target: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1_000)
    return () => clearInterval(id)
  }, [target])

  return timeLeft
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export interface CountdownTimerProps {
  target: Date
  /** compact : une seule ligne "88j 12h 34m 05s" ; full : 4 blocs empilés */
  variant?: 'compact' | 'full'
  className?: string
}

/**
 * Compteur avant le mariage — se met à jour chaque seconde.
 * variant="full"    : 4 blocs en grille (cartes d'invitation)
 * variant="compact" : une seule ligne discrète (splash, header)
 */
export function CountdownTimer({ target, variant = 'full', className }: CountdownTimerProps) {
  const { days, hours, minutes, seconds, done } = useCountdown(target)

  if (done) {
    return (
      <p className={className + ' font-accent text-lg italic text-accent'}>
        C'est le grand jour&nbsp;! ✦
      </p>
    )
  }

  if (variant === 'compact') {
    return (
      <p className={className}>
        <span className="font-sans text-label-xs uppercase tracking-widest">
          {days}j &bull; {pad(hours)}h &bull; {pad(minutes)}m &bull; {pad(seconds)}s
        </span>
      </p>
    )
  }

  const units = [
    { value: pad(days), label: 'Jours' },
    { value: pad(hours), label: 'Heures' },
    { value: pad(minutes), label: 'Min' },
    { value: pad(seconds), label: 'Sec' },
  ]

  return (
    <div className={`grid grid-cols-4 gap-2 ${className ?? ''}`}>
      {units.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span className="font-display text-2xl leading-none text-ink sm:text-3xl">{value}</span>
          <span className="font-sans text-label-2xs uppercase tracking-widest text-text-subtle">
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
