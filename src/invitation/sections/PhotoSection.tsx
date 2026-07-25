import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CardDivider } from '../CardDivider'
import { CARD_MAIN_TITLE_STYLE } from '../cardMainTitleStyle'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* Même plancher discret que PaperCard (voir ce fichier) — jamais un plafond,
   jamais une hauteur forcée identique entre les cartes. */
const CARD_MIN_HEIGHT = 'clamp(200px, 26vw, 260px)'

/**
 * Section photo finale — remplace la vidéo.
 * Image couple.jpeg avec fond papier premium, titre élégant et citation.
 * Note : le fichier est couple.jpeg (1600×1066 px, paysage).
 */
export function PhotoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1.1, ease: EASE }}
      className="relative flex w-full flex-col overflow-hidden rounded-3xl"
      style={{
        height: 'auto',
        minHeight: CARD_MIN_HEIGHT,
        boxShadow:
          '0 4px 12px rgba(0,0,0,0.10), 0 20px 42px rgba(0,0,0,0.16), 0 48px 80px rgba(0,0,0,0.12)',
      }}
    >
      {/* Fond papier ivoire */}
      <img
        src="/assets/cards/background-card.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: 'cover', display: 'block' }}
        draggable={false}
      />

      {/* Contenu — colonne flex, hauteur pilotée par le contenu : le filet
          final suit toujours la fin du contenu réel, jamais en position
          absolue et jamais étiré en bas d'un espace vide. */}
      <div className="relative z-10 flex flex-col items-center px-5 py-10 text-center">
        <div className="flex flex-col items-center gap-7">

          {/* Titre */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="text-ink"
            style={CARD_MAIN_TITLE_STYLE}
          >
            Notre bonheur commence ici
          </motion.h2>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, ease: EASE, delay: 0.22 }}
            style={{ width: '88%' }}
          >
            <img
              src="/assets/images/couple.jpeg"
              alt="Douaa et Rachid"
              style={{
                width: '100%',
                borderRadius: '28px',
                objectFit: 'cover',
                display: 'block',
                boxShadow:
                  '0 4px 10px rgba(0,0,0,0.14), 0 18px 42px rgba(0,0,0,0.28), 0 32px 60px rgba(0,0,0,0.18)',
              }}
              draggable={false}
            />
          </motion.div>

          {/* Verset coranique + traduction */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}
            className="flex flex-col items-center gap-5 text-center"
          >
            {/* Séparateur ornemental */}
            <div className="flex items-center gap-3">
              <span className="h-px bg-divider" style={{ width: '28px', opacity: 0.45 }} />
              <span style={{ color: 'var(--color-gold)', fontSize: '0.6rem', opacity: 0.75 }}>✦</span>
              <span className="h-px bg-divider" style={{ width: '28px', opacity: 0.45 }} />
            </div>

            {/* Verset arabe — font-arabic (Amiri) : font-accent (Cormorant
                Garamond) ne contient aucun glyphe arabe et retombe en
                silence sur une police système sans caractère (voir
                typography.css). */}
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic"
              style={{
                fontSize: 'clamp(1.025rem, 3.6vw, 1.205rem)',
                lineHeight: 2.1,
                color: 'var(--color-ink)',
                maxWidth: '90%',
                letterSpacing: '0.025em',
              }}
            >
              ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾
            </p>

            {/* Traduction française */}
            <p
              className="font-accent italic text-text-muted"
              style={{ fontSize: '0.9rem', lineHeight: 1.95, maxWidth: '86%' }}
            >
              « Et parmi Ses signes, Il a créé de vous, pour vous, des épouses afin que vous trouviez auprès d'elles la tranquillité. Et Il a mis entre vous affection et miséricorde. »
            </p>

            {/* Référence */}
            <span
              className="font-sans uppercase tracking-widest"
              style={{ fontSize: '0.75rem', color: 'var(--color-accent-strong)', opacity: 0.85 }}
            >
              Sourate Ar-Rûm (30:21)
            </span>
          </motion.div>
        </div>

        <CardDivider className="shrink-0" />
      </div>
    </motion.div>
  )
}
