import { Showcase } from '@/design-system/Showcase'
import { InvitationPage } from '@/invitation/InvitationPage'

const showDesignSystem =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('ds')

/**
 * Flow définitif : une seule page, toujours montée. L'enveloppe est un
 * calque visuel géré en interne par InvitationPage (voir ce fichier) — la
 * carte de couverture ne change jamais d'instance du chargement jusqu'au
 * scroll final.
 */
function App() {
  if (showDesignSystem) {
    return <Showcase />
  }

  return <InvitationPage />
}

export default App
