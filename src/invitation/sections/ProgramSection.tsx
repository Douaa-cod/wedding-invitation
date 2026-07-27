import { PaperCard } from '../PaperCard'
import { CardSubtitle } from '../CardSubtitle'
import { CardMainTitle } from '../CardMainTitle'
import { Divider, DinnerIcon, MusicNoteIcon, SunsetIcon } from '@/design-system'
import { useRevealOnMount } from '@/motion/useRevealOnMount'
import { programItems } from '@/data/wedding'

/** Une icône par événement, dans le même ordre que `programItems` (cf. data/wedding.ts). */
const PROGRAM_ICONS = [SunsetIcon, DinnerIcon, MusicNoteIcon]

const TIME_COLUMN_WIDTH = 40 // px — compact, aligne tous les horaires sur la même colonne

/* Chronologie (ms) de la révélation — jouée une seule fois après le premier
   rendu (cf. useRevealOnMount) : sous-titre → titre → filet → événements en
   cascade. Plus de fil vertical ni d'éclat associé (supprimés). */
const MAIN_TITLE_DELAY = 100
const DIVIDER_DELAY = 200
const EVENTS_DELAY = 300
const EVENTS_STAGGER = 110 // 100–120ms demandé

export function ProgramSection() {
  const revealed = useRevealOnMount()
  const inClass = revealed ? ' prog-in' : ''

  return (
    <PaperCard id="soiree">
      <div className="flex flex-col items-center gap-4 pb-3 text-center">
        <CardSubtitle className={`prog-title-reveal${inClass}`}>Programme</CardSubtitle>

        <div className={`prog-title-reveal${inClass}`} style={{ animationDelay: `${MAIN_TITLE_DELAY}ms` }}>
          <CardMainTitle>La soirée</CardMainTitle>
        </div>

        <div className={`prog-title-reveal${inClass}`} style={{ animationDelay: `${DIVIDER_DELAY}ms` }}>
          <Divider variant="accent" className="mx-auto" />
        </div>

        {/* Trois événements — espacement généreux entre eux, aucune puce,
            aucune ligne verticale, aucun repère de progression : seulement
            l'horaire, une icône discrète, le titre et la description. */}
        <ul className="flex w-full flex-col gap-7 text-left">
          {programItems.map((item, index) => {
            const Icon = PROGRAM_ICONS[index]
            const delay = EVENTS_DELAY + index * EVENTS_STAGGER

            return (
              <li key={item.time} className="prog-event flex items-start gap-3">
                <div
                  className={`prog-event-reveal${inClass} flex items-start gap-3`}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  <span
                    className="shrink-0 font-display text-sm text-accent-strong"
                    style={{ width: TIME_COLUMN_WIDTH, textAlign: 'right' }}
                  >
                    {item.time}
                  </span>

                  <div className="prog-content min-w-0 flex-1">
                    <div className="flex items-start gap-1.5">
                      <Icon
                        aria-hidden="true"
                        className={`prog-icon-reveal prog-icon-glow${inClass} mt-0.5 h-4 w-4 shrink-0 text-accent-strong`}
                        style={{ animationDelay: `${delay}ms` }}
                      />
                      <span className="font-accent text-sm font-medium leading-snug text-ink">{item.title}</span>
                    </div>
                    <p
                      className="mt-1 font-accent italic font-medium text-ink-800"
                      style={{ fontSize: '0.875rem', lineHeight: 1.55 }}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </PaperCard>
  )
}
