/**
 * Contenu migré depuis l'ancien portfolio (index.html à la racine).
 * Les logos pointent vers public/images/ et les liens détail vers les pages
 * HTML legacy copiées dans public/ (servies telles quelles par Vite).
 */

export const ABOUT = {
  photo: '/images/photo.png',
  bio: [
    "Architecte logiciel basé en Côte d'Ivoire, spécialisé en IA appliquée à l'industrie. Je conçois des systèmes d'information industriels complets : capture terrain en mobile offline-first, supervision web, intégration blockchain et architectures cloud.",
    "Actuellement en Master IA appliquée à l'industrie, je développe en autonomie une solution de traçabilité et de sécurisation pour lutter contre la fraude sur la biomasse (projet mené pour SODEN). Je travaille également sur Némésis, une plateforme d'orchestration d'agents IA.",
  ],
  // value → compteur animé au scroll ; sinon simple chip
  strengths: [
    { value: 10, label: 'projets livrés' },
    { value: 6, label: 'domaines de stack' },
    { value: 3, label: 'apps en production' },
    { label: "IA appliquée à l'industrie" },
    { label: 'Abidjan · Remote' },
  ],
}

export const FORMATION = [
  {
    degree: "Master en Intelligence Artificielle appliquée à l'industrie",
    school: 'Samara Polytech — Samara, Russie',
    period: '2026 · 2029',
    status: 'En cours',
    logo: '/images/samara-polytech/logo.svg',
    description:
      "Spécialisation en IA appliquée aux procédés industriels : modélisation prédictive, vision industrielle, IoT et optimisation de lignes de production. Formation d'ingénieur orientée industrie de fabrication et de transformation.",
  },
  {
    degree: 'Licence en Génie Logiciel',
    school: "HEC Abidjan — Abidjan, Côte d'Ivoire",
    period: null,
    status: 'Obtenue',
    logo: '/images/hec-abidjan/logo.png',
    description:
      "Architecture des systèmes d'information, génie logiciel, bases de données relationnelles, conception UML/MERISE et développement d'applications full-stack.",
  },
]

// Les projets ont leur propre fichier : ./projects.js

export const SKILLS = [
  {
    category: 'Frontend',
    items: [
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'React', level: 80 },
      { name: 'Vue.js', level: 75 },
      { name: 'Flutter / Dart', level: 80 },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 80 },
      { name: 'Express / Fastify', level: 75 },
      { name: 'PHP', level: 80 },
      { name: 'Laravel', level: 80 },
      { name: 'NestJS', level: 70 },
      { name: 'API REST', level: 85 },
      { name: 'Postman', level: 80 },
    ],
  },
  {
    category: 'Bases de données',
    items: [
      { name: 'MySQL', level: 85 },
      { name: 'SQLite', level: 85 },
      { name: 'MongoDB', level: 70 },
      { name: 'PostgreSQL', level: 75 },
      { name: 'Supabase', level: 70 },
      { name: 'Firebase', level: 75 },
    ],
  },
  {
    category: 'Expertise différenciante',
    items: [
      { name: "IA appliquée à l'industrie", level: 70 },
      { name: 'Blockchain (Hedera)', level: 65 },
      { name: 'Offline-first / Sync', level: 75 },
      { name: 'UML / MERISE', level: 80 },
      { name: 'Git / GitHub', level: 90 },
    ],
  },
]
