import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { CarouselDots } from '@/design-system'
import {
  CoverCard,
  TimelineCard,
  ProgramCard,
  TributeCard,
  VenueInfoCard,
  GiftRegistryCard,
  RsvpCard,
} from './cards'

const CARDS = [CoverCard, TimelineCard, ProgramCard, TributeCard, VenueInfoCard, GiftRegistryCard, RsvpCard]

// background-card.png : 848 × 1264 = ratio 2:3 (0.671)
// Vrai portrait sans bordure noire — object-fit:cover remplit parfaitement le conteneur.
// height = width × (1264/848) = width × 1.491
const TRACK_STYLE = {
  '--card-w': 'min(90vw, 360px)',
  '--card-h': 'min(calc(var(--card-w) * 1.491), 78vh)',
  paddingInline: 'calc((100% - var(--card-w)) / 2)',
} as CSSProperties

interface CarouselSlideProps {
  index: number
  total: number
  scrollXProgress: MotionValue<number>
  active: boolean
  children: ReactNode
}

/**
 * Une carte du carousel. L'échelle/opacité/flou sont liés en continu à la
 * position de scroll réelle (pas seulement recalculés à l'arrivée) — c'est ce
 * qui donne la sensation d'inertie pendant le swipe, façon Apple Wallet.
 */
function CarouselSlide({ index, total, scrollXProgress, active, children }: CarouselSlideProps) {
  const step = 1 / (total - 1)
  const position = index * step

  // Les points d'ancrage doivent rester dans [0,1] (Framer Motion accélère ces
  // animations liées au scroll via la Web Animations API native, qui exige des
  // offsets dans cette plage) : on omet le point "prev"/"next" aux extrémités
  // plutôt que d'extrapoler en dehors.
  const inputRange: number[] = []
  const scaleRange: number[] = []
  const opacityRange: number[] = []
  const blurRange: number[] = []

  if (index > 0) {
    inputRange.push(position - step)
    scaleRange.push(0.86)
    opacityRange.push(0.38)
    blurRange.push(3)
  }
  inputRange.push(position)
  scaleRange.push(1)
  opacityRange.push(1)
  blurRange.push(0)
  if (index < total - 1) {
    inputRange.push(position + step)
    scaleRange.push(0.86)
    opacityRange.push(0.38)
    blurRange.push(3)
  }

  const scale = useTransform(scrollXProgress, inputRange, scaleRange)
  const opacity = useTransform(scrollXProgress, inputRange, opacityRange)
  const blurPx = useTransform(scrollXProgress, inputRange, blurRange)
  const filter = useTransform(blurPx, (value) => `blur(${value}px)`)

  return (
    <motion.div
      aria-roledescription="slide"
      aria-label={`Carte ${index + 1} sur ${total}`}
      aria-current={active ? 'true' : undefined}
      className="flex shrink-0 snap-center"
      style={{ width: 'var(--card-w)', height: 'var(--card-h)', scale, opacity, filter }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Le carousel "Apple Wallet" — Brand Book section 13 + storyboard frame 06.
 * Scroll-snap natif pour le swipe (momentum tactile natif, gratuit), Framer
 * Motion pilote l'habillage visuel continu par-dessus (échelle/flou/opacité
 * liés à la position de scroll réelle, pas à un index discret).
 */
export interface InvitationCardProps {
  /** Appelé depuis la dernière carte pour démarrer la vidéo conclusive. */
  onEnd?: () => void
}

export function InvitationCard({ onEnd }: InvitationCardProps = {}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollXProgress } = useScroll({ container: trackRef })

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(CARDS.length - 1, index))
    const card = track.children[clamped] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const handleScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const { scrollLeft, clientWidth, children } = track
        const viewportCenter = scrollLeft + clientWidth / 2
        let closest = 0
        let closestDistance = Infinity

        Array.from(children).forEach((child, index) => {
          const el = child as HTMLElement
          const cardCenter = el.offsetLeft + el.offsetWidth / 2
          const distance = Math.abs(cardCenter - viewportCenter)
          if (distance < closestDistance) {
            closestDistance = distance
            closest = index
          }
        })

        setActiveIndex(closest)
      })
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Cartes de l'invitation"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') scrollToIndex(activeIndex + 1)
          if (event.key === 'ArrowLeft') scrollToIndex(activeIndex - 1)
        }}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scrollbar-none pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={TRACK_STYLE}
      >
        {CARDS.map((Card, index) => (
          <CarouselSlide
            key={index}
            index={index}
            total={CARDS.length}
            scrollXProgress={scrollXProgress}
            active={index === activeIndex}
          >
            <Card />
          </CarouselSlide>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Carte précédente"
          disabled={activeIndex === 0}
          onClick={() => scrollToIndex(activeIndex - 1)}
          className="flex min-h-(--size-tap-min) min-w-(--size-tap-min) items-center justify-center font-sans text-lg text-accent-strong transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux disabled:opacity-30"
        >
          &larr;
        </button>
        <CarouselDots count={CARDS.length} activeIndex={activeIndex} onSelect={scrollToIndex} />
        <button
          type="button"
          aria-label="Carte suivante"
          disabled={activeIndex === CARDS.length - 1}
          onClick={() => scrollToIndex(activeIndex + 1)}
          className="flex min-h-(--size-tap-min) min-w-(--size-tap-min) items-center justify-center font-sans text-lg text-accent-strong transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux disabled:opacity-30"
        >
          &rarr;
        </button>
      </div>

      {/* Déclencheur vidéo conclusive — visible uniquement sur la dernière carte */}
      {onEnd && activeIndex === CARDS.length - 1 && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onEnd}
            className="flex min-h-(--size-tap-min) items-center justify-center px-4 font-sans text-label-xs uppercase tracking-widest text-accent-strong transition-opacity hover:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bordeaux"
          >
            ✦ &nbsp;Voir la vidéo&nbsp; ✦
          </button>
        </div>
      )}
    </div>
  )
}
