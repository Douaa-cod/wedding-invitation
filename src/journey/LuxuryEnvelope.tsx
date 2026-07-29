import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { useReducedMotion } from '@/motion/useReducedMotion'

export interface LuxuryEnvelopeProps {
  /**
   * Appelé de façon SYNCHRONE, au tout début de handleTap — dans le même tick
   * que le geste utilisateur d'origine (clic/tap sur le sceau). Sert à
   * débloquer (unlock) les éléments <audio> qui seront joués plus tard de
   * façon différée (paper-slide.mp3), certains navigateurs exigeant un appel
   * play() synchrone avec un geste utilisateur pour lever le blocage autoplay.
   */
  onSealTap?: () => void
  /**
   * Appelé exactement 250ms après le début de la sortie de l'enveloppe par le
   * haut (translation verticale, jamais un fondu) — c'est à cet instant que
   * le parent doit démarrer l'entrée de la première carte depuis le bas.
   */
  onCardEntranceStart: () => void
  /** Appelé une fois l'enveloppe entièrement sortie du viewport (translation terminée). */
  onSequenceComplete: () => void
}

const SEAL_TOP_PCT = 37.75 // bord supérieur du sceau imprimé, en % de la hauteur de l'enveloppe
const SHADOW_REST = '0 3px 8px rgba(60,20,20,0.16)'
const SHADOW_BEAT = '0 0 10px 2px rgba(139,36,54,0.3)'
/* GSAP n'interprète pas les chaînes cubic-bezier() natives sans le plugin
   CustomEase : power1.inOut est l'équivalent intégré le plus proche de
   cubic-bezier(0.4, 0, 0.2, 1) (courbe "material" douce, symétrique). */
const BEAT_EASE = 'power1.inOut'

/* Séquence guide (instruction + battement), un seul cycle qui se répète : */
const TEXT_DELAY = 0.3 // fondu lancé ~300ms après l'apparition de l'enveloppe
const TEXT_FADE_IN = 0.4
const TEXT_FADE_OUT = 0.45
const HOLD_AFTER_BEAT = 1.4
const HOLD_HIDDEN = 2.0
const BEAT_START = TEXT_DELAY + TEXT_FADE_IN // le texte est pleinement visible avant le 1er battement
const BEAT_PHASE_DURATION = 1.35 // 0.30+0.30+0.30+0.45 — identique aux paliers 0/10/20/30/45%

/* Ouverture, dans l'ordre exact : 1) compression 2) chute visible du sceau
   (le son démarre pile à cet instant, le sceau "posé" (sealPulseRef) est
   caché INSTANTANÉMENT à ce même instant, sans fondu, sans masque coloré)
   3) à ~40% de la chute, le rabat commence à s'ouvrir 4) une fois le rabat
   effacé, l'enveloppe complète (dos + rabat, toujours pleinement opaque)
   glisse vers le haut en sortie de scène — translation verticale pure,
   jamais de rotation, jamais de fondu prématuré — jusqu'à quitter
   entièrement le viewport, où elle est alors démontée. Durées réduites sous
   prefers-reduced-motion, mais jamais sautées. */
const SEAL_COMPRESS_DURATION = 0.08
const SEAL_FALL_DURATION = 1.3 // 1.2–1.5s demandé
const SEAL_FALL_SCALE_END = 0.82
const SEAL_FALL_ROTATION = 8 // deg — uniquement le sceau, jamais l'enveloppe
const SEAL_OPACITY_HOLD = 0.85 // le sceau reste opaque sur au moins 85% de la chute
const FRONT_FADE_START_RATIO = 0.4 // le rabat commence à s'effacer à 40% de la chute du sceau
const ENVELOPE_OPEN_DURATION = 0.8 // durée du fondu du rabat
const ENVELOPE_EXIT_DURATION = 0.95 // dans la plage demandée 800–1100ms
const CARD_ENTRANCE_OVERLAP = 0.25 // dans la plage demandée 200–300ms
const AUDIO_FADE_DURATION = 0.3 // dans la plage demandée 250–400ms
const FRONT_TO_OPEN_CROSSFADE = 0.12 // dans la plage demandée 100–150ms

/* Formule de taille/position partagée par les deux calques (dos et rabat) —
   doivent rester pixel-identiques pour former visuellement UNE seule
   enveloppe, bien qu'ils vivent dans deux éléments DOM distincts. */
const ENVELOPE_BOX_STYLE = {
  width: 'min(94vw, 480px)',
  aspectRatio: '768 / 1376',
  maxHeight: '94dvh',
  transformOrigin: `50% ${SEAL_TOP_PCT + 7}%`,
} as const

export function LuxuryEnvelope({ onSealTap, onCardEntranceStart, onSequenceComplete }: LuxuryEnvelopeProps) {
  const reducedMotion = useReducedMotion()

  const [assetsReady, setAssetsReady] = useState(false)

  const backLayerRef = useRef<HTMLDivElement>(null)
  const bodyRef    = useRef<HTMLImageElement>(null)
  const envBackRef = useRef<HTMLDivElement>(null)
  const frontRef   = useRef<HTMLImageElement>(null)
  const openRef    = useRef<HTMLImageElement>(null)
  const frontLayerRef = useRef<HTMLDivElement>(null)
  const envFrontRef = useRef<HTMLDivElement>(null)
  const sealRef    = useRef<HTMLDivElement>(null)
  const sealPulseRef = useRef<HTMLDivElement>(null)
  const hintRef    = useRef<HTMLDivElement>(null)
  const hintScaleRef = useRef<HTMLDivElement>(null)
  const idleTimelinesRef = useRef<gsap.core.Timeline[]>([])
  const openingTlRef = useRef<gsap.core.Timeline | null>(null)
  const audioFadeRef = useRef<gsap.core.Tween | null>(null)
  const audioElRef = useRef<HTMLAudioElement | null>(null)
  const clickedRef = useRef(false)

  /* Précharge le son du sceau (une seule fois) — lecture uniquement au clic. */
  useLayoutEffect(() => {
    const audio = new Audio('/assets/audio/magic-wind.mp3')
    audio.preload = 'auto'
    audio.load()
    audioElRef.current = audio
    return () => {
      audioFadeRef.current?.kill()
      audio.pause()
      audioElRef.current = null
    }
  }, [])

  /* Précharge les trois images de l'enveloppe (fermée, mi-ouverte, ouverte) et
     n'autorise le tap sur le sceau qu'une fois les trois décodées — condition
     nécessaire pour que le crossfade fermée→mi-ouverte (voir handleTap) soit
     instantané, sans flash blanc ni frame vide. */
  useLayoutEffect(() => {
    let cancelled = false
    let loaded = 0
    const sources = [
      '/assets/envelope/envelope-front.webp',
      '/assets/envelope/envelope-open.webp',
      '/assets/envelope/envelope-body.webp',
    ]
    sources.forEach((src) => {
      const img = new Image()
      img.onload = img.onerror = () => {
        loaded += 1
        if (!cancelled && loaded === sources.length) setAssetsReady(true)
      }
      img.src = src
    })
    return () => { cancelled = true }
  }, [])

  useLayoutEffect(() => {
    gsap.set(bodyRef.current,   { opacity: 0 })
    gsap.set(frontRef.current,  { opacity: 1 })
    gsap.set(openRef.current,   { opacity: 0 })
    /* Le sceau overlay (wax-seal.webp) reste invisible en idle — il ne sert
       qu'à l'effet de chute au clic (voir handleTap). Le battement en idle
       cible sealPulseRef, une fenêtre recadrée sur cette même image front.webp :
       alignement garanti au pixel près, aucun risque de doublon visuel — et
       c'est aussi lui qui disparaît instantanément (opacity:0, sans fondu,
       sans masque) dès que le sceau commence à tomber. */
    gsap.set(sealRef.current, { opacity: 0, scale: 1 })
    gsap.set([backLayerRef.current, frontLayerRef.current], { y: 0, opacity: 1 })
    gsap.set([envBackRef.current, envFrontRef.current], { scale: 1 })
    gsap.set(sealPulseRef.current, { opacity: 1, scale: 1, boxShadow: SHADOW_REST })
    gsap.set(hintScaleRef.current, { scale: 1 })
    gsap.set(hintRef.current, { opacity: 0 })

    idleTimelinesRef.current.forEach((t) => t.kill())
    idleTimelinesRef.current = []

    if (!reducedMotion) {
      /* Séquence guide unique : fondu du texte → texte pleinement visible →
         double battement (enveloppe + sceau + très légère réaction du texte,
         calée sur les mêmes paliers) → maintien bref → fondu de sortie →
         pause → boucle. Une seule timeline pour rester parfaitement synchrone. */
      const guideTl = gsap.timeline({ repeat: -1 })

      guideTl
        .to(hintRef.current, { duration: TEXT_DELAY })
        .to(hintRef.current, { opacity: 1, duration: TEXT_FADE_IN, ease: 'sine.inOut' })

      const envBoxes = () => [envBackRef.current, envFrontRef.current]
      guideTl
        // 0% → 10%
        .to(envBoxes(),           { scale: 1.008, duration: 0.30, ease: BEAT_EASE }, BEAT_START)
        .to(sealPulseRef.current, { scale: 1.025, boxShadow: SHADOW_BEAT, duration: 0.30, ease: BEAT_EASE }, BEAT_START)
        .to(hintScaleRef.current, { scale: 1.015, duration: 0.30, ease: BEAT_EASE }, BEAT_START)
        // 10% → 20%
        .to(envBoxes(),           { scale: 1, duration: 0.30, ease: BEAT_EASE }, BEAT_START + 0.30)
        .to(sealPulseRef.current, { scale: 1, boxShadow: SHADOW_REST, duration: 0.30, ease: BEAT_EASE }, BEAT_START + 0.30)
        .to(hintScaleRef.current, { scale: 1, duration: 0.30, ease: BEAT_EASE }, BEAT_START + 0.30)
        // 20% → 30% — second battement, plus fort
        .to(envBoxes(),           { scale: 1.014, duration: 0.30, ease: BEAT_EASE }, BEAT_START + 0.60)
        .to(sealPulseRef.current, { scale: 1.045, boxShadow: SHADOW_BEAT, duration: 0.30, ease: BEAT_EASE }, BEAT_START + 0.60)
        .to(hintScaleRef.current, { scale: 1.015, duration: 0.30, ease: BEAT_EASE }, BEAT_START + 0.60)
        // 30% → 45%
        .to(envBoxes(),           { scale: 1, duration: 0.45, ease: BEAT_EASE }, BEAT_START + 0.90)
        .to(sealPulseRef.current, { scale: 1, boxShadow: SHADOW_REST, duration: 0.45, ease: BEAT_EASE }, BEAT_START + 0.90)
        .to(hintScaleRef.current, { scale: 1, duration: 0.45, ease: BEAT_EASE }, BEAT_START + 0.90)

      const beatEnd = BEAT_START + BEAT_PHASE_DURATION
      guideTl
        .to(hintRef.current, { duration: HOLD_AFTER_BEAT }, beatEnd)
        .to(hintRef.current, { opacity: 0, duration: TEXT_FADE_OUT, ease: 'sine.inOut' })
        .to(hintRef.current, { duration: HOLD_HIDDEN })

      idleTimelinesRef.current.push(guideTl)
    } else {
      /* Mouvement réduit : pas de battement, instruction visible en continu, sans fondu répété. */
      gsap.set(hintRef.current, { opacity: 1 })
    }

    return () => { idleTimelinesRef.current.forEach((t) => t.kill()) }
  }, [reducedMotion])

  /** Démarre le son du sceau (depuis le début), sans le programmer à l'avance. */
  function playSealSound() {
    const audio = audioElRef.current
    if (!audio) return
    audioFadeRef.current?.kill()
    audio.currentTime = 0
    audio.volume = 1
    audio.play()?.catch(() => { /* fichier absent ou politique autoplay — silencieux */ })
  }

  /** Fondu de sortie du son du sceau, puis pause + reset — appelé quand la carte commence à sortir. */
  function fadeOutSealSound(fadeSec: number) {
    const audio = audioElRef.current
    if (!audio) return
    audioFadeRef.current?.kill()
    audioFadeRef.current = gsap.to(audio, {
      volume: 0,
      duration: fadeSec,
      ease: 'sine.in',
      onComplete: () => {
        audio.pause()
        audio.currentTime = 0
      },
    })
  }

  function handleTap() {
    if (clickedRef.current) return
    clickedRef.current = true

    /* 1. Déblocage audio — appelé en tout premier, de façon strictement
       synchrone avec ce geste utilisateur (avant tout GSAP/setTimeout). */
    onSealTap?.()

    /* 2. Arrêt immédiat du battement — 3. l'instruction disparaît */
    idleTimelinesRef.current.forEach((t) => t.kill())
    gsap.set([envBackRef.current, envFrontRef.current, sealPulseRef.current, hintScaleRef.current], { scale: 1 })
    gsap.to(hintRef.current, { opacity: 0, duration: 0.15 })
    gsap.to(sealPulseRef.current, { opacity: 0, duration: 0.18 })

    /* Distance de chute calculée depuis la hauteur réelle de l'enveloppe (bord
       inférieur ≈ 55% sous le centre du sceau), jamais une valeur de page fixe. */
    const envHeight = envFrontRef.current?.getBoundingClientRect().height ?? 0
    const fallDistance = envHeight * 0.55

    /* Mouvement réduit : transition plus courte, mais fonctionnelle (jamais de saut instantané). */
    const scale = reducedMotion ? 0.45 : 1
    const compressDuration = SEAL_COMPRESS_DURATION * scale
    const fallDuration = SEAL_FALL_DURATION * scale
    const openDuration = ENVELOPE_OPEN_DURATION * scale
    const exitDuration = ENVELOPE_EXIT_DURATION * scale
    const entranceOverlap = CARD_ENTRANCE_OVERLAP * scale
    const audioFade = AUDIO_FADE_DURATION * scale
    const crossfadeDuration = FRONT_TO_OPEN_CROSSFADE * scale
    const sealRotation = reducedMotion ? 0 : SEAL_FALL_ROTATION

    const tl = gsap.timeline({ onComplete: () => { openingTlRef.current = null } })
    openingTlRef.current = tl

    /* 4. Le sceau se comprime légèrement (anticipation) — il est rendu visible
       ici : c'était la cause du bug (opacity restait à 0 depuis l'idle). */
    tl.set(sealRef.current, { opacity: 1, y: 0, scale: 1, rotation: 0 })
      .to(sealRef.current, { scale: 0.95, duration: compressDuration, ease: 'power1.out' })
      .addLabel('fallStart')

    /* 5-7. Le sceau se détache et tombe visiblement — le son démarre exactement
       à cet instant (onStart), et le sceau "posé" (sealPulseRef) disparaît sur
       la même frame, instantanément (opacity:0, sans fondu, sans masque — le
       sceau qui tombe est le seul élément visible désormais). Il reste à
       pleine opacité sur au moins 85% de la chute, ne s'efface que sur les
       derniers 15%. */
    tl.to(sealRef.current, {
      y: fallDistance, scale: SEAL_FALL_SCALE_END, rotation: sealRotation,
      duration: fallDuration, ease: 'power1.in',
      onStart: () => {
        playSealSound()
        gsap.set(sealPulseRef.current, { opacity: 0 })
      },
    }, 'fallStart')
    .to(sealRef.current, {
      opacity: 0,
      duration: fallDuration * (1 - SEAL_OPACITY_HOLD),
      ease: 'power1.in',
    }, `fallStart+=${fallDuration * SEAL_OPACITY_HOLD}`)
    .addLabel('envelopeOpen', `fallStart+=${fallDuration * FRONT_FADE_START_RATIO}`)

    /* 8. Dès l'instant où le sceau commence à tomber (même label que le début
       de la chute), l'enveloppe fermée cède la place à l'enveloppe mi-ouverte
       via un très bref fondu croisé — les deux images se superposent le temps
       du crossfade, pixel-alignées, pour que la bascule soit invisible. */
    tl.to(frontRef.current, { opacity: 0, duration: crossfadeDuration, ease: 'sine.inOut' }, 'fallStart')
      .to(openRef.current,  { opacity: 1, duration: crossfadeDuration, ease: 'sine.inOut' }, 'fallStart')

    /* 9. Le rabat commence à s'ouvrir PENDANT que le sceau tombe encore. Le
       son du sceau s'éteint en fondu au même instant. */
    tl.to(openRef.current, { opacity: 0, duration: openDuration, ease: 'power2.inOut' }, 'envelopeOpen')
      .to(bodyRef.current,  { opacity: 1, duration: openDuration * 0.7 }, `envelopeOpen+=${openDuration * 0.15}`)
      .add(() => fadeOutSealSound(audioFade), 'envelopeOpen')
      .addLabel('envelopeGone', `envelopeOpen+=${openDuration}`)

    /* 10. Une fois le rabat effacé, l'enveloppe complète (dos + rabat, les
       deux calques ensemble, toujours pleinement opaques) glisse vers le
       haut — translation verticale pure, aucune rotation, aucun fondu
       prématuré — jusqu'à quitter entièrement le viewport. power3.out est
       l'équivalent GSAP intégré le plus proche de cubic-bezier(0.22,1,0.36,1)
       (GSAP n'interprète pas les chaînes cubic-bezier() natives sans le
       plugin CustomEase). -110% garantit une sortie complète (marge de 10%
       au-delà de la propre hauteur de l'enveloppe, qui vaut exactement
       100dvh). onComplete ne se déclenche donc qu'une fois l'enveloppe
       entièrement hors du viewport, jamais avant. */
    tl.to([backLayerRef.current, frontLayerRef.current], {
      y: '-110%',
      duration: exitDuration,
      ease: 'power3.out',
      onComplete: onSequenceComplete,
    }, 'envelopeGone')
    /* 5. La première carte démarre son entrée depuis le bas 200–300ms après
       le début de cette sortie — jamais avant, jamais après la fin. */
    .add(onCardEntranceStart, `envelopeGone+=${entranceOverlap}`)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleTap()
    }
  }

  return (
    <>
      {/* ─── Calque "dos" — fond de scène + intérieur d'enveloppe ouvert.
          Glisse vers le haut avec le calque "rabat" (voir handleTap) une fois
          l'enveloppe ouverte, jusqu'à quitter entièrement le viewport. ─── */}
      <div
        ref={backLayerRef}
        className="pointer-events-none fixed inset-0 z-10 flex min-h-dvh w-full flex-col items-center justify-center"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 48%, #FBF5EC 0%, #F4E9D6 55%, #EAD9C0 100%)',
        }}
      >
        <div ref={envBackRef} className="relative mx-auto" style={ENVELOPE_BOX_STYLE}>
          {/* [1] Corps — révélé après disparition du rabat */}
          <img ref={bodyRef} src="/assets/envelope/envelope-body.webp" alt="" aria-hidden="true"
            className="absolute inset-0 h-full w-full" style={{ objectFit: 'contain' }} draggable={false} />
        </div>
      </div>

      {/* ─── Calque "rabat" — face fermée (sceau imprimé compris), sceau
          animé, instruction et zone de tap. zIndex:20 : glisse vers le haut
          en même temps que le calque "dos" (voir handleTap), toujours
          au-dessus dans le sens où il reste visuellement devant tant qu'il
          n'a pas quitté le viewport. ─── */}
      <motion.div
        ref={frontLayerRef}
        className="pointer-events-none fixed inset-0 z-20 flex min-h-dvh w-full flex-col items-center justify-center gap-5"
        exit={{ opacity: 0 }}
      >
        <div ref={envFrontRef} className="pointer-events-auto relative mx-auto" style={ENVELOPE_BOX_STYLE}>
          {/* [3] Enveloppe fermée initiale (le sceau imprimé fait partie de cette image, intacte) */}
          <img ref={frontRef} src="/assets/envelope/envelope-front.webp" alt="Enveloppe fermée"
            className="absolute inset-0 h-full w-full" style={{ objectFit: 'contain', zIndex: 3 }} draggable={false} />

          {/* [3.1] Enveloppe mi-ouverte — invisible en idle (opacity:0), révélée par
              un fondu croisé avec [3] dès l'instant où le sceau commence sa chute
              (voir handleTap). Même conteneur, même position/taille/object-fit que
              [3] : alignement pixel-perfect garanti, aucun flash possible. */}
          <img ref={openRef} src="/assets/envelope/envelope-open.webp" alt="" aria-hidden="true"
            className="absolute inset-0 h-full w-full" style={{ objectFit: 'contain', zIndex: 3 }} draggable={false} />

          {/* [3.4] Instruction — directement au-dessus du sceau (~12px), une ligne si possible */}
          <div ref={hintRef} aria-hidden="true" style={{
            position: 'absolute', left: '50%', top: `calc(${SEAL_TOP_PCT}% - 12px)`, zIndex: 6,
            transform: 'translate(-50%, -100%)', pointerEvents: 'none', width: '72%', maxWidth: '320px', textAlign: 'center',
          }}>
            <div ref={hintScaleRef} style={{ display: 'inline-block' }}>
              <p className="font-display" style={{
                fontSize: 'clamp(0.95rem, 3.6vw, 1.0625rem)',
                fontWeight: 500,
                letterSpacing: '0.005em',
                lineHeight: 1.3,
                color: 'var(--color-bordeaux)',
                textShadow: '0 1px 3px rgba(255,250,240,0.75)',
                textAlign: 'center',
              }}>
                <span className="pointer-fine:hidden">Touchez le sceau pour ouvrir</span>
                <span className="hidden pointer-fine:inline">Cliquez sur le sceau pour ouvrir</span>
              </p>
            </div>
          </div>

          {/* [3.7] Fenêtre de pulsation — recadrage de envelope-front.webp sur la zone du
              sceau imprimé (mêmes proportions 768×1376) : alignement pixel-perfect
              garanti, aucune seconde image à faire correspondre. Porte le battement
              (échelle + ombre) du sceau. */}
          <div ref={sealPulseRef} aria-hidden="true" style={{
            position: 'absolute', left: '50%', top: '45%', width: '26%', aspectRatio: '1',
            transform: 'translate(-50%, -50%)', zIndex: 4, borderRadius: '50%', overflow: 'hidden',
            pointerEvents: 'none',
            backgroundImage: 'url(/assets/envelope/envelope-front.webp)',
            backgroundSize: '384.615% auto',
            backgroundPosition: '50% 44.15%',
          }} />

          {/* [4] Sceau overlay (wax-seal.webp) — invisible en idle, tombe au clic */}
          <div ref={sealRef} aria-hidden="true" style={{
            position: 'absolute', left: '50%', top: '45%', width: '26%', aspectRatio: '1',
            transform: 'translate(-50%, -50%)', zIndex: 5,
            borderRadius: '50%', overflow: 'hidden', pointerEvents: 'none',
          }}>
            <img src="/assets/envelope/wax-seal.webp" alt="" style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '168%', height: '168%', transform: 'translate(-50%, -50%)', objectFit: 'cover',
            }} draggable={false} />
          </div>

          {/* [5] Zone de tap — couvre l'intégralité du sceau visible sur
              envelope-front.webp (mesuré ≈39–61% de la hauteur × ≈33–68% de la
              largeur du conteneur), avec marge de sécurité, tout en garantissant
              ≥44×44px sur mobile. Totalement transparente : aucune forme visible,
              ne change ni la taille ni l'apparence du sceau. */}
          <button type="button" aria-label="Ouvrir l’invitation" onClick={handleTap} onKeyDown={handleKeyDown}
            disabled={!assetsReady}
            style={{ position: 'absolute', left: '50%', top: '50%', width: 'max(40%, 44px)', height: 'max(28%, 44px)',
              transform: 'translate(-50%, -50%)', background: 'none', border: 'none', padding: 0,
              cursor: assetsReady ? 'pointer' : 'default', zIndex: 6 }} />
        </div>
      </motion.div>
    </>
  )
}
