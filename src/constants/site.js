/**
 * Contenu global du site — source unique.
 * Modifier ici se répercute partout (hero, navbar, footer, métas, JSON-LD...).
 */

export const SITE = {
  name: 'Yrigalé Saint Michel',
  initials: 'YSM',
  title: 'Architecte Logiciel & IA',
  // Option A : même projet Vercel → l'URL actuelle reste l'URL canonique
  // tant qu'aucun domaine personnalisé n'est branché (surcharge : VITE_SITE_URL).
  url: (import.meta.env.VITE_SITE_URL || 'https://portfolio-kappa-ochre-heyiw3k96o.vercel.app').replace(/\/$/, ''),
  description:
    "Portfolio de Yrigalé Saint Michel, architecte logiciel et ingénieur en IA appliquée à l'industrie : systèmes d'information industriels, mobile offline-first, blockchain et IA.",
  locale: 'fr_FR',
  availability: 'Disponible pour missions',
  location: 'Abidjan · Samara (Russie)',
  email: 'saintmichelyirigale@gmail.com',
  phone: '+2250748981879',
  phoneDisplay: '07 48 98 18 79',
  cv: '/cv/YRIGALE.pdf',
}

export const HERO = {
  pitch:
    "Je conçois des systèmes d'information industriels complets : capture terrain en mobile offline-first, supervision web, intégration blockchain et IA appliquée.",
  // Phrases du typewriter (la première est rendue en HTML statique pour le SEO)
  typewriter: [
    'IA appliquée à l’industrie',
    'Mobile offline-first',
    'Traçabilité & blockchain',
    'Systèmes d’information industriels',
  ],
  ctaPrimary: { label: 'Voir mes projets', href: '#projets' },
  ctaSecondary: { label: 'Me contacter', href: '#contact' },
}

export const NAV_LINKS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'a-propos', label: 'À propos' },
  { id: 'formation', label: 'Formation' },
  { id: 'projets', label: 'Projets' },
  { id: 'competences', label: 'Compétences' },
  { id: 'contact', label: 'Contact' },
]

export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/BigsaintMichel' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/saint-michel-yirigale-945570328' },
  { label: 'WhatsApp', href: 'https://wa.me/2250748981879' },
]
