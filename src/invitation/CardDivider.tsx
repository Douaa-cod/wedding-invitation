import { cn } from '@/lib/cn'

export interface CardDividerProps {
  className?: string
}

/**
 * Filet doré de clôture — un seul par carte, toujours dans la zone centrale
 * sécurisée (jamais sur les floraux gaufrées du cadre). Asset PNG existant,
 * jamais recréé en CSS : la transparence et les proportions d'origine sont
 * préservées via object-fit: contain.
 */
export function CardDivider({ className }: CardDividerProps) {
  return (
    <img
      src="/assets/decorations/divider-gold.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn('mx-auto block', className)}
      style={{ width: 'min(65%, 260px)', height: 'auto', objectFit: 'contain' }}
    />
  )
}
