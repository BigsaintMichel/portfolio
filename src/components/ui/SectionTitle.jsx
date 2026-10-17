import { useRef } from 'react'
import { useReveal } from '../../hooks/useReveal'

/**
 * Titre de section standard : eyebrow numéroté, titre révélé par caractère,
 * filet gradient révélé par clip-path, intro révélée ligne par ligne.
 * Remplace les titres + icônes Font Awesome de l'ancien site.
 */
export default function SectionTitle({ index, eyebrow, title, intro, as: Tag = 'h2', id }) {
  const eyebrowRef = useRef(null)
  const titleRef = useRef(null)
  const lineRef = useRef(null)
  const introRef = useRef(null)

  useReveal(eyebrowRef, 'fade', { y: 12, duration: 0.6 })
  useReveal(titleRef, 'revealChars', { stagger: 0.025 })
  useReveal(lineRef, 'clipReveal', { from: 'left', duration: 1, delay: 0.2 })
  useReveal(introRef, 'revealLines', { delay: 0.15 })

  return (
    <header className="mb-10 sm:mb-12">
      <p ref={eyebrowRef} className="eyebrow">
        <span className="text-cyan">{index}</span> — {eyebrow}
      </p>
      <Tag
        ref={titleRef}
        id={id}
        className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-semibold tracking-tight text-text"
      >
        {title}
      </Tag>
      <span ref={lineRef} aria-hidden="true" className="bg-gradient-neon mt-4 block h-px w-16" />
      {intro && (
        <p ref={introRef} className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {intro}
        </p>
      )}
    </header>
  )
}
