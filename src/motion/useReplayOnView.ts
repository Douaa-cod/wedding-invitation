import { useEffect, useRef, useState } from 'react'

export interface UseReplayOnViewOptions {
  /** Fraction visible (0–1) déclenchant la révélation, défaut 0.25. */
  threshold?: number
  /** Réduit la zone de détection du viewport, défaut '0px 0px -10% 0px'. */
  rootMargin?: string
}

/**
 * Rejoue une révélation à chaque passage dans le viewport : visible à
 * ≥`threshold` → `revealed=true` (joue la séquence) ; sort du viewport →
 * `revealed=false` (réinitialise l'état, instantané) ; un nouveau passage
 * rejoue donc la séquence complète depuis le début.
 *
 * L'observer n'est JAMAIS déconnecté après un déclenchement — seulement au
 * démontage — et l'effet ne dépend d'aucune valeur externe changeante
 * (tableau de dépendances vide) : un tick ou un rerender du composant
 * appelant ne peut donc jamais le recréer ni interrompre l'animation en
 * cours. Navigateur sans IntersectionObserver → toujours révélé, dès le
 * départ (initialiseur paresseux, jamais un setState() synchrone dans
 * l'effet).
 */
export function useReplayOnView<T extends HTMLElement>({
  threshold = 0.25,
  rootMargin = '0px 0px -10% 0px',
}: UseReplayOnViewOptions = {}) {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setRevealed(true)
        } else {
          setRevealed(false)
        }
      },
      { threshold: [0, threshold], rootMargin }
    )
    observer.observe(el)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- threshold/rootMargin sont des réglages figés, jamais recréés pendant la vie du composant.
  }, [])

  return { ref, revealed }
}
