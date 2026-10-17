import { Head } from 'vite-react-ssg'
import { SITE } from '../../constants/site'

/**
 * Métadonnées d'une page. Rendu en HTML statique au build (vite-react-ssg),
 * donc lisible par Google ET par les robots de partage (LinkedIn, WhatsApp...).
 *
 * @param {string} title        titre de la page (sans le nom du site)
 * @param {string} description  160 caractères max idéalement
 * @param {string} path         chemin canonique ('/', '/projets/tracelot')
 * @param {string} image        chemin de l'image OG (1200×630) dans public/
 * @param {boolean} noindex     pages de test / 404
 */
export default function Seo({ title, description = SITE.description, path = '/', image = '/images/og-image.png', noindex = false }) {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.title}`
  const url = `${SITE.url}${path}`
  const imageUrl = image.startsWith('http') ? image : `${SITE.url}${image}`

  return (
    <Head>
      <html lang="fr" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  )
}
