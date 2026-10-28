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
  'cover-letter': '/cover-letter',
  'country-guides': '/country-guides',
  order: '/order',
  suite: '/suite',
  // The editor and the suite are the same page in App.tsx, so they share one URL.
  editor: '/suite',
};

/** Reverse lookup from a URL path to a page. Unknown paths show the home page. */
export function routeFromPath(pathname: string): PageRoute {
  const normalised = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const match = (Object.keys(ROUTE_PATHS) as PageRoute[]).find(
    (route) => ROUTE_PATHS[route] === normalised,
  );
  return match ?? 'home';
}

/**
 * Production origin, used for canonical URLs and the sitemap. Change this
 * if the site moves to a custom domain.
 */
export const SITE_ORIGIN = 'https://atsresumemaker.ai.studio';

/**
 * Page metadata for the public, indexable routes. Titles stay under 60
 * characters and descriptions under 160, as set in docs/SEO_AEO_PLAN.md §8.
 * Routes not listed here are not prerendered (order, suite, editor).
 */
export interface RouteMeta {
  title: string;
  description: string;
  /** Set for app pages that should not appear in search results. */
  noindex?: boolean;
}

export const ROUTE_META: Partial<Record<PageRoute, RouteMeta>> = {
  home: {
    title: 'ATS Resume Lab | Free ATS Resume Checker & Templates',
    description: 'Free ATS resume checker with clear fixes, plus single-column resume templates. Check your resume before you apply.',
  },
  'free-resume-score': {
    title: 'Free ATS Resume Checker | ATS Resume Lab',
    description: 'Upload your resume and get a free ATS check with clear fixes for formatting, keywords and measurable results.',
  },
  templates: {
    title: 'ATS Resume Templates | ATS Resume Lab',
    description: 'Four free resume layouts with real previews, editable DOCX and source-linked design notes. Apply a layout without replacing your career details.',
  },
  examples: {
    title: 'Resume Examples by Role | ATS Resume Lab',
    description: 'Resume examples organised by role and experience level, with notes on what each one does well.',
  },
  pricing: {
    title: 'Pricing | ATS Resume Lab',
    description: 'Simple resume review packages. See what each package includes before you order.',
  },
  'how-it-works': {
    title: 'How It Works | ATS Resume Lab',
    description: 'How ATS Resume Lab checks and improves your resume, step by step.',
  },
  faq: {
    title: 'Resume FAQ | ATS Resume Lab',
    description: 'Answers to common questions about ATS-friendly resumes, PDFs, length and keywords.',
  },
  about: {
    title: 'About | ATS Resume Lab',
    description: 'Who we are and how ATS Resume Lab approaches resume checking.',
  },
  contact: {
    title: 'Contact | ATS Resume Lab',
    description: 'Get in touch with the ATS Resume Lab team about your resume or your order.',
  },
  'cover-letter': {
    title: 'Free Cover Letter Builder | ATS Resume Lab',
    description: 'Write a cover letter using your own experience, import resume contact details and download DOCX, text or PDF.',
  },
  'country-guides': {
    title: 'Country CV Guidance & Template Sources | ATS Resume Lab',
    description: 'Compare country-specific application considerations, photo choices and original resume layouts, with career-service sources and clear evidence limits.',
  },
  suite: {
    title: 'Resume Editor | ATS Resume Lab',
    description: 'Edit and check your resume in the ATS Resume Lab editor.',
    noindex: true,
  },
};

/** Routes that are prerendered to static HTML, in build order. */
export const PRERENDER_ROUTES: PageRoute[] = [
  'home',
  'free-resume-score',
  'templates',
  'examples',
  'pricing',
  'how-it-works',
  'faq',
  'about',
  'contact',
  'cover-letter',
  'country-guides',
  'suite',
];
