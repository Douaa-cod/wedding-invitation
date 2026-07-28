import type { MouseEvent } from 'react'
import { PaperCard } from '../PaperCard'
import { CardSubtitle } from '../CardSubtitle'
import { CardMainTitle } from '../CardMainTitle'
import { ActionLink } from '../ActionLink'
import { ChevronDownIcon } from '../actionIcons'
import { Divider, CalendarIcon, ClockIcon, DinnerIcon, DressCodeIcon, LocationIcon, MusicNoteIcon } from '@/design-system'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { useRevealOnMount } from '@/motion/useRevealOnMount'
import { venueInfo } from '@/data/wedding'

/* Chronologie (ms) de la révélation — jouée une seule fois après le premier
   rendu (cf. useRevealOnMount) : sous-titre → titre → filet → blocs en
   cascade (Lieu / Date+Heure / Dress code / Dîner / Soirée) → action finale. */
const TITLE_DELAY = 100
const DIVIDER_DELAY = 200
const BLOCKS_DELAY = 300
const BLOCKS_STAGGER = 90 // 80–100ms demandé
const BLOCK_REVEAL_DURATION = 600 // durée de info-reveal-in (voir informations-reveal.css)
const BLOCK_COUNT = 5 // Lieu, Date+Heure, Dress code, Dîner, Soirée
const BUTTON_DELAY = BLOCKS_DELAY + (BLOCK_COUNT - 1) * BLOCKS_STAGGER + BLOCK_REVEAL_DURATION + 120

const [lieu, date, heure, dressCode, diner, soiree] = venueInfo

export function VenueSection() {
  const revealed = useRevealOnMount()
  const reducedMotion = useReducedMotion()
  const inClass = revealed ? ' info-in' : ''

  function handleDiscoverClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById('lieu')
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <PaperCard>
      <div className="flex flex-col items-center gap-5 pb-3 text-center">
        <CardSubtitle className={`info-reveal${inClass}`}>Détails</CardSubtitle>

        <div className={`info-reveal${inClass}`} style={{ animationDelay: `${TITLE_DELAY}ms` }}>
          <CardMainTitle>Informations</CardMainTitle>
        </div>

        <div className={`info-reveal${inClass}`} style={{ animationDelay: `${DIVIDER_DELAY}ms` }}>
          <Divider variant="accent" className="mx-auto" />
        </div>

        <div className="flex w-full flex-col gap-5 text-left">
          {/* Lieu — seul, pleine largeur (valeur potentiellement longue) */}
          <div className={`info-reveal${inClass}`} style={{ animationDelay: `${BLOCKS_DELAY}ms` }}>
            <div className="flex items-center gap-1.5">
              <LocationIcon
                className={`info-icon-glow${inClass} h-4 w-4 shrink-0 font-semibold text-accent-strong`}
                style={{ animationDelay: `${BLOCKS_DELAY}ms` }}
              />
              <span className="font-sans text-label-2xs uppercase tracking-wide font-semibold text-accent-strong">{lieu.label}</span>
            </div>
            <p className="mt-1 font-accent text-sm leading-snug text-ink">{lieu.value}</p>
          </div>

          {/* Date + Heure — même ligne, toujours (repli 1 colonne réservé aux
              largeurs vraiment extrêmes, cf. informations-reveal.css) */}
          <div
            className={`info-reveal${inClass}`}
            style={{ animationDelay: `${BLOCKS_DELAY + BLOCKS_STAGGER}ms` }}
          >
            <div className="info-datetime-container">
              <div className="info-datetime-grid">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon
                      className={`info-icon-glow${inClass} h-4 w-4 shrink-0 font-semibold text-accent-strong`}
                      style={{ animationDelay: `${BLOCKS_DELAY + BLOCKS_STAGGER}ms` }}
                    />
                    <span className="font-sans text-label-2xs uppercase tracking-wide font-semibold text-accent-strong">{date.label}</span>
                  </div>
                  <p className="mt-1 font-accent text-sm leading-snug text-ink">{date.value}</p>
                </div>
                <div className="info-datetime-divider">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon
                      className={`info-icon-glow${inClass} h-4 w-4 shrink-0 font-semibold text-accent-strong`}
                      style={{ animationDelay: `${BLOCKS_DELAY + BLOCKS_STAGGER}ms` }}
                    />
                    <span className="font-sans text-label-2xs uppercase tracking-wide font-semibold text-accent-strong">{heure.label}</span>
                  </div>
                  <p className="mt-1 font-accent text-sm leading-snug text-ink">{heure.value}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dress code */}
          <div
            className={`info-reveal${inClass}`}
            style={{ animationDelay: `${BLOCKS_DELAY + 2 * BLOCKS_STAGGER}ms` }}
          >
            <div className="flex items-center gap-1.5">
              <DressCodeIcon
                className={`info-icon-glow${inClass} h-4 w-4 shrink-0 text-accent-strong`}
                style={{ animationDelay: `${BLOCKS_DELAY + 2 * BLOCKS_STAGGER}ms` }}
              />
              <span className="font-sans text-label-2xs uppercase tracking-wide font-semibold text-accent-strong">{dressCode.label}</span>
            </div>
            <p className="mt-1 font-accent text-sm leading-snug text-ink">{dressCode.value}</p>
          </div>

          {/* Soirée */}
          <div
            className={`info-reveal${inClass}`}
            style={{ animationDelay: `${BLOCKS_DELAY + 4 * BLOCKS_STAGGER}ms` }}
          >
            <div className="flex items-center gap-1.5">
              <MusicNoteIcon
                className={`info-icon-glow${inClass} h-4 w-4 shrink-0 text-accent-strong`}
                style={{ animationDelay: `${BLOCKS_DELAY + 4 * BLOCKS_STAGGER}ms` }}
              />
              <span className="font-sans text-label-2xs uppercase tracking-wide font-semibold text-accent-strong">{soiree.label}</span>
            </div>
            <p className="mt-1 font-accent text-sm leading-snug text-ink">{soiree.value}</p>
          </div>
        </div>

        {/* Action finale — lien simple, même famille visuelle que "Voir
            l'itinéraire" (cf. ActionLink) ; défile jusqu'à la carte séparée
            #lieu (cf. LocationSection). */}
        <ActionLink
          href="#lieu"
          onClick={handleDiscoverClick}
          className={`info-reveal${inClass}`}
          style={{ animationDelay: `${BUTTON_DELAY}ms` }}
        >
          Découvrir le lieu
          <ChevronDownIcon className="transition-transform duration-200 group-hover:translate-y-0.5" />
        </ActionLink>
      </div>
    </PaperCard>
  )
}
