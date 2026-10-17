import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useGSAP } from '@gsap/react'
import { registerEffects } from '../effects'
import { MOTION } from './motion'

/**
 * Initialisation GSAP — idempotente et sans effet côté serveur.
 *
 * Appelée dans main.jsx (côté client) et, par sécurité, par les hooks qui
 * utilisent GSAP : si l'ordre de montage change, rien ne casse.
 *
 * Depuis GSAP 3.13, SplitText, ScrollTo (et tous les plugins) sont gratuits
 * et livrés dans le paquet npm `gsap`.
 */
let initialized = false

export function initGSAP() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin, useGSAP)

  // Valeurs par défaut de tout le site
  gsap.defaults({ ease: MOTION.ease.out, duration: MOTION.duration.base })

  // Évite les recalculs quand la barre d'adresse mobile apparaît/disparaît
  ScrollTrigger.config({ ignoreMobileResize: true })

  // Effets réutilisables : gsap.effects.fade(), tl.revealChars(), etc.
  registerEffects()

  // Repère pratique en dev : window.gsap dans la console
  if (import.meta.env.DEV) window.gsap = gsap
}

export { gsap, ScrollTrigger, SplitText, ScrollToPlugin, useGSAP }
