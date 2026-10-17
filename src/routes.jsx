import Layout from './components/layout/Layout'
import { PROJECTS } from './constants/projects'

/**
 * Routes (React Router 6, format "data routes" attendu par vite-react-ssg).
 * Les pages sont chargées en lazy → un chunk JS par page (code splitting).
 */
export const routes = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/components/layout/Layout.jsx',
    children: [
      { index: true, lazy: () => import('./pages/Home'), entry: 'src/pages/Home.jsx' },
      {
        path: 'projets',
        lazy: () => import('./pages/ProjectsIndex'),
        entry: 'src/pages/ProjectsIndex.jsx',
      },
      {
        path: 'projets/:slug',
        lazy: () => import('./pages/CaseStudy'),
        entry: 'src/pages/CaseStudy.jsx',
        getStaticPaths: () => PROJECTS.map((p) => `projets/${p.slug}`),
      },
      { path: '*', lazy: () => import('./pages/NotFound') },
    ],
  },
]
