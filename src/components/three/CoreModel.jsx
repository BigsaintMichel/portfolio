import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const CYAN = new THREE.Color('#00f7ff')
const MAGENTA = new THREE.Color('#ff00e4')

/** Nœuds ronds et lumineux (shader minimal : pas de texture, pas de points carrés). */
const nodeVertex = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio / -mv.z;
  }
`
const nodeFragment = /* glsl */ `
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.22, 0.0, d);        // point net au centre
    float glow = smoothstep(0.5, 0.0, d) * 0.45;  // halo doux
    float a = core + glow;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), core * 0.6), a);
  }
`

/**
 * Le "noyau" — clin d'œil à la planète + anneau du repo de référence,
 * réinterprété en circuit d'IA :
 *  - icosaèdre filaire cyan (réseau) avec nœuds lumineux,
 *  - icosaèdre intérieur magenta en contre-rotation,
 *  - cœur pulsant,
 *  - deux anneaux orbitaux avec un satellite chacun.
 *
 * Desktop : décalé à droite du texte. Mobile : centré en haut, plus petit.
 * Le groupe s'incline vers le curseur (parallaxe amortie).
 */
export default function CoreModel({ reduced = false }) {
  const root = useRef(null)
  const spin = useRef(null)
  const inner = useRef(null)
  const core = useRef(null)
  const ringA = useRef(null)
  const ringB = useRef(null)

  const { size, viewport } = useThree()
  const desktop = size.width >= 1024
  const position = desktop ? [viewport.width * 0.25, 0, 0] : [0, viewport.height * 0.27, -1]
  const scale = desktop ? 1 : 0.62

  const { outer, edges, nodes } = useMemo(() => {
    const outer = new THREE.IcosahedronGeometry(1.35, 1)
    // sommets uniques (l'icosaèdre non indexé répète chaque sommet par face)
    const nodes = mergeVertices(outer.clone().deleteAttribute('normal').deleteAttribute('uv'))
    return { outer, edges: new THREE.EdgesGeometry(outer), nodes }
  }, [])

  const nodeUniforms = useMemo(
    () => ({ uColor: { value: CYAN }, uSize: { value: 70 }, uPixelRatio: { value: 1 } }),
    [],
  )

  // Libération GPU au démontage (géométries créées hors JSX)
  useEffect(
    () => () => {
      outer.dispose()
      edges.dispose()
      nodes.dispose()
    },
    [outer, edges, nodes],
  )

  useFrame((state, delta) => {
    nodeUniforms.uPixelRatio.value = state.gl.getPixelRatio()
    if (reduced) return
    const t = state.clock.elapsedTime

    spin.current.rotation.y += delta * 0.18
    spin.current.rotation.x += delta * 0.05
    inner.current.rotation.y -= delta * 0.4
    inner.current.rotation.z += delta * 0.2
    ringA.current.rotation.z += delta * 0.25
    ringB.current.rotation.z -= delta * 0.16
    core.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.08)

    // Parallaxe curseur, amortie (indépendante du framerate)
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -state.pointer.y * 0.25, 3, delta)
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, state.pointer.x * 0.35, 3, delta)
  })

  return (
    <group ref={root} position={position} scale={scale}>
      {/* Réseau extérieur */}
      <group ref={spin}>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={CYAN} transparent opacity={0.5} />
        </lineSegments>
        <points geometry={nodes}>
          <shaderMaterial
            uniforms={nodeUniforms}
            vertexShader={nodeVertex}
            fragmentShader={nodeFragment}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* Structure intérieure */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.72, 0]} />
        <meshBasicMaterial color={MAGENTA} wireframe transparent opacity={0.5} />
      </mesh>

      {/* Cœur + halo */}
      <mesh ref={core}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshBasicMaterial color={MAGENTA} transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Anneau magenta */}
      <group rotation={[1.15, 0.2, 0]}>
        <group ref={ringA}>
          <mesh>
            <torusGeometry args={[2.05, 0.006, 8, 200]} />
            <meshBasicMaterial color={MAGENTA} transparent opacity={0.8} />
          </mesh>
          <mesh position={[2.05, 0, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={MAGENTA} />
          </mesh>
        </group>
      </group>

      {/* Anneau cyan */}
      <group rotation={[1.35, -0.5, 0.3]}>
        <group ref={ringB}>
          <mesh>
            <torusGeometry args={[2.55, 0.004, 8, 220]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.45} />
          </mesh>
          <mesh position={[0, 2.55, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color={CYAN} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
