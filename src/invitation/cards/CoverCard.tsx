import { couple, culturalPhrase } from '@/data/wedding'

/**
 * 1. Carte de couverture — assets réels.
 *   • cover-photo.jpg  : photo de la cérémonie en full-bleed (haut de carte)
 *   • ornament-top.png : médaillon circulaire embossé à la jonction photo/texte
 *   • background-card.png : fond papier (géré par CardShell)
 */
export function CoverCard() {
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

      {/* Photo de la cérémonie — haut de la carte, 48% de hauteur */}
      <div className="absolute inset-x-0 top-0" style={{ height: '48%' }}>
        <img
          src="/assets/cards/cover-photo.jpg"
          alt="La Perle du Lac — cérémonie au coucher du soleil"
          className="h-full w-full"
          style={{ objectFit: 'cover', objectPosition: 'center 35%', display: 'block' }}
          draggable={false}
        />
        {/* Fondu bas de la photo vers le fond carte */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: '45%',
            background: 'linear-gradient(to bottom, transparent, var(--color-warm-white))',
          }}
        />
      </div>

      {/* Médaillon ornement — centré à la jonction photo/texte */}
      <div
        className="absolute left-1/2"
        style={{ top: '42%', width: '26%', aspectRatio: '1', transform: 'translate(-50%, -50%)', zIndex: 2 }}
      >
        <img
          src="/assets/decorations/ornament-top.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full"
          style={{ objectFit: 'contain', display: 'block' }}
          draggable={false}
        />
      </div>

      {/* Zone de texte — bas de la carte */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center"
        style={{ top: '52%', padding: '3% 20% 6%', zIndex: 1 }}
      >
        <span className="font-sans text-label-xs uppercase tracking-widest text-dusk-sky">
          Tu es invité(e) au mariage de
        </span>

        <div className="mt-2 flex flex-col items-center gap-0.5">
          <span className="font-display leading-tight text-ink" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>
            {couple.groomFirstName} Oussaih
          </span>
          <span className="font-accent italic" style={{ fontSize: 'clamp(1.3rem, 5vw, 1.7rem)', color: 'var(--color-gold)' }}>
            &amp;
          </span>
          <span className="font-display leading-tight text-ink" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)' }}>
            {couple.brideFirstName} Yazidi
          </span>
        </div>

        <div className="my-2 h-px w-8 bg-divider" />

        <time dateTime="2026-11-14" className="font-display text-ink" style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', lineHeight: 1 }}>
          14 Novembre 2026
        </time>

        <span className="mt-1 font-accent text-xs italic text-text-muted">
          {couple.venueName} &middot; {couple.cityLabel}
        </span>

        <p
          className="mt-2 font-accent italic text-text-faint"
          style={{ fontSize: '0.66rem', lineHeight: 1.5, maxWidth: '80%' }}
        >
          {culturalPhrase}
        </p>
      </div>
    </div>
  )
}
