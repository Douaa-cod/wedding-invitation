import { PaperCard } from '../PaperCard'
import { venueInfo } from '@/data/wedding'

const MAPS_URL = 'https://share.google/5tLCOEXCZ38RKkUeN'

export function VenueSection() {
  return (
    <PaperCard eyebrow="Informations" title="Pratique">
      <dl className="flex flex-col gap-4">
        {venueInfo.map((item) => (
          <div key={item.label}>
            <dt className="font-sans text-label-2xs uppercase tracking-wide text-accent">{item.label}</dt>
            <dd className="mt-1 font-body text-sm text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>

      <a
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 rounded-full border border-accent px-6 py-2.5 font-sans text-label-xs uppercase tracking-wide text-accent-strong transition-colors hover:bg-accent/5"
      >
        Voir la localisation
      </a>
    </PaperCard>
  )
}
