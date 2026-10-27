/**
 * Every public claim the site makes about hiring, parsing or law resolves to a
 * row in this file. If a sentence cannot be traced here, it does not ship.
 *
 * Grade A — primary: statute, regulator, standards body, peer-reviewed paper,
 *           first-party vendor documentation.
 * Grade B — institutional: university career centre, established research org.
 * Grade C — secondary: commercial tool citing primary docs. Direction only.
 * Grade D — unreliable: unsourced marketing. Cited only as a myth being corrected.
 *
 * Source IDs in `refs` refer to ATS_Research_Sources_Catalog-v2.xlsx, or to the
 * synthesis reports (PARSING, MYTHS, NORMS, HIRING, AUDIT).
 */

export type EvidenceGrade = 'A' | 'B' | 'C' | 'D';

export interface EvidenceItem {
  id: string;
  claim: string;
  /** What the site is allowed to say, in plain English. */
  publicWording: string;
  grade: EvidenceGrade;
  refs: string[];
  /** Where this claim is surfaced in the product. */
  usedIn: string[];
  caveat?: string;
}

export const EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-REJECT',
    claim: 'ATS software does not auto-reject a resume because of its text, keywords or formatting.',
    publicWording:
      'Applicant tracking systems do not reject you for using a table or missing a keyword. Automatic rejection comes from screening questions a recruiter configured, such as work authorisation or a required licence.',
    grade: 'A',
    refs: ['S23', 'S39', 'MYTHS-C4'],
    usedIn: ['/how-it-works', '/resume-checker', '/faq', '/guides'],
  },
  {
    id: 'EV-75',
    claim: 'The "75% of resumes are rejected by ATS" figure has no published methodology.',
    publicWording:
      'The most repeated statistic in this industry came from a 2011 vendor press release. No sample, no method, no study. It was repeated until it sounded like fact.',
    grade: 'A',
    refs: ['AUDIT-EV-01', 'MYTHS-C1'],
    usedIn: ['/', '/how-it-works', '/guides'],
  },
  {
    id: 'EV-PARSE-ERRORS',
    claim: '43% of real-world resumes contain at least one parsing error.',
    publicWording:
      'In industry parsing data, 43% of resumes contain at least one extraction error. The information is not deleted — it lands in the wrong field, where a recruiter search will never find it.',
    grade: 'B',
    refs: ['S19', 'S31', 'PARSING-D2'],
    usedIn: ['/', '/resume-checker', '/how-it-works'],
  },
  {
    id: 'EV-COLUMNS',
    claim: 'Two-column layouts measurably reduce field extraction accuracy.',
    publicWording:
      'In published batch tests, two-column PDFs extracted 67% of fields correctly against 89% for single-column DOCX. Treat the exact figures as directional; the direction is consistent across parsers.',
    grade: 'C',
    refs: ['AUDIT-EV-05', 'PARSING-D1', 'PARSING-D3'],
    usedIn: ['/resume-templates', '/resume-checker', '/guides/two-column-resume'],
    caveat: 'Batch test published by a commercial tool citing vendor documentation.',
  },
  {
    id: 'EV-25MB',
    claim: 'Greenhouse stops parsing documents above 2.5 MB.',
    publicWording:
      'Some systems stop parsing large files. Greenhouse documents a 2.5 MB parsing limit, so an image-heavy PDF can upload successfully and still be read as nothing.',
    grade: 'A',
    refs: ['AUDIT-EV-04', 'PARSING-D1'],
    usedIn: ['/resume-checker', '/guides/pdf-vs-docx'],
  },
  {
    id: 'EV-OUTSIDE-DOC',
    claim: 'Contact details stored in a document header or footer are frequently skipped.',
    publicWording:
      'Headers and footers live outside the main text flow. Parsers often skip them, which is how candidates end up as nameless profiles in a database.',
    grade: 'A',
    refs: ['PARSING-D1', 'S5'],
    usedIn: ['/resume-checker', '/resume-templates'],
  },
  {
    id: 'EV-TITLES',
    claim: '40.8% of job titles in a 1.8M-profile audit did not match a standard occupational title.',
    publicWording:
      'Job titles vary wildly — "Software Engineer" alone appears in more than 2,000 spellings. Matching by exact title loses candidates, which is why we normalise titles before comparing.',
    grade: 'B',
    refs: ['PARSING-D2'],
    usedIn: ['/job-match', '/how-it-works'],
  },
  {
    id: 'EV-SECONDS',
    claim: 'Recruiters spend roughly 6–7.4 seconds on an initial visual scan.',
    publicWording:
      'Eye-tracking studies record 6 to 7.4 seconds for a recruiter’s first pass. That is a human reading number, not software processing — and it is why structure matters more than adjectives.',
    grade: 'B',
    refs: ['AUDIT-EV-06', 'HIRING-F1', 'HIRING-F2'],
    usedIn: ['/', '/resume-templates', '/guides'],
    caveat: 'Laboratory study; measures triage, not evaluation.',
  },
  {
    id: 'EV-CLARITY',
    claim: 'Clearer writing raised hiring rates by about 8% in a randomised field experiment.',
    publicWording:
      'A randomised field experiment found that jobseekers given writing-clarity help were hired 8% more often. Employers did not rate the clearer applications as weaker.',
    grade: 'A',
    refs: ['AUDIT-EV-16'],
    usedIn: ['/', '/how-it-works', '/guides'],
  },
  {
    id: 'EV-PHOTO-US',
    claim: 'US employers are advised not to request applicant photos before an offer.',
    publicWording:
      'In the United States, EEOC guidance advises against pre-offer photos. Our US preset removes the photo block and explains why.',
    grade: 'A',
    refs: ['AUDIT-EV-07', 'AUDIT-Country-US'],
    usedIn: ['/suite', '/guides/photo-on-resume'],
  },
  {
    id: 'EV-PHOTO-UK',
    claim: 'UK practice is blind CV screening under the Equality Act 2010.',
    publicWording:
      'UK recruiters increasingly screen blind: no photo, no date of birth, no name-first shortlisting. Our UK preset follows that.',
    grade: 'A',
    refs: ['AUDIT-EV-08', 'AUDIT-Country-UK'],
    usedIn: ['/suite', '/guides/photo-on-resume'],
  },
  {
    id: 'EV-BD',
    claim: 'Bangladeshi state recruitment portals require a photo and biographical fields.',
    publicWording:
      'Bangladesh is the opposite of the US and UK. Teletalk AllJobs specifies a 300×300 JPEG photo and biographical fields including parental names, date of birth and national ID. Our Bangladesh preset includes them, because omitting them would fail the application.',
    grade: 'A',
    refs: ['AUDIT-EV-09', 'NORMS-3'],
    usedIn: ['/', '/suite', '/guides/bangladesh-cv'],
  },
  {
    id: 'EV-GULF',
    claim: 'Gulf employers need nationality and visa status for sponsorship.',
    publicWording:
      'In the UAE and Saudi Arabia, nationality and visa status are hiring logistics, not curiosity: the employer sponsors your permit. Our Gulf presets include them.',
    grade: 'B',
    refs: ['AUDIT-EV-10', 'AUDIT-Country-UAE'],
    usedIn: ['/suite', '/guides/gulf-cv'],
  },
  {
    id: 'EV-GDPR',
    claim: 'A photo can reveal special-category data under GDPR Article 9.',
    publicWording:
      'Under the GDPR, a photo can expose special-category data. If you are applying into the EU, the safe default is to leave it out.',
    grade: 'A',
    refs: ['AUDIT-EV-13', 'HIRING-G3'],
    usedIn: ['/guides/photo-on-resume', '/suite'],
  },
  {
    id: 'EV-AIACT',
    claim: 'CV-screening AI is classified high-risk under the EU AI Act.',
    publicWording:
      'The EU AI Act treats recruitment screening as high-risk AI, with full obligations arriving by December 2027. We keep a human in every decision, by design.',
    grade: 'A',
    refs: ['AUDIT-EV-12', 'HIRING-G2'],
    usedIn: ['/how-it-works', '/about'],
  },
  {
    id: 'EV-ONET',
    claim: 'O*NET and ESCO publish open occupational and skills taxonomies.',
    publicWording:
      'Title and skill matching uses O*NET and ESCO, both open under CC BY 4.0, rather than a guess about what your job title means.',
    grade: 'A',
    refs: ['PARSING-E1', 'PARSING-E2'],
    usedIn: ['/how-it-works', '/job-match'],
  },
];

export const MYTHS: { claim: string; verdict: 'false' | 'misleading'; correction: string; refs: string[] }[] = [
  {
    claim: '75% of resumes are rejected by an ATS before a human sees them.',
    verdict: 'false',
    correction:
      'Traced to a 2011 press release by a vendor that closed in 2013. No methodology was ever published. Rejections come from screening questions, not from resume text.',
    refs: ['AUDIT-EV-01'],
  },
  {
    claim: 'Recruiters spend 6 seconds because software filters you out.',
    verdict: 'misleading',
    correction:
      'The 6–7.4 seconds is human eye-tracking triage. It says nothing about automated rejection.',
    refs: ['AUDIT-EV-06'],
  },
  {
    claim: '99% of Fortune 500 companies use AI to eliminate candidates.',
    verdict: 'misleading',
    correction:
      'Most large employers use an ATS database to store applications. Storing is not autonomous rejection.',
    refs: ['MYTHS-C3'],
  },
  {
    claim: 'A two-column designer template is modern and ATS-friendly.',
    verdict: 'false',
    correction:
      'Two-column PDFs merge text across columns in coordinate-based parsers. Single-column remains the safe default.',
    refs: ['PARSING-D1', 'AUDIT-Myth-4'],
  },
];

export const gradeLabel: Record<EvidenceGrade, string> = {
  A: 'Primary source',
  B: 'Institutional research',
  C: 'Secondary — directional',
  D: 'Unsourced — myth only',
};
