import { useState, type FormEvent } from 'react'
import { IvoryCard } from '../IvoryCard'
import { CardMainTitle } from '../CardMainTitle'
import { ActionButton } from '../ActionLink'
import { SendIcon } from '../actionIcons'
import { Input, Textarea, ToggleGroup } from '@/design-system'
import { useRevealOnMount } from '@/motion/useRevealOnMount'
import { rsvp } from '@/data/wedding'

/* Chronologie (ms) de la révélation — jouée une seule fois après le premier
   rendu (cf. useRevealOnMount) : Confirmez → filet → date limite → nom →
   présence → nombre → message → bouton. */
const DIVIDER_DELAY = 90
const DEADLINE_DELAY = 180
const NAME_DELAY = 270
const ATTEND_DELAY = 360
const GUESTS_DELAY = 450
const MESSAGE_DELAY = 540
const BUTTON_DELAY = 630

export function RSVPSection() {
  const revealed = useRevealOnMount()
  const inClass = revealed ? ' rsvp-in' : ''

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState<string | undefined>(undefined)
  const [attending, setAttending] = useState<'oui' | 'non'>('oui')
  const [guests, setGuests] = useState('1')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Merci d’indiquer votre nom.')
      return
    }
    setNameError(undefined)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <IvoryCard>
        <span className="text-2xl text-accent">&#10022;</span>
        <p className="mt-3 font-display text-xl text-ink">Merci</p>
        <p className="mt-2 font-accent text-xs leading-relaxed text-text-muted">
          Votre réponse a été enregistrée provisoirement.
        </p>
        <p className="mt-1 font-accent text-xs italic text-ink-300">
          Nous vous contacterons bientôt pour confirmation.
        </p>
      </IvoryCard>
    )
  }

  return (
    <IvoryCard>
      <div className={`rsvp-reveal${inClass}`}>
        <CardMainTitle>{rsvp.title}</CardMainTitle>
      </div>

      <div className={`rsvp-reveal${inClass} mx-auto mt-3 h-px w-11 bg-divider`} style={{ animationDelay: `${DIVIDER_DELAY}ms` }} />

      <p
        className={`rsvp-reveal${inClass} mt-4 text-center font-accent text-xs italic text-text-muted`}
        style={{ animationDelay: `${DEADLINE_DELAY}ms` }}
      >
        {rsvp.deadlineLabel}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5 text-left">
        <div className={`rsvp-reveal${inClass}`} style={{ animationDelay: `${NAME_DELAY}ms` }}>
          <Input
            label="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom et prénom"
            error={nameError}
          />
        </div>

        <div className={`rsvp-reveal${inClass}`} style={{ animationDelay: `${ATTEND_DELAY}ms` }}>
          <span className="mb-2 block font-sans text-label-xs uppercase tracking-wide text-ink-300">Présence</span>
          <ToggleGroup
            name="Présence"
            variant="soft"
            className="mx-auto"
            options={[
              { value: 'oui', label: 'Oui' },
              { value: 'non', label: 'Non' },
            ]}
            value={attending}
            onChange={(v) => setAttending(v as 'oui' | 'non')}
          />
        </div>

        <div className={`rsvp-reveal${inClass}`} style={{ animationDelay: `${GUESTS_DELAY}ms` }}>
          <Input
            label="Nombre de personnes"
            type="number"
            min={1}
            max={10}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>

        <div className={`rsvp-reveal${inClass}`} style={{ animationDelay: `${MESSAGE_DELAY}ms` }}>
          <Textarea
            label="Message (optionnel)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Un mot pour le couple…"
            rows={3}
          />
        </div>

        <ActionButton
          type="submit"
          className={`rsvp-reveal${inClass} mt-1`}
          style={{ animationDelay: `${BUTTON_DELAY}ms` }}
        >
          {rsvp.ctaLabel}
          <SendIcon />
        </ActionButton>
      </form>
    </IvoryCard>
  )
}
