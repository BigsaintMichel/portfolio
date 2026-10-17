import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Champ de particules réactif au curseur — shader maison, zéro librairie.
 *
 * Remplace particles.js (canvas 2D) : les particules vivent dans la MÊME scène
 * WebGL que le modèle 3D → un seul contexte GPU, un seul rendu par frame.
 *
 * La répulsion se calcule dans le vertex shader, en espace écran (NDC) :
 * coût CPU nul, quel que soit le nombre de particules.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse;      // curseur en NDC (-1..1)
  uniform float uAspect;     // largeur / hauteur du canvas
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aScale;
  attribute float aMix;
  varying float vMix;
  varying float vAlpha;

  void main() {
    // dérive lente, organique
    vec3 p = position;
    p.x += sin(uTime * 0.15 + position.y * 0.6) * 0.15;
    p.y += cos(uTime * 0.12 + position.x * 0.4) * 0.15;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;

    // répulsion autour du curseur (distance corrigée du ratio d'aspect)
    vec2 ndc = clip.xy / clip.w;
    vec2 diff = vec2((ndc.x - uMouse.x) * uAspect, ndc.y - uMouse.y);
    float dist = length(diff);
    float force = 1.0 - smoothstep(0.0, 0.35, dist);
    vec2 dir = diff / max(dist, 0.0001);
    ndc += vec2(dir.x / uAspect, dir.y) * force * 0.09;
    clip.xy = ndc * clip.w;

    gl_Position = clip;
    gl_PointSize = uSize * aScale * uPixelRatio / -mv.z;

    vMix = aMix;
    // plus lumineuses près du curseur, plus discrètes au loin
    float depth = clamp(1.0 + (mv.z + 6.0) / 14.0, 0.25, 1.0);
    vAlpha = mix(0.35, 1.0, force) * depth;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vMix;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uColorA, uColorB, vMix), a * vAlpha);
  }
`

export default function ParticleField({ count = 1500, reduced = false }) {
  const material = useRef(null)
  const pointerMoved = useRef(false)

  // Attributs générés une fois (par nombre de particules)
  const { positions, scales, mixes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const mixes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24 // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14 // y
      positions[i * 3 + 2] = -8 + Math.random() * 10 // z : de -8 à +2
      scales[i] = 0.5 + Math.random()
      // ~15 % magenta, le reste cyan légèrement teinté
      mixes[i] = Math.random() < 0.15 ? 1 : Math.random() * 0.2
    }
    return { positions, scales, mixes }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(10, 10) }, // hors écran tant que la souris n'a pas bougé
      uAspect: { value: 1 },
      uPixelRatio: { value: 1 },
      uSize: { value: 26 },
      uColorA: { value: new THREE.Color('#00f7ff') },
      uColorB: { value: new THREE.Color('#ff00e4') },
    }),
    [],
  )

  useEffect(() => () => material.current?.dispose(), [])

  useFrame((state, delta) => {
    const u = uniforms
    u.uAspect.value = state.size.width / state.size.height
    u.uPixelRatio.value = state.gl.getPixelRatio()
    if (reduced) return

    u.uTime.value += delta
    const { pointer } = state
    if (!pointerMoved.current && (pointer.x !== 0 || pointer.y !== 0)) pointerMoved.current = true
    if (pointerMoved.current) {
      // lissage indépendant du framerate
      u.uMouse.value.lerp(pointer, 1 - Math.exp(-6 * delta))
    }
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aMix" args={[mixes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
