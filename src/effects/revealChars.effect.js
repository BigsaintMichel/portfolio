import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion, MOTION } from '../lib/motion'

/**
 * revealChars — titre révélé caractère par caractère (SplitText).
 *
 * Les caractères montent depuis un masque par mot (overflow: clip) :
 * aucun débordement visible, et les mots ne se coupent jamais en fin de ligne.
 *
 * Accessibilité : SplitText ajoute aria-label sur l'élément et aria-hidden
 * sur les fragments (option aria: 'auto') → le lecteur d'écran lit le titre entier.
 *
 * Nettoyage : SplitText est "context-aware" (GSAP ≥ 3.13). Créé dans un
 * useGSAP()/gsap.context(), il est automatiquement annulé (revert) au démontage.
 *
 * @example tl.revealChars(h1, { stagger: 0.05 })
 * @example gsap.effects.revealChars(h2, { scrollTrigger: { trigger: h2, start: 'top 80%' } })
 *
 * Options : duration, ease, stagger, delay, yPercent, scrollTrigger
 */
export default {
  name: 'revealChars',
  extendTimeline: true,
  defaults: {
    duration: MOTION.duration.base,
    ease: MOTION.ease.out,
    stagger: MOTION.stagger.chars,
    delay: 0,
    yPercent: 115,
  },
  effect(targets, { duration, ease, stagger, delay, yPercent, scrollTrigger }) {
    // Mouvement réduit : pas de découpage, simple fondu du bloc
    if (prefersReducedMotion()) {
      return gsap.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, delay, scrollTrigger })
    }

    const split = SplitText.create(targets, {
      type: 'words,chars',
      mask: 'words',
      wordsClass: 'split-word',
      charsClass: 'split-char',
      aria: 'auto',
    })

    const tl = gsap.timeline({ delay, scrollTrigger })
    // Le conteneur peut être masqué au départ (data-intro / autoAlpha 0) : on le rend
    // visible à l'instant où les caractères commencent à monter.
    tl.set(targets, { autoAlpha: 1 })
    tl.from(split.chars, { yPercent, duration, ease, stagger }, 0)
    return tl
  },
}
