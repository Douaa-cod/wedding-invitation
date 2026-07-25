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
  /**
   * Révélation "surprise" en cascade (carte Compte à rebours uniquement) :
   * quand fourni, chaque groupe (J/H/MIN/SEC) démarre caché puis apparaît en
   * séquence dès que `revealed` passe à true. Omis (undefined) partout
   * ailleurs → comportement inchangé, aucun état caché. Ignoré en
   * variant="compact".
   */
  revealed?: boolean
  /** Délai avant le premier groupe (ms), défaut 0. */
  revealDelayMs?: number
  /** Écart entre deux groupes consécutifs (ms), défaut 120. */
  revealStaggerMs?: number
}

/**
 * Compteur avant le mariage — se met à jour chaque seconde.
 * variant="full"    : 4 blocs en grille (cartes d'invitation)
 * variant="compact" : une seule ligne discrète (splash, header)
 */
export function CountdownTimer({
  target,
  variant = 'full',
  className,
  revealed,
  revealDelayMs = 0,
  revealStaggerMs = 120,
}: CountdownTimerProps) {
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
    { value: pad(days), label: 'J', wide: true },
    { value: pad(hours), label: 'H' },
    { value: pad(minutes), label: 'MIN' },
    { value: pad(seconds), label: 'SEC' },
  ]

  const showEntrance = revealed !== undefined
  /* Le libellé démarre son propre mouvement juste après le chiffre — deux
     vagues de révélation distinctes, jamais un simple fondu hérité du parent. */
  const LABEL_EXTRA_DELAY = 180

  return (
    <div className={`grid grid-cols-4 gap-1.5 sm:gap-3 ${className ?? ''}`}>
      {units.map(({ value, label, wide }, index) => {
        const delayMs = revealDelayMs + index * revealStaggerMs
        const entranceActive = showEntrance && revealed

        return (
          <div
            key={label}
            className={`flex flex-col items-center gap-1${showEntrance ? ' cd-unit' : ''}${entranceActive ? ' cd-in' : ''}`}
            style={showEntrance ? { animationDelay: `${delayMs}ms` } : undefined}
          >
            {/* tabular-nums + largeur réservée (3 caractères pour les jours, qui
                passeront de 3 à 2 chiffres avec le temps) : la mise en page ne
                bouge jamais quand un chiffre change. */}
            <span
              className={`font-display leading-none text-ink-700${entranceActive ? ' cd-number-glow' : ''}`}
              style={{
                fontSize: 'clamp(1.6rem, 7vw, 2.2rem)',
                fontVariantNumeric: 'tabular-nums',
                minWidth: wide ? '3ch' : '2ch',
                textAlign: 'center',
                ...(entranceActive ? { animationDelay: `${delayMs}ms` } : {}),
              }}
            >
              {value}
            </span>
            <span
              className={`font-sans uppercase tracking-widest text-text-subtle${showEntrance ? ' cd-label' : ''}${entranceActive ? ' cd-in' : ''}`}
              style={{
                fontSize: 'clamp(0.55rem, 2.4vw, 0.6875rem)',
                ...(showEntrance ? { animationDelay: `${delayMs + LABEL_EXTRA_DELAY}ms` } : {}),
              }}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
