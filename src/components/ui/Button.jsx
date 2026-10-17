/**
 * Bouton-lien de la signature visuelle.
 *  - primary : gradient cyan → magenta + reflet (shine) au survol
 *  - ghost   : contour discret, glow cyan au survol
 *
 * Rendu en <a> (CTA = navigation). Passer onClick pour intercepter (ancres + Lenis).
 */
const BASE =
  'group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium ' +
  'transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out-expo ' +
  'hover:-translate-y-0.5 active:translate-y-0'

const VARIANTS = {
  primary:
    'btn-shine bg-gradient-neon text-ink shadow-[0_12px_40px_-14px_rgb(0_247_255/0.7)] ' +
    'hover:shadow-[0_16px_50px_-12px_rgb(255_0_228/0.6)]',
  ghost: 'border border-line bg-white/[0.03] text-text backdrop-blur-sm hover:border-cyan/50 hover:glow-cyan',
}

export default function Button({ href, variant = 'primary', arrow = false, className = '', children, ...rest }) {
  return (
    <a href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...rest}>
      <span>{children}</span>
      {arrow && (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      )}
    </a>
  )
}
