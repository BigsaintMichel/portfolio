import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion, MOTION } from '../lib/motion'

/**
 * revealLines — paragraphe révélé ligne par ligne.
 *
 * `autoSplit: true` : SplitText re-découpe les lignes au redimensionnement et
 * quand les polices finissent de charger. L'animation est recréée dans onSplit
 * (et automatiquement synchronisée sur la progression de la précédente).
 *
 * ⚠️ Comme l'animation peut être recréée, cet effet n'est PAS chaînable dans une
 * timeline (extendTimeline: false). Utilisez-le en autonome, avec scrollTrigger.
 *
 * @example gsap.effects.revealLines(p, { scrollTrigger: { trigger: p, start: 'top 80%' } })
 *
 * Options : duration, ease, stagger, delay, scrollTrigger
 */
export default {
  name: 'revealLines',
  extendTimeline: false,
  defaults: {
    duration: MOTION.duration.base,
    ease: MOTION.ease.out,
    stagger: MOTION.stagger.lines,
    delay: 0,
  },
  effect(targets, { duration, ease, stagger, delay, scrollTrigger }) {
    if (prefersReducedMotion()) {
      return gsap.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, delay, scrollTrigger })
    }

    let animation
    SplitText.create(targets, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      aria: 'auto',
      autoSplit: true,
      onSplit(self) {
        gsap.set(targets, { autoAlpha: 1 })
        animation = gsap.from(self.lines, {
          yPercent: 105,
          duration,
          ease,
          stagger,
          delay,
          // copie : chaque re-découpe reçoit son propre ScrollTrigger
          scrollTrigger: scrollTrigger ? { ...scrollTrigger } : undefined,
        })
        return animation
      },
    })
    return animation
  },
}
