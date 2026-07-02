import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Showcase } from '@/design-system/Showcase'
import { LuxuryEnvelope } from '@/journey/LuxuryEnvelope'
import { InvitationPage } from '@/invitation/InvitationPage'

const showDesignSystem =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('ds')

/**
 * Flow définitif :
 *   envelope → invitation (page scroll vertical, 8 sections)
 */
type Phase = 'envelope' | 'invitation'

function App() {
  const [phase, setPhase] = useState<Phase>('envelope')

  /* Thème lake blue uniquement pour la page d'invitation. */
  useEffect(() => {
    const el = document.documentElement
    if (phase === 'invitation') {
      el.dataset.theme = 'lake'
    } else {
      delete el.dataset.theme
    }
  }, [phase])

  if (showDesignSystem) {
    return <Showcase />
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'envelope' && (
          <LuxuryEnvelope key="envelope" onOpened={() => setPhase('invitation')} />
        )}

        {phase === 'invitation' && (
          <InvitationPage key="invitation" />
        )}
      </AnimatePresence>

      {/* Raccourci dev */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-2 left-2 z-50 flex gap-1" style={{ opacity: 0.35 }}>
          {(['envelope', 'invitation'] as Phase[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPhase(p)}
              className="rounded bg-black/60 px-1.5 py-0.5 font-sans text-white"
              style={{ fontSize: 9 }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default App
