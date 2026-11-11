/**
 * Contenu migré depuis l'ancien portfolio (index.html à la racine).
 * Les logos pointent vers public/images/ et les liens détail vers les pages
 * HTML legacy copiées dans public/ (servies telles quelles par Vite).
 */

export const ABOUT = {
  photo: '/images/photo.png',
  photoWebp: '/images/photo.webp',
  bio: [
    "Architecte logiciel basé en Côte d'Ivoire, spécialisé en IA appliquée à l'industrie. Je conçois des systèmes d'information industriels complets : capture terrain en mobile offline-first, supervision web, intégration blockchain et architectures cloud.",
    "Architecte logiciel, en parcours IA appliquée à l'industrie à Samara Polytech, je développe en autonomie une solution de traçabilité et de sécurisation pour lutter contre la fraude sur la biomasse (projet mené pour SODEN). Je travaille également sur Némésis, une plateforme d'orchestration d'agents IA.",
  ],
  // value → compteur animé au scroll ; sinon simple chip
  strengths: [
    { value: 9, label: 'projets en production' },
    { label: '1 concept (EduSave)' },
    { value: 4, label: 'domaines de stack' },
    { label: "IA appliquée à l'industrie" },
    { label: 'Abidjan · Remote' },
  ],
}

export const FORMATION = [
  {
    degree: "Parcours international en Intelligence Artificielle appliquée à l'industrie",
    school: 'Samara Polytech — Samara, Russie',
    period: '2026 · 2027',
    status: 'En cours',
    logo: '/images/samara-polytech/logo.svg',
    description:
      "Année préparatoire internationale à Samara Polytech, première étape d'un parcours d'ingénierie orienté IA appliquée aux procédés industriels. Objectif : compléter mon expertise d'architecte logiciel en modélisation prédictive, vision industrielle et IoT pour concevoir des systèmes industriels plus intelligents et plus fiables.",
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

// Compétences → preuves par projet (pastilles). La `key` regroupe les occurrences :
// survoler une pastille éclaire toutes celles du même projet dans la section.
export const SKILLS = [
  {
    category: 'Frontend',
    items: [
      {
        name: 'React',
        role: 'PWA installable, interface de chat en flux continu',
        projects: [
          { key: 'nemesis', label: 'Némésis' },
          { key: 'naturalink', label: 'Naturalink' },
          { key: 'catreps', label: 'CATREPS' },
          { key: 'portfolio', label: 'Ce portfolio' },
        ],
      },
      {
        name: 'Flutter / Dart',
        role: 'Mobile hors ligne d\u2019abord, saisie terrain',
        projects: [
          { key: 'tracelot', label: 'TraceLot' },
          { key: 'tracelot', label: 'BioStock' },
          { key: 'fees', label: 'FEES' },
          { key: 'edusave', label: 'EduSave' },
        ],
      },
      {
        name: 'Vue.js',
        role: 'Interface de gestion temps réel',
        projects: [{ key: 'managex', label: 'ManageX' }],
      },
      {
        name: 'Tailwind CSS',
        role: 'Vite et rendu statique',
        projects: [{ key: 'portfolio', label: 'Ce portfolio' }],
      },
      {
        name: 'HTML, CSS, JavaScript',
        role: 'Socle de tous les sites livrés',
        projects: [
          { key: 'jms-afrique', label: 'JMS Afrique' },
          { key: 'jecpssm', label: 'JECPSSM' },
          { key: 'cabinet-jehovah-rapha', label: 'Cabinet J. Rapha' },
        ],
      },
    ],
  },
  {
    category: 'Backend',
    items: [
      {
        name: 'FastAPI',
        role: 'Routage multi-modèles, quotas, mesure des coûts',
        projects: [{ key: 'nemesis', label: 'Némésis' }],
      },
      {
        name: 'Node.js',
        role: 'API de synchronisation terrain',
        projects: [{ key: 'tracelot', label: 'TraceLot' }],
      },
      {
        name: 'PHP / Laravel',
        role: 'Applications métier et sites de contenu',
        projects: [
          { key: 'naturalink', label: 'Naturalink' },
          { key: 'managex', label: 'ManageX' },
          { key: 'jms-afrique', label: 'JMS Afrique' },
          { key: 'jecpssm', label: 'JECPSSM' },
        ],
      },
      {
        name: 'API REST',
        role: 'Toutes les intégrations livrées',
        projects: [
          { key: 'nemesis', label: 'Némésis' },
          { key: 'tracelot', label: 'TraceLot' },
          { key: 'naturalink', label: 'Naturalink' },
        ],
      },
    ],
  },
  {
    category: 'Bases de données',
    items: [
      {
        name: 'Supabase / PostgreSQL',
        role: 'Authentification, RLS, persistance',
        projects: [
          { key: 'nemesis', label: 'Némésis' },
          { key: 'tracelot', label: 'TraceLot' },
        ],
      },
      {
        name: 'MySQL',
        role: 'Applications PHP en production',
        projects: [
          { key: 'jms-afrique', label: 'JMS Afrique' },
          { key: 'jecpssm', label: 'JECPSSM' },
          { key: 'managex', label: 'ManageX' },
        ],
      },
      {
        name: 'SQLite',
        role: 'Stockage local hors ligne',
        projects: [
          { key: 'tracelot', label: 'TraceLot' },
          { key: 'fees', label: 'FEES' },
        ],
      },
      {
        name: 'Firebase',
        role: 'Backend as a service',
        projects: [{ key: 'edusave', label: 'EduSave' }],
      },
    ],
  },
  {
    category: 'Expertise différenciante',
    featured: true,
    intro:
      "Ce qui ne s'apprend pas dans un tutoriel : faire tenir un système d'IA en production, avec son coût, et une chaîne de traçabilité qui survit à l'absence de réseau.",
    items: [
      {
        name: 'OpenRouter / LiteLLM',
        role: 'Routage entre modèles avec repli automatique, coût réel mesuré par requête',
        projects: [{ key: 'nemesis', label: 'Némésis' }],
      },
      {
        name: 'CrewAI',
        role: 'Agents d\u2019analyse de PDF, vision, recherche web sourcée',
        projects: [{ key: 'nemesis', label: 'Némésis' }],
      },
      {
        name: 'Typst',
        role: 'Rapports et mémoires générés en PDF',
        projects: [{ key: 'nemesis', label: 'Némésis' }],
      },
      {
        name: 'Blockchain Hedera',
        role: 'Ancrage des lots, preuve d\u2019intégrité',
        projects: [{ key: 'tracelot', label: 'TraceLot' }],
      },
      {
        name: 'Hors ligne d\u2019abord',
        role: 'Saisie sans réseau, synchronisation différée',
        projects: [{ key: 'tracelot', label: 'TraceLot' }],
      },
      {
        name: 'Git / GitHub',
        role: 'Revue de diff et validation avant chaque mise en production',
        projects: [{ key: 'tous', label: 'Tous les projets' }],
      },
    ],
  },
]

export const METHOD = [
  'Conception et architecture des systèmes avant toute ligne de code.',
  'Spécification écrite des changements : ce qui change, pourquoi, comment le vérifier.',
  'Revue de code et validation avant chaque mise en production.',
  "Pilotage d'agents de code pour l'implémentation, avec revue systématique du diff.",
  'Mesure des coûts et des marges sur les produits en production.',
]
