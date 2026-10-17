import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import CoreModel from './CoreModel'
import ParticleField from './ParticleField'

/**
 * Scène 3D du hero — chargée en lazy (chunk "three" séparé), jamais rendue côté serveur.
 *
 * Budget performance :
 *  - un seul <Canvas> (modèle + particules) ;
 *  - dpr plafonné (1,5 desktop / 1 mobile) et abaissé à 1 si le framerate chute ;
 *  - `active=false` (hero hors écran) → frameloop "never" : le GPU ne travaille plus ;
 *  - mouvement réduit → frameloop "demand" : une image fixe, aucune animation.
 *
 * @param {boolean} active   le hero est visible
 * @param {boolean} reduced  prefers-reduced-motion
 * @param {boolean} compact  écran mobile
 * @param {React.RefObject} eventSource  élément qui reçoit les événements souris
 *        (la section hero) : le canvas reste en pointer-events: none sous le texte.
 */
export default function HeroScene({ active = true, reduced = false, compact = false, eventSource }) {
  const maxDpr = compact ? 1 : 1.5
  const [dpr, setDpr] = useState(maxDpr)

  return (
    <Canvas
      dpr={dpr}
      flat // pas de tone mapping : les néons gardent leurs couleurs exactes (#00f7ff / #ff00e4)
      frameloop={!active ? 'never' : reduced ? 'demand' : 'always'}
      camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 50 }}
      gl={{ antialias: !compact, alpha: true, powerPreference: 'high-performance' }}
      eventSource={eventSource}
      eventPrefix="client"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(maxDpr)} />
      <CoreModel reduced={reduced} />
      <ParticleField count={compact ? 450 : 1500} reduced={reduced} />
    </Canvas>
  )
}
