import { Button, GiftIcon } from '@/design-system'
import { CardShell } from '../CardShell'
import { giftRegistry } from '@/data/wedding'

/** 6. Cadeau Maison — bouton inerte pour l'instant (pas de logique backend). */
export function GiftRegistryCard() {
  return (
    <CardShell
     
      eyebrow={giftRegistry.eyebrow}
      title={giftRegistry.title}
      index="06 / 07"
      footer={
        <Button variant="primary" className="w-full justify-center">
          {giftRegistry.ctaLabel}
        </Button>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <GiftIcon className="h-9 w-9 text-accent" />
        <p className="font-body text-sm leading-relaxed text-text">{giftRegistry.message}</p>
      </div>
    </CardShell>
  )
}
