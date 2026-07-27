import type { CSSProperties } from 'react'

/**
 * Déclaration typographique partagée par les deux références de sourate de
 * l'invitation ("Sourate Al-Isrâ (17:24)" sur la carte Hommage, "Sourate
 * Ar-Rûm (30:21)" sur la carte photo finale) — une seule source de vérité,
 * jamais de valeurs divergentes d'une carte à l'autre pour ce même rôle
 * (cf. cardMainTitleStyle.ts pour le même principe appliqué aux titres).
 */
export const SOURATE_REFERENCE_STYLE: CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: 1.4,
  color: 'var(--color-dusk-sky-text, #3c6a8c)',
  opacity: 0.85,
}

export const SOURATE_REFERENCE_CLASSNAME = 'font-sans uppercase tracking-wide'
