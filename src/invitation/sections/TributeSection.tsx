import { PaperCard } from '../PaperCard'
import { CardSubtitle } from '../CardSubtitle'
import { CardMainTitle } from '../CardMainTitle'
import { Divider } from '@/design-system'
import { useRevealOnMount } from '@/motion/useRevealOnMount'
import { SOURATE_REFERENCE_CLASSNAME, SOURATE_REFERENCE_STYLE } from '../sourateReferenceStyle'

/* Chronologie (ms) de la révélation — jouée une seule fois après le premier
   rendu (cf. useRevealOnMount) : eyebrow → titre → filet → noms → ornement
   floral → texte d'hommage → verset → traduction+référence → ornement final.
   La carte se termine désormais après la référence de la sourate Al-Isrâ. */
const STAGGER = 70
const TITLE_DELAY = STAGGER
const DIVIDER_DELAY = TITLE_DELAY + STAGGER
const NAMES_DELAY = DIVIDER_DELAY + STAGGER
const ORNAMENT_DELAY = NAMES_DELAY + STAGGER
const PARAGRAPH_DELAY = ORNAMENT_DELAY + STAGGER
const VERSE_DELAY = PARAGRAPH_DELAY + STAGGER
const TRANSLATION_DELAY = VERSE_DELAY + STAGGER
const END_ORNAMENT_DELAY = TRANSLATION_DELAY + STAGGER

export function TributeSection() {
  const revealed = useRevealOnMount()
  const inClass = revealed ? ' trib-in' : ''

  return (
    <PaperCard>
      <div
        className="flex flex-col items-center gap-1 text-center"
        style={{ boxSizing: 'border-box', paddingInline: '4px' }}
      >
        <CardSubtitle className={`trib-reveal${inClass}`}>Hommage</CardSubtitle>

        <div className={`trib-reveal${inClass}`} style={{ animationDelay: `${TITLE_DELAY}ms` }}>
          <CardMainTitle style={{ fontSize: '32px' }}>À nos pères</CardMainTitle>
        </div>

        <div className={`trib-reveal${inClass}`} style={{ animationDelay: `${DIVIDER_DELAY}ms` }}>
          <Divider variant="accent" className="mx-auto" />
        </div>

        {/* Les deux pères — même hiérarchie pour les deux blocs (nom en
            font-display, lien familial plus petit et italique en dessous). */}
        <div
          className={`trib-reveal${inClass} flex flex-col items-center gap-3`}
          style={{ animationDelay: `${NAMES_DELAY}ms`, marginTop: 6 }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-display tracking-wide text-ink" style={{ fontSize: '1rem', lineHeight: 1.15 }}>
              Lahcen Oussaih
            </span>
            <span className="font-accent italic text-text-muted" style={{ fontSize: '0.8125rem', lineHeight: 1.3 }}>
              père de Rachid
            </span>
          </div>

          <div className="h-px w-8 bg-divider opacity-40" />

          <div className="flex flex-col items-center gap-0.5">
            <span className="font-display tracking-wide text-ink" style={{ fontSize: '1rem', lineHeight: 1.15 }}>
              Hamadi Yazidi
            </span>
            <span className="font-accent italic text-text-muted" style={{ fontSize: '0.8125rem', lineHeight: 1.3 }}>
              père de Douaa
            </span>
          </div>
        </div>

        {/* Séparateur floral — happiness-ornament.png, recoloré en brun bronze
            soutenu (voir asset) pour rester lisible sur le papier ivoire ;
            jamais tribute-flower.png (non transparent, moins lisible en
            petite taille). Largeur raffinée 90–110px, opacité proche de 0.85
            pour rester délicat sans devenir sombre ni dominant. */}
        <div
          className={`trib-reveal${inClass} w-full`}
          style={{ animationDelay: `${ORNAMENT_DELAY}ms`, marginTop: 10 }}
        >
          <img
            src="/assets/decorations/happiness-ornament.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="mx-auto block"
            style={{ width: 'clamp(90px, 20vw, 110px)', height: 'auto', objectFit: 'contain', opacity: 0.88 }}
          />
        </div>

        {/* Texte d'hommage — un seul paragraphe concis, largeur limitée pour
            des lignes harmonieuses, jamais justifié. */}
        <div
          className={`trib-reveal${inClass}`}
          style={{ animationDelay: `${PARAGRAPH_DELAY}ms`, marginTop: 12 }}
        >
          <p
            className="font-accent italic font-medium text-ink-800"
            style={{ fontSize: '0.875rem', lineHeight: 1.55, maxWidth: '42ch', margin: '0 auto' }}
          >
            À nos pères, dont l&rsquo;amour, les valeurs et les souvenirs continuent de vivre à travers nous. En ce
            jour précieux, vous demeurez à jamais dans nos cœurs.
          </p>
        </div>

        {/* Citation coranique — Amiri (font-arabic) : Cormorant Garamond ne
            contient aucun glyphe arabe (voir typography.css). Présentation
            typographique identique au verset de PhotoSection (même famille,
            taille, graisse, interligne, couleur, tashkeel et parenthèses
            coraniques ﴿ ﴾) pour une cohérence parfaite entre les deux cartes. */}
        <div
          className={`trib-reveal${inClass}`}
          style={{ animationDelay: `${VERSE_DELAY}ms`, marginTop: 20 }}
        >
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic"
            style={{
              fontSize: 'clamp(1.025rem, 3.6vw, 1.205rem)',
              lineHeight: 1.5,
              color: 'var(--color-ink)',
              letterSpacing: '0.025em',
              margin: '0 auto',
            }}
          >
            ﴿ رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا ﴾
          </p>
        </div>

        <div
          className={`trib-reveal${inClass} flex flex-col items-center`}
          style={{ animationDelay: `${TRANSLATION_DELAY}ms`, marginTop: 12, gap: 14 }}
        >
          <p
            className="font-accent italic text-text-muted"
            style={{ fontSize: '0.75rem', lineHeight: 1.3, maxWidth: '85%', margin: 0 }}
          >
            « Seigneur, fais-leur miséricorde comme ils ont pris soin de nous lorsque nous étions petits. »
          </p>
          <span className={SOURATE_REFERENCE_CLASSNAME} style={SOURATE_REFERENCE_STYLE}>
            Sourate Al-Isrâ (17:24)
          </span>
        </div>

        {/* Ornement final — même clôture discrète que sur les autres cartes,
            conservée après la suppression de l'invocation finale. */}
        <span
          className={`trib-reveal${inClass} font-accent text-sm text-divider`}
          style={{ animationDelay: `${END_ORNAMENT_DELAY}ms`, marginTop: 2 }}
          aria-hidden="true"
        >
          &#10022;
        </span>
      </div>
    </PaperCard>
  )
}
