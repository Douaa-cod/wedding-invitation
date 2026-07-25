import { useEffect, useState } from 'react'

/**
 * Révèle une seule fois, juste après le premier rendu — jamais rejoué : ni
 * au scroll (aucun IntersectionObserver ici), ni à un rerender du parent, ni
 * à un changement de valeur externe (compte à rebours, etc.), seulement à un
 * véritable rechargement de page (qui remonte le composant).
 *
 * L'état initial (false) est peint une première fois AVANT que l'effet ne
 * bascule à true — c'est ce décalage post-peinture qui crée l'animation
 * d'entrée elle-même (sans lui, le contenu apparaîtrait déjà révélé dès le
 * tout premier rendu, sans transition visible). React Strict Mode peut
 * appeler cet effet deux fois en développement : `setRevealed(true)` est
 * idempotent (même valeur les deux fois), donc aucun rejeu observable.
 */
export function useRevealOnMount(): boolean {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- volontaire : la transition doit se jouer APRÈS la première peinture (état cache), un initialiseur paresseux ne peindrait jamais l'état masqué.
    setRevealed(true)
  }, [])

  return revealed
}
