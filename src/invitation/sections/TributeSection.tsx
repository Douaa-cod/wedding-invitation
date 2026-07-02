import { PaperCard } from '../PaperCard'

export function TributeSection() {
  return (
    <PaperCard eyebrow="Hommage" title="À nos pères">
      <div className="flex flex-col items-center gap-5 text-center">

        {/* Père de Rachid — cité en premier */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-base text-ink">Lahcin Oussaih</span>
          <span className="font-accent text-xs italic text-text-muted">père de Rachid</span>
        </div>

        <div className="h-px w-10 bg-divider opacity-40" />

        {/* Père de Douaa */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-base text-ink">Hamdi Yazidi</span>
          <span className="font-accent text-xs italic text-text-muted">père de Douaa</span>
        </div>

        <div className="h-px w-6 bg-divider opacity-30" />

        <p className="font-body text-xs leading-relaxed text-text-faint" style={{ maxWidth: '88%' }}>
          Leur présence demeure dans nos cœurs<br />
          et nous accompagne pour toujours.
        </p>

        <span className="font-accent text-xl text-divider">&#10022;</span>
      </div>
    </PaperCard>
  )
}
