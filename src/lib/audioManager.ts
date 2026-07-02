/**
 * Singleton audio pour la musique de fond.
 * Démarre uniquement après un geste utilisateur (conformité autoplay navigateurs).
 * Ne plante pas si le fichier est absent.
 */

let _audio: HTMLAudioElement | null = null

export const audioManager = {
  /** Démarre la musique. Doit être appelé dans un handler utilisateur. */
  start() {
    if (_audio) return
    try {
      _audio = new Audio('/assets/audio/background-music.mp3')
      _audio.loop = true
      _audio.volume = 0.25
      _audio.play().catch(() => { /* fichier absent ou politique autoplay — silencieux */ })
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
