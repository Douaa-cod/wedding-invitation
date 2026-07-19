import gsap from 'gsap'

/**
 * Singleton audio pour la musique de fond.
 * Démarre uniquement après un geste utilisateur (conformité autoplay navigateurs).
 * Ne plante pas si le fichier est absent.
 */

const TARGET_VOLUME = 0.25 // dans la plage demandée 0.2–0.3
const FADE_IN_DURATION = 1.8 // dans la plage demandée 1.5s–2s

let _audio: HTMLAudioElement | null = null
let _fadeTween: gsap.core.Tween | null = null

export const audioManager = {
  /** Démarre la musique avec un fondu d'entrée. Doit être appelé une fois la
   *  carte de couverture stabilisée — jamais avant. Une seule instance. */
  start() {
    if (_audio) return
    try {
      const audio = new Audio('/assets/audio/background-music.mp3')
      audio.loop = true
      audio.volume = 0
      _audio = audio
      audio.play()
        ?.then(() => {
          _fadeTween?.kill()
          _fadeTween = gsap.to(audio, { volume: TARGET_VOLUME, duration: FADE_IN_DURATION, ease: 'sine.inOut' })
        })
        .catch(() => { /* fichier absent ou politique autoplay — silencieux */ })
    } catch {
      /* silencieux */
    }
  },

  /** Bascule mute/unmute. Retourne l'état muted après bascule. */
  toggleMute(): boolean {
    if (!_audio) return true
    _audio.muted = !_audio.muted
    return _audio.muted
  },

  get muted(): boolean {
    return _audio?.muted ?? false
  },

  get isPlaying(): boolean {
    return _audio !== null && !_audio.paused
  },
}
