import { Button } from '@/design-system'
import { venueInfo, venueCtaLabel } from '@/data/wedding'

/**
 * 5. Informations pratiques.
 *   • venue.png (848×1264) — avion + coucher de soleil au-dessus du lieu — haut de carte
 *   • background-card.png — fond papier (via CardShell)
 *   • Informations pratiques en bas
 */
export function VenueInfoCard() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl"
      style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.20), 0 22px 44px -16px rgba(0,0,0,0.42), 0 52px 80px -36px rgba(0,0,0,0.32)' }}
    >
      {/* Fond carte */}
      <img
        src="/assets/cards/background-card.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: 'cover', display: 'block' }}
        draggable={false}
      />

      {/* venue.png — illustration haute en couleur */}
      <div className="absolute inset-x-0 top-0" style={{ height: '44%' }}>
        <img
          src="/assets/cards/venue.png"
          alt="La Perle du Lac au coucher du soleil"
          className="h-full w-full"
          style={{ objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }}
          draggable={false}
        />
        {/* Fondu vers le fond papier */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: '50%',
            background: 'linear-gradient(to bottom, transparent, var(--color-warm-white))',
          }}
        />
      </div>

      {/* Repère */}
      <span
        className="absolute right-[21%] top-[8.5%] font-sans tracking-wider"
        style={{
          fontSize: '0.75rem',
          color: 'var(--color-warm-white)',
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          zIndex: 2,
        }}
      >
        05 / 07
      </span>

      {/* Contenu — bas de la carte */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col"
        style={{ top: '46%', padding: '3% 20% 4%', zIndex: 1 }}
      >
        <div className="mb-2 text-center">
          <span className="font-sans text-label-xs uppercase tracking-widest text-accent">Informations</span>
          <div className="mt-1 font-display text-ink" style={{ fontSize: 'clamp(1.225rem, 4.2vw, 1.525rem)' }}>Pratique</div>
          <div className="mx-auto mt-1.5 h-px w-7 bg-divider" />
        </div>

        <dl className="flex flex-1 flex-col gap-2">
          {venueInfo.map((item) => (
            <div key={item.label}>
              <dt className="font-sans text-label-xs uppercase tracking-wide text-text-subtle">{item.label}</dt>
              <dd className="mt-0.5 font-body text-xs text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>

        <Button variant="secondary" className="mt-3 w-full justify-center text-xs">
          {venueCtaLabel}
        </Button>
      </div>
    </div>
  )
}
