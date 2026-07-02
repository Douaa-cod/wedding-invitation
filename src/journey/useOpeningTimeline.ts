import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useReducedMotion } from '@/motion/useReducedMotion'

gsap.registerPlugin(MotionPathPlugin)

export interface OpeningTimelineRefs {
  sceneRef: RefObject<HTMLDivElement | null>
  flightSvgRef: RefObject<SVGSVGElement | null>
  routePathRef: RefObject<SVGPathElement | null>
  planeRef: RefObject<SVGGElement | null>
  venueRef: RefObject<HTMLDivElement | null>
  envelopeRef: RefObject<HTMLDivElement | null>
}

const ALIGN_ORIGIN: [number, number] = [0.5, 0.5]

/**
 * Orchestre la séquence d'ouverture (Brand Book section 15, frames 01-03) :
 * fondu de la scène → tracé de la ligne de vol → vol de l'avion → apparition
 * du lieu → entrée de l'enveloppe. Durées et easing alignés sur le storyboard
 * ("transitions 600-900ms, ease-out, jamais de rebond").
 */
export function useOpeningTimeline(refs: OpeningTimelineRefs) {
  const reducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    const { sceneRef, flightSvgRef, routePathRef, planeRef, venueRef, envelopeRef } = refs

    if (
      !sceneRef.current ||
      !flightSvgRef.current ||
      !routePathRef.current ||
      !planeRef.current ||
      !venueRef.current ||
      !envelopeRef.current
    ) {
      return
    }

    const scene = sceneRef.current

    const ctx = gsap.context(() => {
      const path = routePathRef.current!
      const plane = planeRef.current!
      const venue = venueRef.current!
      const envelope = envelopeRef.current!
      const pathLength = path.getTotalLength()

      gsap.set(scene, { opacity: 0 })
      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength })
      gsap.set(plane, {
        motionPath: { path, align: path, autoRotate: true, alignOrigin: ALIGN_ORIGIN, start: 0, end: 0 },
      })
      gsap.set(venue, { opacity: 0, y: 24 })
      gsap.set(envelope, { opacity: 0, y: 16 })

      if (reducedMotion) {
        gsap.set(scene, { opacity: 1 })
        gsap.set(path, { strokeDashoffset: 0, strokeDasharray: '2 8' })
        gsap.set(plane, {
          motionPath: { path, align: path, autoRotate: true, alignOrigin: ALIGN_ORIGIN, start: 0, end: 1 },
        })
        gsap.set(venue, { opacity: 1, y: 0 })
        gsap.set(envelope, { opacity: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      tl.to(scene, { opacity: 1, duration: 0.6 })
        .to(path, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.2')
        .to(
          plane,
          {
            motionPath: {
              path,
              align: path,
              autoRotate: true,
              alignOrigin: ALIGN_ORIGIN,
              start: 0,
              end: 1,
            },
            duration: 1.1,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(path, { strokeDasharray: '2 8' })
              gsap.to(flightSvgRef.current, { opacity: 0.45, duration: 0.6, ease: 'power2.out' })
            },
          },
          '-=0.85',
        )
        .to(venue, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .to(envelope, { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
    }, scene)

    return () => ctx.revert()
  }, [refs, reducedMotion])
}
