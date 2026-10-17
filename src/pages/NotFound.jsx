import Seo from '../components/layout/Seo'
import Button from '../components/ui/Button'

export function Component() {
  return (
    <section className="container-x grid min-h-svh place-content-center gap-6 text-center">
      <Seo title="Page introuvable" path="/404" noindex />
      <p className="eyebrow">Erreur 404</p>
      <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none font-bold tracking-tight">
        <span className="text-gradient">Hors orbite</span>
      </h1>
      <p className="mx-auto max-w-md text-muted">Cette page n’existe pas ou a été déplacée.</p>
      <div>
        <Button href="/" arrow>
          Retour à l’accueil
        </Button>
      </div>
    </section>
  )
}
