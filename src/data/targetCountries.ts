import { COUNTRY_GUIDES } from './countryGuides';
import type { TargetCountry } from '../types/countryNorms';

export interface CountryProfile { id: TargetCountry; name: string; spelling: string; guidance: string; sourceIds: string[] }
const fromGuide = (id: TargetCountry, guideId: string, spelling: string): CountryProfile => {
  const guide = COUNTRY_GUIDES.find((item) => item.id === guideId)!;
  return { id, name: guide.name, spelling, guidance: `${guide.structure} ${guide.photo} ${guide.evidenceNote}`, sourceIds: guide.sourceIds };
};

/** Uses the reviewed public guidance; these are contextual preferences, not legal certifications. */
export const COUNTRY_PROFILES: CountryProfile[] = [
  { id: 'global', name: 'International / employer-specific', spelling: 'Keep the candidate’s consistent spelling unless a preference is supplied.', guidance: 'Follow the actual vacancy. Length and personal details depend on the application. Do not infer nationality, seniority or technical skills from a country.', sourceIds: ['mit-ats', 'imperial-cv'] },
  fromGuide('us', 'united-states', 'American English. Preserve names, titles and quoted job requirements.'),
  fromGuide('uk', 'united-kingdom', 'British English. Software uses “program”; never blindly replace program with programme or modify proper names.'),
  fromGuide('ca', 'canada', 'Consistent Canadian English. Preserve proper names and technical terms.'),
  fromGuide('au', 'australia', 'Australian English; preserve proper names and technical uses of “program”.'),
  { id: 'eu', name: 'European Union / employer-specific', spelling: 'Use the vacancy’s requested language; keep English spelling consistent.', guidance: 'Europe has multiple application conventions. Do not mandate Europass, a photograph, British English or a fixed page count. Use Europass only when requested. Native-language status is not a CEFR level.', sourceIds: ['mit-ats', 'france-cv', 'imperial-cv'] },
  { id: 'gulf', name: 'Gulf region / employer-specific', spelling: 'Use the employer’s language and keep English spelling consistent.', guidance: 'UAE, Saudi Arabia and Qatar are different markets. No mandatory Gulf-wide photo, executive tone, project valuation or page count is established. Discuss work rights only when relevant and supplied. Use role-appropriate evidence, including qualitative outcomes.', sourceIds: ['nyuad-cv', 'saudi-work', 'mit-ats'] },
  fromGuide('bd', 'bangladesh', 'Use consistent English, following the vacancy. Preserve names, degrees and software terminology.'),
];

export function getCountryProfile(id?: string): CountryProfile {
  return COUNTRY_PROFILES.find((profile) => profile.id === id) ?? COUNTRY_PROFILES[0];
}
