import { CardSubtitle } from '../CardSubtitle'
import { CardMainTitle } from '../CardMainTitle'
import { IvoryCard } from '../IvoryCard'
import { ActionLink } from '../ActionLink'
import { ArrowUpRightIcon } from '../actionIcons'

const MAP_QUERY = 'La Perle du Lac, Tunis'
/** Embed Google Maps sans clé API (méthode `output=embed` classique, basée
 *  sur une requête texte géocodée par Google — jamais de coordonnées devinées). */
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
/** URL Google Maps réelle (itinéraire) — jamais une recherche Google générique. */
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`

/**
 * Carte "Le lieu" — dédiée à la carte interactive, distincte de la carte
 * florale "Informations". Fond ivoire/champagne (cf. IvoryCard), même
 * largeur/alignement extérieur que les autres cartes.
 */
export function LocationSection() {
  return (
    <IvoryCard id="lieu">
      <CardSubtitle>Le lieu</CardSubtitle>
      <CardMainTitle className="mt-2">Nous vous attendons</CardMainTitle>
      <div className="mx-auto mt-3 h-px w-11 bg-divider" />

      <p className="mx-auto mt-4 max-w-[34ch] font-accent text-sm leading-relaxed text-ink-700">
        Retrouvez-nous à La Perle du Lac, dans un cadre élégant au bord du lac de Tunis. Utilisez la carte
        ci-dessous pour préparer facilement votre arrivée.
      </p>

      <div
        className="mx-auto mt-6 w-full max-w-full overflow-hidden rounded-lg"
        style={{
          border: '1px solid color-mix(in srgb, var(--color-gold) 55%, transparent)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <iframe
          src={MAP_EMBED_URL}
          title="Carte de La Perle du Lac, Tunis"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full"
          style={{ height: 'clamp(160px, 45vw, 220px)', border: 0 }}
        />
      </div>

      {/* Sert à la fois d'action "itinéraire" et de solution de repli
          toujours visible si l'iframe ne charge pas (bloquée, hors-ligne…). */}
      <ActionLink href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="mt-4">
        Voir l’itinéraire
        <ArrowUpRightIcon className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </ActionLink>
    </IvoryCard>
  )
}
