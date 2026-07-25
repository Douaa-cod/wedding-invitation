import type { CSSProperties } from 'react'

/**
 * Taille rendue partagée par tous les titres principaux décoratifs —
 * "Notre chemin", "La soirée", "Pratique", "Confirmez", "À nos pères",
 * "Notre bonheur commence ici" : une seule déclaration, jamais un clamp ou
 * une taille divergente d'une carte à l'autre pour ce même rôle. Fichier
 * séparé de CardMainTitle.tsx (react-refresh interdit d'exporter une
 * constante aux côtés d'un composant) pour rester utilisable telle quelle
 * par les titres qui doivent rester un élément animé (motion.h2).
 */
export const CARD_MAIN_TITLE_STYLE: CSSProperties = {
  fontFamily: "'Great Vibes', cursive",
  fontSize: '36px',
  fontWeight: 400,
  lineHeight: 1.15,
  textAlign: 'center',
}
