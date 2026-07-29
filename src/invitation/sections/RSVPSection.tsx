import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IvoryCard } from '../IvoryCard'
import { CardMainTitle } from '../CardMainTitle'
import { ActionButton } from '../ActionLink'
import { SendIcon } from '../actionIcons'
import { Input, Textarea, ToggleGroup } from '@/design-system'
import { useRevealOnMount } from '@/motion/useRevealOnMount'
import { useReducedMotion } from '@/motion/useReducedMotion'
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

const MIN_GUESTS = 1
const MAX_GUESTS = 20

/** URL de l'Apps Script — jamais dupliquée ailleurs dans le composant. */
const rsvpApiUrl = import.meta.env.VITE_RSVP_API_URL

type Attendance = '' | 'Oui' | 'Non'
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const SUCCESS_MESSAGE = 'Merci, votre réponse a bien été enregistrée.'
const ERROR_MESSAGE = 'Une erreur est survenue. Veuillez réessayer.'

/* Transition formulaire → confirmation (cf. AnimatePresence mode="wait"
   ci-dessous) : fondu de sortie du formulaire (0,3s) puis léger mouvement du
   bas vers le haut à l'apparition de la confirmation (0,4s) — 0,7s au total,
   jamais rejouée hors de la transition idle/error → success. */
const FORM_EXIT_TRANSITION = { duration: 0.3, ease: 'easeOut' as const }
const SUCCESS_ENTER_TRANSITION = { duration: 0.4, ease: 'easeOut' as const }
/* prefers-reduced-motion : même principe que le reste du site (cf.
   PhotoSection) — fondu bref, jamais de translateY. */
const REDUCED_TRANSITION = { duration: 0.15, ease: 'easeOut' as const }

export function RSVPSection() {
  const revealed = useRevealOnMount()
  const inClass = revealed ? ' rsvp-in' : ''
  const reducedMotion = useReducedMotion()

  const [fullName, setFullName] = useState('')
  const [fullNameError, setFullNameError] = useState<string | undefined>(undefined)
  const [attendance, setAttendance] = useState<Attendance>('')
  const [attendanceError, setAttendanceError] = useState<string | undefined>(undefined)
  const [numberOfGuests, setNumberOfGuests] = useState('1')
  const [guestsError, setGuestsError] = useState<string | undefined>(undefined)
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — doit rester vide
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  /* Mémorise la réponse envoyée AVANT le resetForm() qui suit un succès — le
     bloc de confirmation en dépend et ne doit jamais lire `attendance` une
     fois le formulaire réinitialisé. */
  const [submittedAttendance, setSubmittedAttendance] = useState<'Oui' | 'Non' | null>(null)

  const fullNameRef = useRef<HTMLInputElement>(null)
  const attendanceWrapperRef = useRef<HTMLDivElement>(null)
  const guestsRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  /* Garde synchrone contre la double soumission : une ref se lit/mute
     immédiatement, contrairement à l'état React (mis à jour de façon
     asynchrone/groupée) — sans elle, plusieurs clics tirés dans le même tick
     (avant que le bouton ne soit réellement rendu disabled) verraient tous
     le même statut "idle" et déclencheraient chacun leur propre requête. */
  const isSubmittingRef = useRef(false)

  const isSubmitting = status === 'submitting'

  // Place le focus sur le bloc de confirmation une fois affiché, sans
  // provoquer de défilement (la carte est déjà dans le viewport à ce stade).
  useEffect(() => {
    if (status === 'success' && submittedAttendance) {
      successRef.current?.focus({ preventScroll: true })
    }
  }, [status, submittedAttendance])

  function resetForm() {
    setFullName('')
    setMessage('')
    setAttendance('')
    setNumberOfGuests(String(MIN_GUESTS))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (isSubmittingRef.current) return // empêche toute double soumission (en plus du bouton désactivé)

    setFullNameError(undefined)
    setAttendanceError(undefined)
    setGuestsError(undefined)

    const trimmedName = fullName.trim()
    if (!trimmedName) {
      setFullNameError('Merci d’indiquer votre nom.')
      fullNameRef.current?.focus()
      return
    }

    if (attendance !== 'Oui' && attendance !== 'Non') {
      setAttendanceError('Merci d’indiquer votre présence.')
      attendanceWrapperRef.current?.querySelector('button')?.focus()
      return
    }

    let guestsCount = 0
    if (attendance === 'Oui') {
      guestsCount = Number(numberOfGuests)
      if (!Number.isInteger(guestsCount) || guestsCount < MIN_GUESTS || guestsCount > MAX_GUESTS) {
        setGuestsError(`Merci d’indiquer un nombre de personnes entre ${MIN_GUESTS} et ${MAX_GUESTS}.`)
        guestsRef.current?.focus()
        return
      }
    }

    isSubmittingRef.current = true
    try {
      // Honeypot rempli → réponse silencieuse de succès, aucune requête envoyée.
      if (website.trim() !== '') {
        setSubmittedAttendance(attendance as 'Oui' | 'Non')
        setStatus('success')
        setStatusMessage(SUCCESS_MESSAGE)
        resetForm()
        return
      }

      if (!rsvpApiUrl) {
        // Toujours logué (dev ET prod) : sans variable Vercel configurée, la
        // console de prod ne montrait auparavant aucune trace exploitable.
        console.error(
          'VITE_RSVP_API_URL est absente : impossible d’envoyer le formulaire RSVP. ' +
            'Vérifiez la variable d’environnement (fichier .env en local, Vercel → Project → Settings → Environment Variables en production).',
        )
        setStatus('error')
        setStatusMessage(ERROR_MESSAGE)
        return
      }

      setStatus('submitting')
      setStatusMessage('')

      const formData = new FormData()
      formData.append('fullName', trimmedName)
      formData.append('attendance', attendance)
      formData.append('numberOfGuests', attendance === 'Oui' ? String(guestsCount) : '0')
      formData.append('message', message.trim())
      formData.append('website', website)

      try {
        // mode: 'no-cors' → la réponse est opaque : le navigateur envoie bien
        // la requête, mais le JavaScript ne peut lire ni son statut HTTP ni
        // son corps JSON (contrainte imposée par Google Apps Script pour
        // éviter le blocage CORS). "Succès" signifie donc uniquement que la
        // requête a pu être envoyée sans erreur réseau — pas une confirmation
        // explicite que Google Apps Script l'a traitée côté serveur.
        await fetch(rsvpApiUrl, { method: 'POST', mode: 'no-cors', body: formData })
        setSubmittedAttendance(attendance as 'Oui' | 'Non')
        setStatus('success')
        setStatusMessage(SUCCESS_MESSAGE)
        resetForm()
      } catch {
        setStatus('error')
        setStatusMessage(ERROR_MESSAGE)
        // Les valeurs saisies restent intactes — aucun reset en cas d'erreur.
      }
    } finally {
      isSubmittingRef.current = false
    }
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

      <AnimatePresence mode="wait">
        {status === 'success' && submittedAttendance ? (
          <motion.div
            key="confirmation"
            ref={successRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="rsvp-success mt-6"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reducedMotion ? REDUCED_TRANSITION : SUCCESS_ENTER_TRANSITION}
          >
            <CardMainTitle className="rsvp-success__title">
              {submittedAttendance === 'Oui'
                ? 'Merci pour votre confirmation'
                : 'Merci pour votre réponse'}
              <br />
              <span aria-hidden="true">♡</span>
            </CardMainTitle>
            <p className="rsvp-success__message font-accent text-base leading-relaxed text-text">
              {submittedAttendance === 'Oui'
                ? 'Votre présence nous comble de joie. Nous avons hâte de vivre cette merveilleuse journée avec vous.'
                : 'Vous nous manquerez, mais si vous parvenez finalement à vous libérer, nous serons ravis de vous accueillir.'}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isSubmitting}
            className="mt-6 flex flex-col gap-5 text-left"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reducedMotion ? REDUCED_TRANSITION : FORM_EXIT_TRANSITION}
          >
            <div className={`rsvp-reveal${inClass}`} style={{ animationDelay: `${NAME_DELAY}ms` }}>
              <Input
                ref={fullNameRef}
                label="Nom complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom et prénom"
                error={fullNameError}
                disabled={isSubmitting}
              />
            </div>

            <div className={`rsvp-reveal${inClass}`} style={{ animationDelay: `${ATTEND_DELAY}ms` }}>
              <span className="mb-2 block font-sans text-label-xs uppercase tracking-wide text-ink-300">Présence</span>
              <div ref={attendanceWrapperRef}>
                <ToggleGroup
                  name="Présence"
                  variant="soft"
                  className="mx-auto"
                  options={[
                    { value: 'Oui', label: 'Oui' },
                    { value: 'Non', label: 'Non' },
                  ]}
                  value={attendance}
                  onChange={(v) => setAttendance(v as Attendance)}
                />
              </div>
              {attendanceError && (
                <p role="alert" className="mt-2 text-center font-sans text-label-xs text-bordeaux">
                  {attendanceError}
                </p>
              )}
            </div>

            <div className={`rsvp-reveal${inClass}`} style={{ animationDelay: `${GUESTS_DELAY}ms` }}>
              <Input
                ref={guestsRef}
                label="Nombre de personnes"
                type="number"
                min={MIN_GUESTS}
                max={MAX_GUESTS}
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value)}
                error={guestsError}
                disabled={attendance !== 'Oui' || isSubmitting}
              />
            </div>

            <div className={`rsvp-reveal${inClass}`} style={{ animationDelay: `${MESSAGE_DELAY}ms` }}>
              <Textarea
                label="Message (optionnel)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Un mot pour le couple…"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Honeypot antispam — jamais rempli par un utilisateur humain (voir
                .rsvp-honeypot dans rsvp-reveal.css), entièrement ignoré des
                technologies d'assistance. */}
            <div className="rsvp-honeypot" aria-hidden="true">
              <Input
                label="Site web"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <ActionButton
              type="submit"
              disabled={isSubmitting}
              className={`rsvp-reveal${inClass} mt-1`}
              style={{ animationDelay: `${BUTTON_DELAY}ms` }}
            >
              {isSubmitting ? 'Envoi en cours…' : rsvp.ctaLabel}
              <SendIcon />
            </ActionButton>

            <p
              aria-live="polite"
              className={`text-center font-accent text-xs ${status === 'error' ? 'text-bordeaux' : 'text-text-muted'}`}
            >
              {statusMessage}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </IvoryCard>
  )
}
