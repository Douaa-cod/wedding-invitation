import { cn } from '@/lib/cn'

const TONES = {
  bronze:   { from: '#CDA070', mid: '#A67C52', to: '#835E36', insetDark: 'rgba(70,44,20,0.4)',   monogram: '#7C5630' },
  deepsea:  { from: '#3A5566', mid: '#22313F', to: '#15222C', insetDark: 'rgba(10,20,28,0.5)',   monogram: 'rgba(239,232,221,0.65)' },
  olive:    { from: '#B7B58C', mid: '#8B8C6F', to: '#61624A', insetDark: 'rgba(50,52,32,0.45)', monogram: 'rgba(250,247,242,0.6)' },
  ivoire:   { from: '#EDE2CF', mid: '#D7CCBC', to: '#B7A88F', insetDark: 'rgba(120,100,72,0.32)', monogram: '#7A6A52' },
  /** Cire rouge bordeaux — invitations de luxe françaises (Cartier, Hermès). */
  bordeaux: { from: '#C05070', mid: '#8B2436', to: '#4A0E1C', insetDark: 'rgba(50,4,14,0.52)',  monogram: 'rgba(255,220,218,0.72)' },
} as const

export interface WaxSealProps {
  tone?: keyof typeof TONES
  size?: number
  className?: string
}

/**
 * Le sceau de cire — Brand Book section 08 "Cachet en cire". Finition mate, jamais
 * brillante. Élément purement visuel ici ; le geste "presser pour ouvrir" appartient
 * au composant de parcours `Envelope`, pas à cette brique du design system.
 */
export function WaxSeal({ tone = 'bronze', size = 188, className }: WaxSealProps) {
  const t = TONES[tone]
  const letterSize = size * 0.33
  const ampersandSize = size * 0.21

  return (
    <div
      className={cn('relative flex items-center justify-center rounded-full', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 38% 30%, ${t.from} 0%, ${t.mid} 46%, ${t.to} 100%)`,
        boxShadow: `inset 0 -10px 22px ${t.insetDark}, inset 0 9px 16px rgba(255,235,210,0.35), 0 20px 40px rgba(120,80,40,0.34)`,
      }}
    >
      <div
        className="absolute rounded-full border"
        style={{ inset: size * 0.09, borderColor: 'rgba(90,62,32,0.4)' }}
      />
      <span className="flex items-center gap-1 leading-[0.8]" style={{ color: t.monogram }}>
        <span className="font-accent font-medium" style={{ fontSize: letterSize }}>
          R
        </span>
        <span className="font-accent font-medium" style={{ fontSize: ampersandSize }}>
          &amp;
        </span>
        <span className="font-accent font-medium" style={{ fontSize: letterSize }}>
          D
        </span>
      </span>
    </div>
  )
}
