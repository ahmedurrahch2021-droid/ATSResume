import { SITE_ORIGIN } from './routes';

/**
 * Site-wide structured data (schema.org JSON-LD).
 *
 * Only facts the site states visibly are listed here: the name, the URL and
 * the contact email. Do not add a phone number, address, logo or rating
 * until each one is shown on the site and confirmed by the owner.
 */
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'ATS Resume Maker',
      url: `${SITE_ORIGIN}/`,
      email: 'ahmedur.rahch2021@gmail.com',
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: 'ATS Resume Maker',
      url: `${SITE_ORIGIN}/`,
      publisher: { '@id': ORGANIZATION_ID },
    },
  ],
};
