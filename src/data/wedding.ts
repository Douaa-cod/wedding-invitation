export interface Couple {
  brideFirstName: string
  brideName: string
  groomFirstName: string
  groomName: string
  dateLabel: string
  venueName: string
  cityLabel: string
}

/** Date exacte de la cérémonie (18h, heure de Tunis UTC+1) — pour le compteur. */
export const weddingDate = new Date('2026-11-14T18:00:00+01:00')

export const couple: Couple = {
  brideFirstName: 'Douaa',
  brideName: 'Douaa',
  groomFirstName: 'Rachid',
  groomName: 'Rachid',
  dateLabel: '14 · 11 · 2026',
  venueName: 'La Perle du Lac',
  cityLabel: 'Tunis',
}

export interface TimelineMilestone {
  dateLabel: string
  title: string
  highlight?: boolean
}

export const timelineMilestones: TimelineMilestone[] = [
  { dateLabel: '17 déc. 2025', title: 'Demande en mariage' },
  { dateLabel: '14 fév. 2026', title: 'Fiançailles' },
  { dateLabel: '14 avr. 2026', title: 'Acte de mariage' },
  { dateLabel: '14 nov. 2026', title: 'Le grand jour', highlight: true },
]

export interface ProgramItem {
  time: string
  title: string
  subtitle: string
}

export const programItems: ProgramItem[] = [
  {
    time: '17:30',
    title: 'Douceur au coucher du soleil',
    subtitle: 'Accueil au bord du lac autour d’un rafraîchissement, face au coucher du soleil.',
  },
  {
    time: '19:30',
    title: 'Dîner sous le signe du partage',
    subtitle: 'Un dîner tunisien, délicatement sublimé d’une touche marocaine.',
  },
  {
    time: '21:00',
    title: 'Célébrons ensemble',
    subtitle: 'Musique, rires et danse pour prolonger cette belle soirée.',
  },
]

export interface TributeContent {
  eyebrow: string
  title: string
  message: string
  footnote: string
}

export const tribute: TributeContent = {
  eyebrow: 'Hommage',
  title: 'À nos pères',
  message:
    "En ce jour précieux, une pensée pleine d'amour pour Hamdi Yazidi, père de Douaa, et pour le père de Rachid.",
  footnote: 'Leur présence demeure dans nos cœurs et nous accompagne pour toujours.',
}

export interface VenueInfoItem {
  label: string
  value: string
}

export const venueInfo: VenueInfoItem[] = [
  { label: 'Lieu', value: 'La Perle du Lac, Tunis' },
  { label: 'Date', value: '14 novembre 2026' },
  { label: 'Heure', value: '17h30' },
  { label: 'Dress code', value: 'Chic & Élégant' },
  { label: 'Dîner', value: 'Tunisien avec une touche marocaine' },
  { label: 'Soirée', value: 'Jusqu’à 23h00' },
]

export const venueCtaLabel = 'Voir sur la carte'

export interface GiftRegistryContent {
  eyebrow: string
  title: string
  message: string
  ctaLabel: string
}

export const giftRegistry: GiftRegistryContent = {
  eyebrow: 'Cadeau',
  title: 'Cadeau Maison',
  message:
    "Votre présence est notre plus beau cadeau. Si vous le souhaitez, participez à l'aménagement de notre futur foyer.",
  ctaLabel: 'Voir la liste',
}

export interface RsvpContent {
  eyebrow: string
  title: string
  deadlineLabel: string
  message: string
  ctaLabel: string
}

/** Carte teaser uniquement pour l'instant — le vrai formulaire est une étape future. */
export const rsvp: RsvpContent = {
  eyebrow: '',
  title: 'Confirmez',
  deadlineLabel: 'SVP avant le 15 octobre 2026',
  message: 'Le formulaire de réponse sera bientôt disponible.',
  ctaLabel: 'Répondre',
}

/**
 * Identité culturelle — trois pays, une seule histoire.
 * Affiché sur l'écran splash avant l'ouverture de l'invitation.
 */
export const culturalPhrase = 'De Tunis à Paris, le Maroc dans le cœur — une seule histoire.'

export const cultures = [
  { label: 'Tunisie', detail: 'Douaa · La Perle du Lac' },
  { label: 'France', detail: 'Rachid · Paris' },
  { label: 'Maroc', detail: 'Les racines de Rachid' },
] as const
