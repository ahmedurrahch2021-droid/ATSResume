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

/**
 * FAQ items approved for FAQPage markup, by id (see FAQ_ITEMS in
 * src/data/mockData.ts). An item is added here only after the owner has
 * confirmed its wording is accurate. Empty = no FAQPage markup is published.
 *
 * Do not add an item whose answer claims something the site cannot back up
 * (ATS pass guarantees, payment methods while checkout is disabled, refund
 * terms not written on the site). Markup makes those claims easier to cite.
 */
export const FAQ_SCHEMA_APPROVED_IDS: string[] = [];

interface FaqForSchema {
  id: string;
  question: string;
  directAnswer: string;
  extendedAnswer: string;
}

/**
 * Builds FAQPage JSON-LD from the same fields the page displays: the question,
 * and the direct answer followed by the extended answer. Returns null when no
 * items are approved, so no empty FAQPage block is emitted.
 */
export function faqPageJsonLd(items: FaqForSchema[], approvedIds: string[] = FAQ_SCHEMA_APPROVED_IDS): object | null {
  const approved = items.filter((item) => approvedIds.includes(item.id));
  if (approved.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: approved.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${item.directAnswer} ${item.extendedAnswer}`,
      },
    })),
  };
}
