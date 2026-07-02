import { useState } from 'react'
import {
  Badge,
  Button,
  CarouselDots,
  Divider,
  Eyebrow,
  GrainOverlay,
  Heading,
  Input,
  PremiumCard,
  Select,
  SectionMarker,
  Tag,
  Textarea,
  ToggleGroup,
  CeremonyIcon,
  ClockIcon,
  DinnerIcon,
  GiftIcon,
  HotelIcon,
  LocationIcon,
  ParkingIcon,
  RsvpIcon,
  TransportIcon,
  TravelIcon,
} from '@/design-system'
import { FlightPath, Monogram, WaxSeal } from '@/motifs'

const ICONS = [
  { Icon: LocationIcon, label: 'Lieu' },
  { Icon: ClockIcon, label: 'Heure' },
  { Icon: CeremonyIcon, label: 'Cérémonie' },
  { Icon: DinnerIcon, label: 'Dîner' },
  { Icon: ParkingIcon, label: 'Parking' },
  { Icon: HotelIcon, label: 'Hôtel' },
  { Icon: GiftIcon, label: 'Cadeau' },
  { Icon: RsvpIcon, label: 'RSVP' },
  { Icon: TransportIcon, label: 'Transport' },
  { Icon: TravelIcon, label: 'Voyage' },
]

const PALETTE = [
  { name: 'Warm White', token: 'bg-warm-white', hex: '#FAF7F2' },
  { name: 'Natural Linen', token: 'bg-linen', hex: '#EFE8DD' },
  { name: 'Travertine', token: 'bg-travertine', hex: '#D7CCBC' },
  { name: 'Soft Sand', token: 'bg-soft-sand', hex: '#CBB39A' },
  { name: 'Bronze Gold', token: 'bg-bronze', hex: '#A67C52' },
  { name: 'Camel', token: 'bg-camel', hex: '#BC9475' },
  { name: 'Gold (filets)', token: 'bg-gold', hex: '#C2A878' },
  { name: 'Mediterranean Blue', token: 'bg-mediterranean-blue', hex: '#A7C7D9' },
  { name: 'Olive Leaf', token: 'bg-olive', hex: '#8B8C6F' },
  { name: 'Deep Sea', token: 'bg-deep-sea', hex: '#22313F' },
]

function Block({
  index,
  label,
  title,
  children,
}: {
  index: string
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-[1100px] px-8 py-16">
      <SectionMarker index={index} label={label} className="mb-12" />
      <Heading level="h2" className="mb-10 text-[2.25rem]">
        {title}
      </Heading>
      {children}
    </section>
  )
}

/** Page de démonstration interne du Design System — dev only, voir App.tsx (?ds=1). */
export function Showcase() {
  const [tagActive, setTagActive] = useState('Dîner')
  const [rsvp, setRsvp] = useState('oui')
  const [dotIndex, setDotIndex] = useState(0)
  const [grain, setGrain] = useState(true)

  return (
    <div className="relative">
      <GrainOverlay enabled={grain} />

      <div className="relative z-10">
        <header className="mx-auto flex max-w-[1100px] flex-col items-center gap-6 px-8 pb-12 pt-20 text-center">
          <Eyebrow>Design System &middot; Fondations</Eyebrow>
          <Heading level="h1">
            Douaa <em>&amp;</em> Rachid
          </Heading>
          <p className="max-w-xl font-body text-base leading-7 text-text-muted">
            Page de démonstration interne — vérification visuelle des tokens et des composants
            avant le développement des écrans. Ne fait pas partie de l'invitation finale.
          </p>
          <Button variant="secondary" onClick={() => setGrain((g) => !g)}>
            {grain ? 'Désactiver le grain' : 'Activer le grain'}
          </Button>
        </header>

        <Block index="01" label="Palette de couleurs" title="Perle au couchant">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {PALETTE.map((color) => (
              <div key={color.name}>
                <div className={`h-24 rounded-sm shadow-soft ${color.token}`} />
                <div className="mt-3 font-display text-sm text-ink">{color.name}</div>
                <div className="font-sans text-label-xs tracking-label text-text-subtle">
                  {color.hex}
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block index="02" label="Typographies" title="Le système typographique">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
            <div className="bg-card p-10">
              <Eyebrow>Titres &middot; Display</Eyebrow>
              <div className="mt-4 font-display text-[4rem] text-ink">Aa</div>
              <div className="mt-1 font-display text-2xl text-ink-800">Playfair Display</div>
            </div>
            <div className="bg-card p-10">
              <Eyebrow>Sous-titres &middot; Serif</Eyebrow>
              <div className="mt-4 font-accent text-[4rem] font-light text-ink">Aa</div>
              <div className="mt-1 font-accent text-2xl text-ink-800">Cormorant Garamond</div>
            </div>
            <div className="bg-card p-10">
              <Eyebrow>Labels &amp; UI &middot; Sans</Eyebrow>
              <div className="mt-4 font-sans text-[4rem] text-ink">Aa</div>
              <div className="mt-1 font-sans text-2xl text-ink-800">Montserrat</div>
            </div>
            <div className="bg-card p-10">
              <Eyebrow>Texte courant &middot; Serif</Eyebrow>
              <div className="mt-4 font-body text-[4rem] text-ink">Aa</div>
              <div className="mt-1 font-body text-2xl text-ink-800">Lora</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-sm border border-border bg-card p-10">
            <div className="flex items-baseline gap-6">
              <span className="w-16 font-sans text-label-sm text-ink-200">H1</span>
              <Heading as="span" level="h1" className="text-[2.875rem]">
                Douaa &amp; Rachid
              </Heading>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="w-16 font-sans text-label-sm text-ink-200">H2</span>
              <Heading as="span" level="h2" className="text-[2.125rem]">
                Notre histoire
              </Heading>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="w-16 font-sans text-label-sm text-ink-200">Quote</span>
              <span className="font-accent text-quote italic text-text-muted">
                De deux cultures, un seul cœur.
              </span>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="w-16 font-sans text-label-sm text-ink-200">Body</span>
              <span className="font-body text-base text-text">
                La cérémonie débutera à 18 h au bord du lac.
              </span>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="w-16 font-sans text-label-sm text-ink-200">Label</span>
              <span className="font-sans text-label-sm uppercase tracking-widest text-text">
                Informations pratiques
              </span>
            </div>
          </div>
        </Block>

        <Block index="03" label="Boutons" title="Les boutons">
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="primary">Répondre</Button>
            <Button variant="secondary">Voir sur la carte</Button>
            <Button variant="text" endIcon="→">
              Découvrir
            </Button>
            <div className="rounded-sm bg-reverse-bg p-4">
              <Button variant="reverse">Voir la liste</Button>
            </div>
            <Button variant="primary" disabled>
              Indisponible
            </Button>
          </div>
        </Block>

        <Block index="04" label="Champs de formulaire" title="Les champs">
          <div className="grid max-w-xl grid-cols-1 gap-5">
            <Input label="Nom & prénom" placeholder="Douaa Yazidi" />
            <Select label="Nombre de personnes" defaultValue="2">
              <option value="1">1 invité</option>
              <option value="2">2 invités</option>
              <option value="3">3 invités</option>
            </Select>
            <Textarea label="Remarques" placeholder="Allergies, régime…" />
          </div>
        </Block>

        <Block index="05" label="Sélecteurs & états" title="Sélecteurs et états">
          <div className="flex flex-col gap-10">
            <div>
              <Eyebrow className="mb-3 text-text-subtle">Choix Oui / Non</Eyebrow>
              <ToggleGroup
                name="rsvp-demo"
                value={rsvp}
                onChange={setRsvp}
                options={[
                  { value: 'oui', label: 'Oui' },
                  { value: 'non', label: 'Non' },
                ]}
              />
            </div>
            <div>
              <Eyebrow className="mb-3 text-text-subtle">Étiquettes / tags</Eyebrow>
              <div className="flex flex-wrap gap-2">
                {['Cérémonie', 'Dîner', 'Soirée'].map((label) => (
                  <Tag key={label} active={tagActive === label} onClick={() => setTagActive(label)}>
                    {label}
                  </Tag>
                ))}
              </div>
            </div>
            <div>
              <Eyebrow className="mb-3 text-text-subtle">Pagination du carousel</Eyebrow>
              <CarouselDots count={5} activeIndex={dotIndex} onSelect={setDotIndex} />
            </div>
            <div>
              <Eyebrow className="mb-3 text-text-subtle">Badge</Eyebrow>
              <Badge>14 · 11 · 2026</Badge>
            </div>
          </div>
        </Block>

        <Block index="06" label="Conteneurs" title="Conteneurs">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <PremiumCard className="p-7">
              <Eyebrow>Carte</Eyebrow>
              <div className="mt-2 font-display text-lg text-ink">Conteneur premium</div>
              <div className="mt-1.5 font-body text-sm text-text-faint">
                Coin doux 10px · bordure dorée · ombre portée douce.
              </div>
            </PremiumCard>
            <PremiumCard reverse className="p-7">
              <Eyebrow className="text-reverse-accent">Reverse</Eyebrow>
              <div className="mt-2 font-display text-lg text-reverse-text">Mode nuit</div>
              <div className="mt-1.5 font-body text-sm text-reverse-text-muted">
                Variante deep-sea pour les contextes sombres.
              </div>
            </PremiumCard>
          </div>

          <div className="mt-8 space-y-3">
            <Eyebrow className="text-text-subtle">Filets</Eyebrow>
            <Divider variant="fade" />
            <Divider variant="accent" />
            <Divider variant="diamond" />
          </div>
        </Block>

        <Block index="07" label="Icônes" title="Jeu d'icônes — filet fin doré">
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-5">
            {ICONS.map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-4 bg-card px-4 py-8">
                <Icon className="h-8 w-8 text-accent" />
                <span className="font-sans text-label-xs uppercase tracking-wide text-text-faint">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Block>

        <Block index="08" label="Motifs de marque" title="Logo, sceau & ligne de vol">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <PremiumCard className="flex flex-col items-center justify-center gap-6 p-10">
              <Monogram variant="horizontal" size={56} />
              <span className="font-sans text-label-xs uppercase tracking-wide text-text-faint">
                Horizontal
              </span>
            </PremiumCard>
            <PremiumCard className="flex flex-col items-center justify-center gap-6 p-10">
              <Monogram variant="circled" size={140} />
              <span className="font-sans text-label-xs uppercase tracking-wide text-text-faint">
                Circled
              </span>
            </PremiumCard>
            <PremiumCard className="flex flex-col items-center justify-center gap-6 p-10">
              <Monogram variant="with-names" size={40} />
              <span className="font-sans text-label-xs uppercase tracking-wide text-text-faint">
                Avec noms
              </span>
            </PremiumCard>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <PremiumCard className="flex items-center justify-center p-10">
              <WaxSeal size={140} />
            </PremiumCard>
            <PremiumCard className="flex items-center justify-center p-10">
              <FlightPath className="h-auto w-full text-accent" />
            </PremiumCard>
          </div>
        </Block>

        <footer className="mt-8 bg-reverse-bg px-8 py-16 text-center">
          <Monogram variant="horizontal" size={36} reverse />
          <Divider variant="diamond" className="mx-auto my-6 max-w-[420px]" />
          <p className="font-sans text-label-xs uppercase tracking-widest text-reverse-text-muted">
            Mediterranean Quiet Luxury — fondations prêtes
          </p>
        </footer>
      </div>
    </div>
  )
}
