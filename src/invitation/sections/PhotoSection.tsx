import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PaperCard } from '../PaperCard'
import { CardDivider } from '../CardDivider'
import { SOURATE_REFERENCE_CLASSNAME, SOURATE_REFERENCE_STYLE } from '../sourateReferenceStyle'
import { useReducedMotion } from '@/motion/useReducedMotion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const PHOTO_DURATION = 1.05 // 900–1200ms — seule animation restante de la carte
/* prefers-reduced-motion : même fondu bref (opacité seule, sans transform ni
   flou) que les autres cartes du site. */
const REDUCED_TRANSITION = { duration: 0.26, ease: 'easeOut' as const }

/**
 * Section photo finale — remplace la vidéo.
 * Réutilise PaperCard (même structure extérieure — largeur, marges,
 * centrage, rayon, ombre, fond crème autour du papier floral — que la carte
 * Hommage) : jamais de fond ni de conteneur dupliqués. Image couple.jpeg
 * contenue dans le panneau floral, jamais posée par-dessus.
 *
 * Contenu textuel (séparateur, verset, traduction, référence) entièrement
 * statique — aucune animation, comme la carte Hommage : tout est visible
 * immédiatement, sans dépendre du scroll. Seule la photo conserve une
 * discrète animation d'entrée (fondu + échelle + flou, déclenchée au scroll
 * comme avant) ; aucun déplacement vertical (translateY) n'est animé, afin
 * que la photo ne soit jamais, même momentanément, positionnée en dehors du
 * panneau. Le zoom interne continu qui existait auparavant a été retiré
 * (animation "permanente" jugée superflue).
 * Note : le fichier est couple.jpeg (1600×1066 px, paysage).
 */
export function PhotoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.12 })
  const reducedMotion = useReducedMotion()

  return (
    <PaperCard>
      <div ref={ref} className="flex flex-col items-center" style={{ width: '100%', boxSizing: 'border-box' }}>

        {/* Photo — élément visuel principal de la carte. PaperCard réserve
            px-[20%] py-[7%] (zone de sécurité texte) sur son conteneur ; la
            photo en sort volontairement pour rester grande :
            - largeur : 166.667% de la largeur de contenu disponible moins
              24px — une identité qui annule exactement le padding horizontal
              en pourcentage du parent (100% - 2×20% = 60% de contenu ; 60% ×
              166.667% = 100% de la carte), quelle que soit la largeur réelle
              de la carte, pour ne laisser qu'une marge fixe de 12px de chaque
              côté par rapport aux fleurs embossées.
            - marge supérieure : même principe pour le padding vertical.
              PaperCard applique déjà 7% (soit 11.667% de notre largeur de
              contenu, puisque celle-ci vaut 60% de la largeur de la carte) ;
              `calc(-11.667% + clamp(20px, 5vw, 28px))` annule exactement
              cette valeur pour la remplacer par un espace haut garanti,
              fixe et toujours strictement positif — jamais un débordement,
              quelle que soit la largeur de la carte (le terme négatif n'est
              qu'une compensation mathématique du padding du parent, jamais
              un décalage visuel : la position finale rendue est toujours
              clamp(20px, 5vw, 28px), qui est toujours ≥ 20px).
            Largeur et marge explicites (jamais de translateY ou de marge
            négative appliqués visuellement) : robuste dans le conteneur flex
            ci-dessous, jamais de débordement grâce à overflow:hidden ici et
            sur PaperCard. */}
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, filter: 'blur(2px)' }}
          animate={
            isInView
              ? reducedMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, filter: 'blur(0px)' }
              : {}
          }
          transition={reducedMotion ? REDUCED_TRANSITION : { duration: PHOTO_DURATION, ease: EASE }}
          style={{
            width: 'calc(166.667% - 24px)',
            marginTop: 'calc(-11.667% + clamp(20px, 5vw, 28px))',
            display: 'block',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(194,168,120,0.35)',
            boxShadow:
              '0 2px 8px rgba(46,42,36,0.10), 0 12px 28px rgba(46,42,36,0.14), 0 24px 48px rgba(46,42,36,0.10)',
          }}
        >
          <img
            src="/assets/images/couple.jpeg"
            alt="Douaa et Rachid"
            style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '3 / 2', objectFit: 'cover' }}
            draggable={false}
          />
        </motion.div>

        {/* Séparateur ornemental — statique, comme sur la carte Hommage. */}
        <div className="flex items-center gap-3" style={{ marginTop: 20 }}>
          <span className="h-px bg-divider" style={{ width: '28px', opacity: 0.45 }} />
          <span style={{ color: 'var(--color-gold)', fontSize: '0.6rem', opacity: 0.75 }}>✦</span>
          <span className="h-px bg-divider" style={{ width: '28px', opacity: 0.45 }} />
        </div>

        {/* Verset arabe — font-arabic (Amiri) : font-accent (Cormorant
            Garamond) ne contient aucun glyphe arabe et retombe en
            silence sur une police système sans caractère (voir
            typography.css). Statique, entièrement visible immédiatement. */}
        <p
          dir="rtl"
          lang="ar"
          className="font-arabic text-center"
          style={{
            fontSize: 'clamp(1.025rem, 3.6vw, 1.205rem)',
            lineHeight: 2.1,
            color: 'var(--color-ink)',
            maxWidth: '90%',
            letterSpacing: '0.025em',
            marginTop: 16,
          }}
        >
          ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾
        </p>

        {/* Traduction française — statique. */}
        <p
          className="font-accent italic text-text-muted text-center"
          style={{ fontSize: '0.9rem', lineHeight: 1.95, maxWidth: '86%', marginTop: 12 }}
        >
          « Et parmi Ses signes, Il a créé de vous, pour vous, des épouses afin que vous trouviez auprès d'elles la tranquillité. Et Il a mis entre vous affection et miséricorde. »
        </p>

        {/* Référence — même déclaration typographique que la référence de la
            carte Hommage (voir sourateReferenceStyle.ts). Statique. */}
        <span
          className={`${SOURATE_REFERENCE_CLASSNAME} text-center`}
          style={{ ...SOURATE_REFERENCE_STYLE, marginTop: 14 }}
        >
          Sourate Ar-Rûm (30:21)
        </span>

        <CardDivider className="shrink-0 mt-4.5" />
      </div>
    </PaperCard>
  )
}
