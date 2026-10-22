import { PageRoute } from './types';

/**
 * Public URL for each page. These paths are the ones listed in
 * docs/SEO_AEO_PLAN.md §5. Keep them in sync with that table.
 */
export const ROUTE_PATHS: Record<PageRoute, string> = {
  home: '/',
  'free-resume-score': '/resume-checker',
  templates: '/resume-templates',
  examples: '/resume-examples',
  pricing: '/pricing',
  'how-it-works': '/how-it-works',
  faq: '/faq',
  about: '/about',
  contact: '/contact',
  order: '/order',
  suite: '/suite',
  editor: '/editor',
};

/** Reverse lookup from a URL path to a page. Unknown paths show the home page. */
export function routeFromPath(pathname: string): PageRoute {
  const normalised = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const match = (Object.keys(ROUTE_PATHS) as PageRoute[]).find(
    (route) => ROUTE_PATHS[route] === normalised,
  );
  return match ?? 'home';
}
