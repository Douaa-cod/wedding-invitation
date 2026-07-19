import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { EASE_LUXE } from '@/motion/variants'
import { useReducedMotion } from '@/motion/useReducedMotion'
import { GrainOverlay } from '@/design-system'
import { audioManager } from '@/lib/audioManager'
import { LuxuryEnvelope } from '@/journey/LuxuryEnvelope'
import { CoverSection } from './sections/CoverSection'
import { CountdownSection } from './sections/CountdownSection'
import { HistorySection } from './sections/HistorySection'
import { ProgramSection } from './sections/ProgramSection'
import { TributeSection } from './sections/TributeSection'
import { VenueSection } from './sections/VenueSection'
import { GiftSection } from './sections/GiftSection'
import { RSVPSection } from './sections/RSVPSection'
import { PhotoSection } from './sections/PhotoSection'
import { ScrollCue } from './sections/ScrollCue'
import { FlightJourney } from './sections/FlightJourney'

const CARD_ENTRANCE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const CARD_ENTRANCE_DURATION = 0.95 // dans la plage implicite d'un mouvement "smooth", chevauche la sortie enveloppe (800–1100ms)
const PAPER_SLIDE_VOLUME = 0.75 // dans la plage demandée 0.65–0.8
const PAPER_SLIDE_STOP_FADE = 0.1 // fondu de sécurité très court à l'arrêt final — jamais un fondu dès le départ

/**
 * 'envelope'  — enveloppe visible, carte hors-écran sous le viewport (y:100vh).
 * 'entering'  — carte en train de remonter depuis le bas (voir onCardEntranceStart).
 */
type Stage = 'envelope' | 'entering'

/* ─────────────────────────────────────────────────────
   Flèche de défilement — discrète, bounce infini,
   indique à l'invité de continuer à scroller.
───────────────────────────────────────────────────── */
function ScrollArrow() {
  return (
    <div className="flex justify-center py-0.5" aria-hidden="true">
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 0.4,
        }}
        style={{ color: 'var(--color-gold)', opacity: 0.65 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   Bouton son — fixe en bas à droite
───────────────────────────────────────────────────── */
function SoundOnIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19.5 5a10 10 0 0 1 0 14" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

/**
 * Page d'invitation complète — montée en continu dès le chargement.
 * L'enveloppe est un calque visuel superposé qui glisse hors du viewport ;
 * la première carte, toujours montée, remonte depuis le bas en chevauchement
 * — aucun écran vide, aucune seconde carte, aucun remontage de page.
 */
export function InvitationPage() {
  const reducedMotion = useReducedMotion()
  const [muted, setMuted] = useState(false)
  const [stage, setStage] = useState<Stage>('envelope')
  const [envelopeDone, setEnvelopeDone] = useState(false)
  const [cardSettled, setCardSettled] = useState(false)
  const journeyRef = useRef<HTMLDivElement>(null)
  const card1Ref = useRef<HTMLDivElement>(null)
  const paperSlideRef = useRef<HTMLAudioElement | null>(null)
  const paperSlideTlRef = useRef<gsap.core.Timeline | null>(null)

  const entranceScale = reducedMotion ? 0.45 : 1
  const entranceDuration = CARD_ENTRANCE_DURATION * entranceScale
  const paperSlideStopFade = PAPER_SLIDE_STOP_FADE * entranceScale
  const paperSlidePlayedRef = useRef(false)

  useEffect(() => {
    document.documentElement.dataset.theme = 'lake'
    return () => { delete document.documentElement.dataset.theme }
  }, [])

  /* Précharge le son du glissement papier + réchauffe le cache HTTP de la
     musique de fond (jouée plus tard par audioManager.start()) — jamais
     lus avant leur déclencheur respectif. */
  useLayoutEffect(() => {
    const audio = new Audio('/assets/audio/paper-slide.mp3')
    audio.preload = 'auto'
    audio.load()
    paperSlideRef.current = audio

    const bgPreload = new Audio('/assets/audio/background-music.mp3')
    bgPreload.preload = 'auto'
    bgPreload.load()

    return () => {
      paperSlideTlRef.current?.kill()
      audio.pause()
      paperSlideRef.current = null
    }
  }, [])

  function handleToggleSound() {
    const nowMuted = audioManager.toggleMute()
    setMuted(nowMuted)
  }

  /* Déblocage audio (unlock) — appelé de façon SYNCHRONE par LuxuryEnvelope
     au tout début du clic/tap sur le sceau, avant tout GSAP/timer. Certains
     navigateurs n'autorisent play() sans nouveau geste que si un premier
     play() a déjà eu lieu, sur CET élément, dans le même tick qu'un geste
     utilisateur — d'où ce court play()+pause() immédiat, inaudible. */
  function handleSealTap() {
    const audio = paperSlideRef.current
    if (!audio) return
    const unlockPromise = audio.play()
    if (unlockPromise && typeof unlockPromise.then === 'function') {
      unlockPromise
        .then(() => {
          audio.pause()
          audio.currentTime = 0
        })
        .catch(() => { /* déblocage best-effort — un refus ici est sans conséquence */ })
    }
  }

  /** Joue paper-slide.mp3 une seule fois, au volume demandé, sans fondu au
   *  départ (le fichier est court : on laisse sa portion utile s'entendre
   *  clairement) — seul un très court fondu de sécurité en fin d'entrée de
   *  carte évite une coupure sèche si le fichier n'est pas déjà terminé. */
  function playPaperSlide() {
    if (paperSlidePlayedRef.current) return
    paperSlidePlayedRef.current = true

    const audio = paperSlideRef.current
    if (!audio) return
    paperSlideTlRef.current?.kill()
    audio.pause()
    audio.currentTime = 0
    audio.muted = false
    audio.volume = PAPER_SLIDE_VOLUME

    const playPromise = audio.play()
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch((err: unknown) => {
        if (import.meta.env.DEV) console.error('[paper-slide] audio.play() a échoué :', err)
      })
    }

    const tl = gsap.timeline()
    paperSlideTlRef.current = tl
    tl.to(audio, {
      volume: 0,
      duration: paperSlideStopFade,
      ease: 'sine.in',
      onComplete: () => {
        audio.pause()
        audio.currentTime = 0
      },
    }, Math.max(entranceDuration - paperSlideStopFade, 0))
  }

  /* 4-5. Déclenché 200–300ms après le début de la sortie de l'enveloppe —
     démarre la remontée de la carte et, au même instant, le son du papier. */
  function handleCardEntranceStart() {
    setStage('entering')
    playPaperSlide()
  }

  /** Enveloppe entièrement hors du viewport — peut être démontée. */
  function handleEnvelopeSequenceComplete() {
    setEnvelopeDone(true)
  }

  /* 8-10. La carte vient d'atteindre sa position finale : plus aucun
     remplacement, plus aucune navigation automatique — seule la musique de
     fond démarre ici (jamais avant), avec son propre fondu d'entrée. */
  function handleCardEntranceComplete() {
    /* Framer Motion peut déclencher onAnimationComplete dès le montage
       initial (initial={false} "termine" une animation à durée nulle) —
       on ignore tout appel tant que la vraie transition (déclenchée par
       onCardEntranceStart) n'a pas commencé. */
    if (cardSettled || stage === 'envelope') return
    setCardSettled(true)
    audioManager.start()
  }

  /* Choréographie de l'avion, dérivée du même état que la carte : caché
     tant que l'enveloppe est là, "entering" pendant la remontée (descend à
     côté de la carte 1), "scrolling" une fois stabilisée (relais du scroll
     réel — voir FlightJourney pour le calcul du point de raccord exact). */
  const journeyPhase = stage === 'envelope' ? 'hidden' : cardSettled ? 'scrolling' : 'entering'

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_LUXE }}
    >
      <GrainOverlay />

      {/* Dégradé de fond doux — présent dès le montage : masqué par l'enveloppe
          tant qu'elle est visible, jamais un écran différent après coup. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 130% 50% at 50% 100%, color-mix(in srgb, var(--color-lake-mid) 10%, transparent) 0%, var(--color-bg) 60%)',
        }}
      />

      {/* Contenu vertical — sections avec flèches entre elles. La carte de
          couverture est toujours l'élément monté ici, dès le premier rendu. */}
      <main className="mx-auto max-w-130 px-3 pb-16 pt-8">
        <div ref={journeyRef} className="relative flex flex-col gap-3">
          <FlightJourney
            containerRef={journeyRef}
            card1Ref={card1Ref}
            phase={journeyPhase}
            entranceDuration={entranceDuration}
          />

          <motion.div
            ref={card1Ref}
            initial={false}
            animate={{ y: stage === 'envelope' ? '100vh' : 0 }}
            transition={{ duration: entranceDuration, ease: CARD_ENTRANCE_EASE }}
            onAnimationComplete={handleCardEntranceComplete}
          >
            <CoverSection entering={stage !== 'envelope'} />
          </motion.div>

          <ScrollCue visible={cardSettled} />

          <CountdownSection />
          <ScrollArrow />
          <HistorySection />
          <ScrollArrow />
          <ProgramSection />
          <ScrollArrow />
          <VenueSection />
          <ScrollArrow />
          <GiftSection />
          <ScrollArrow />
          <RSVPSection />
          <ScrollArrow />
          <TributeSection />
          <ScrollArrow />
          <PhotoSection />
        </div>
      </main>

      {/* Bouton son — discret, fixe, bas-droit */}
      <button
        type="button"
        aria-label={muted ? 'Activer le son' : 'Couper le son'}
        onClick={handleToggleSound}
        className="fixed bottom-5 right-4 z-50 flex min-h-(--size-tap-min) min-w-(--size-tap-min) items-center justify-center rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
        style={{
          background: 'color-mix(in srgb, var(--color-warm-white) 85%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-bronze) 28%, transparent)',
          color: muted ? 'var(--color-ink-300)' : 'var(--color-bronze)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        {muted ? <SoundOffIcon /> : <SoundOnIcon />}
      </button>

      {/* Calque enveloppe — superposé, jamais un remontage de page ; se
          démonte une fois entièrement sortie du viewport par le haut. */}
      {!envelopeDone && (
        <LuxuryEnvelope
          onSealTap={handleSealTap}
          onCardEntranceStart={handleCardEntranceStart}
          onSequenceComplete={handleEnvelopeSequenceComplete}
        />
      )}
    </motion.div>
  )
}
