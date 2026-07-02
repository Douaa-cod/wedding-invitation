import { PaperCard } from '../PaperCard'
import { GiftIcon } from '@/design-system'
import { giftRegistry } from '@/data/wedding'

export function GiftSection() {
  return (
    <PaperCard eyebrow={giftRegistry.eyebrow} title={giftRegistry.title}>
      <div className="flex flex-col items-center gap-4 text-center">
        <GiftIcon className="h-9 w-9 text-accent" />
        <p className="font-body text-sm leading-relaxed text-text">{giftRegistry.message}</p>
      </div>
    </PaperCard>
  )
}
