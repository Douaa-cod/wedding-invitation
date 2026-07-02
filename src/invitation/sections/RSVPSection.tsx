import { useState, type FormEvent, type CSSProperties } from 'react'
import { PaperCard } from '../PaperCard'
import { rsvp } from '@/data/wedding'

/** Styles partagés pour les inputs — plus fins, plus raffinés */
const fieldStyle: CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  fontSize: '0.72rem',
  letterSpacing: '0.03em',
  fontFamily: 'var(--font-body)',
  color: 'var(--color-ink)',
  background: 'rgba(250,247,242,0.55)',
  border: '1px solid color-mix(in srgb, var(--color-bronze) 22%, transparent)',
  borderRadius: '4px',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontSize: '0.6rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--color-text-subtle)',
  fontFamily: 'var(--font-sans)',
}

/** Section RSVP — formulaire élégant, style cohérent avec les cartes papier. */
export function RSVPSection() {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<'oui' | 'non'>('oui')
  const [guests, setGuests] = useState('1')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <PaperCard eyebrow={rsvp.eyebrow}>
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="text-2xl text-accent">&#10022;</span>
          <p className="font-display text-xl text-ink">Merci</p>
          <p className="font-body text-xs leading-relaxed text-text-muted">
            Votre réponse a été enregistrée provisoirement.
          </p>
          <p className="font-body text-xs italic text-text-subtle">
            Nous vous contacterons bientôt pour confirmation.
          </p>
        </div>
      </PaperCard>
    )
  }

  return (
    <PaperCard eyebrow={rsvp.eyebrow} title={rsvp.title}>
      <p className="mb-5 text-center font-accent text-xs italic text-text-muted">
        {rsvp.deadlineLabel}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Nom */}
        <div>
          <label style={labelStyle}>Nom complet</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Votre nom et prénom"
            required
            style={fieldStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-bronze)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-bronze) 22%, transparent)' }}
          />
        </div>

        {/* Présence */}
        <div>
          <label style={labelStyle}>Présence</label>
          <div className="flex gap-2">
            {(['oui', 'non'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAttending(v)}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '0.68rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)',
                  borderRadius: '4px',
                  border: `1px solid ${attending === v ? 'var(--color-bronze)' : 'color-mix(in srgb, var(--color-bronze) 22%, transparent)'}`,
                  background: attending === v ? 'var(--color-bronze)' : 'transparent',
                  color: attending === v ? 'var(--color-warm-white)' : 'var(--color-accent-strong)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Nombre de personnes */}
        <div>
          <label style={labelStyle}>Nombre de personnes</label>
          <input
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={e => setGuests(e.target.value)}
            style={fieldStyle}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-bronze)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-bronze) 22%, transparent)' }}
          />
        </div>

        {/* Message */}
        <div>
          <label style={labelStyle}>Message (optionnel)</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Un mot pour le couple…"
            rows={3}
            style={{ ...fieldStyle, resize: 'none' }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--color-bronze)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-bronze) 22%, transparent)' }}
          />
        </div>

        {/* Bouton premium */}
        <button
          type="submit"
          style={{
            marginTop: '4px',
            padding: '12px 24px',
            width: '100%',
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
            color: 'var(--color-warm-white)',
            background: 'var(--color-bronze)',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            transition: 'background 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bronze-deep)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bronze)' }}
        >
          {rsvp.ctaLabel}
        </button>
      </form>
    </PaperCard>
  )
}
